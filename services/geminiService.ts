import { GoogleGenAI, Type } from "@google/genai";
import { DatabaseSchema, QueryResult } from "../types";

// Initialize Gemini
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Converts natural language to SQL based on the provided schema.
 */
export const generateSqlFromPrompt = async (
  prompt: string,
  schema: DatabaseSchema,
  dbType: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "-- Error: API Key is missing. Please check your environment configuration.";
  }

  const schemaDescription = schema.tables.map(t => 
    `Table ${t.name} columns: ${t.columns.map(c => `${c.name} (${c.type})`).join(', ')}`
  ).join('\n');

  const systemInstruction = `You are an expert database engineer. 
  Your task is to convert natural language queries into valid SQL for ${dbType}.
  Only return the SQL query. Do not use markdown backticks. Do not add explanations.
  
  Schema Context:
  ${schemaDescription}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Low temperature for precise code generation
      },
    });

    return response.text?.trim() || "-- Could not generate SQL";
  } catch (error) {
    console.error("Gemini SQL Generation Error:", error);
    return `-- Error generating SQL: ${error instanceof Error ? error.message : String(error)}`;
  }
};

/**
 * Explains a complex SQL query in plain English.
 */
export const explainSql = async (sql: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Explain the following SQL query in simple terms for a junior developer:\n\n${sql}`,
      config: {
        systemInstruction: "You are a helpful coding tutor. Keep explanations concise and bulleted."
      }
    });
    return response.text || "No explanation available.";
  } catch (error) {
    return "Failed to explain query.";
  }
};

/**
 * Simulates database execution by asking Gemini to generate realistic mock data 
 * that would result from the query. This allows the app to feel "real" without a backend.
 */
export const simulateQueryExecution = async (
  sql: string,
  schema: DatabaseSchema
): Promise<QueryResult> => {
  if (!process.env.API_KEY) {
     return {
      columns: ['error'],
      rows: [{ error: "API Key missing. Cannot simulate query." }],
      executionTimeMs: 0,
      error: "API Key missing"
    };
  }

  const schemaCtx = schema.tables.map(t => t.name).join(', ');

  try {
    const start = performance.now();
    
    // We ask Gemini to generate the result set as JSON
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Execute this SQL query virtually and generate 3 to 5 realistic rows of result data as a JSON object.
      
      SQL: ${sql}
      
      Schema Tables Available: ${schemaCtx}
      
      The output must strictly be a JSON object with two keys: "columns" (array of strings) and "rows" (array of objects matching columns).
      Ensure data types match the likely schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            columns: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            rows: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT } // Allowing dynamic objects
            }
          },
          required: ["columns", "rows"]
        }
      }
    });

    const end = performance.now();
    
    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        columns: parsed.columns,
        rows: parsed.rows,
        executionTimeMs: Math.round(end - start)
      };
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Simulation Error:", error);
    return {
      columns: ['error'],
      rows: [],
      executionTimeMs: 0,
      error: "Failed to simulate query execution. " + (error instanceof Error ? error.message : "")
    };
  }
};