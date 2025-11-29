import React from 'react';
import { DatabaseSchema, Table } from '../types';
import { Table as TableIcon, Key, Hash, Type, Calendar } from 'lucide-react';

interface SchemaViewerProps {
  schema: DatabaseSchema;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema }) => {
  const getIconForType = (type: string) => {
    if (type.includes('int') || type.includes('decimal') || type.includes('numeric')) return <Hash className="w-3 h-3" />;
    if (type.includes('date') || type.includes('time')) return <Calendar className="w-3 h-3" />;
    return <Type className="w-3 h-3" />;
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Schema Explorer</h3>
      <div className="space-y-4">
        {schema.tables.map((table: Table) => (
          <div key={table.name} className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="bg-slate-800 px-3 py-2 border-b border-slate-700/50 flex items-center space-x-2">
              <TableIcon className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200 text-sm">{table.name}</span>
            </div>
            <div className="p-2 space-y-1">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-slate-700/30">
                  <div className="flex items-center space-x-2 text-slate-300">
                    {col.isPrimaryKey ? (
                      <Key className="w-3 h-3 text-amber-400" />
                    ) : (
                      <div className="w-3" />
                    )}
                    <span className={col.isPrimaryKey ? 'font-medium text-amber-100' : ''}>{col.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    {getIconForType(col.type)}
                    <span className="font-mono text-[10px]">{col.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;