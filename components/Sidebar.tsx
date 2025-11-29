import React from 'react';
import { Connection } from '../types';
import { Database, Server, Plus, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  connections: Connection[];
  activeConnectionId: string | null;
  onSelectConnection: (id: string) => void;
  onAddConnection: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ connections, activeConnectionId, onSelectConnection, onAddConnection }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Database className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white tracking-wide">CloudDB AI</span>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-4 mb-2 flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connections</h3>
          <button 
            onClick={onAddConnection}
            className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
            title="Add New Connection"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1 px-2">
          {connections.map((conn) => (
            <button
              key={conn.id}
              onClick={() => onSelectConnection(conn.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                activeConnectionId === conn.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Server className={`w-4 h-4 ${activeConnectionId === conn.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium truncate">{conn.name}</div>
                <div className="text-[10px] opacity-60 truncate">{conn.host}</div>
              </div>
              <div className={`w-2 h-2 rounded-full shrink-0 ${conn.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-sm text-slate-400 hover:text-white cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:shadow-purple-500/20 transition-all">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">Jane Smith</div>
            <div className="text-xs truncate">Admin Workspace</div>
          </div>
          <Settings className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;