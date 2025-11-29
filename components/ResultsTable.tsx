import React from 'react';
import { QueryResult } from '../types';
import { Clock, AlertCircle, FileJson } from 'lucide-react';

interface ResultsTableProps {
  result: QueryResult | null;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
        <FileJson className="w-12 h-12 mb-3 opacity-20" />
        <p>Run a query to see results here</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Query Error</h4>
          <p className="text-sm mt-1 font-mono opacity-80">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
        {/* Result Header */}
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{result.rows.length} rows</span>
            <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{result.executionTimeMs}ms</span>
            </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-800 sticky top-0 z-10">
                    <tr>
                        {result.columns.map((col) => (
                            <th key={col} className="px-4 py-3 font-semibold text-slate-300 border-b border-slate-700 font-mono text-xs uppercase tracking-wider">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {result.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-800/50 transition-colors">
                            {result.columns.map((col, colIdx) => (
                                <td key={`${rowIdx}-${colIdx}`} className="px-4 py-2.5 text-slate-400 font-mono text-xs border-r border-slate-800/50 last:border-0">
                                    {row[col] === null ? (
                                        <span className="text-slate-600 italic">NULL</span>
                                    ) : typeof row[col] === 'object' ? (
                                        JSON.stringify(row[col])
                                    ) : (
                                        String(row[col])
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ResultsTable;