export enum DbType {
  POSTGRES = 'PostgreSQL',
  MYSQL = 'MySQL',
  MONGODB = 'MongoDB',
  REDIS = 'Redis'
}

export interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface DatabaseSchema {
  tables: Table[];
}

export interface Connection {
  id: string;
  name: string;
  type: DbType;
  host: string;
  status: 'connected' | 'disconnected' | 'error';
  schema: DatabaseSchema;
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  executionTimeMs: number;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}