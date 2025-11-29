import React, { useState } from 'react';
import { X, Database, Loader2, Check } from 'lucide-react';
import { DbType, Connection } from '../types';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connection: Connection) => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: DbType.POSTGRES,
    host: 'localhost',
    port: '5432',
    username: '',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.host) return;

    setIsConnecting(true);
    
    // Simulate network connection delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a mock schema based on type to allow immediate testing
    const mockSchema = {
      tables: [
        {
          name: 'demo_users',
          columns: [
            { name: 'id', type: 'integer', isPrimaryKey: true },
            { name: 'username', type: 'varchar(50)' },
            { name: 'created_at', type: 'timestamp' }
          ]
        }
      ]
    };

    const newConnection: Connection = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      host: `${formData.host}:${formData.port}`,
      status: 'connected',
      schema: mockSchema
    };

    onConnect(newConnection);
    setIsConnecting(false);
    
    // Reset form
    setFormData({
      name: '',
      type: DbType.POSTGRES,
      host: 'localhost',
      port: '5432',
      username: '',
      password: ''
    });
  };

  const inputClass = "w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 placeholder:text-slate-600 transition-all";
  const labelClass = "block text-xs font-medium text-slate-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-800/50">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-blue-500" />
              New Connection
            </h3>
            <p className="text-xs text-slate-400 mt-1">Connect to your database instance</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="connection-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Connection Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="e.g. Staging DB" 
                  className={inputClass}
                  required
                  autoFocus
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Database Type</label>
                <div className="relative">
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {Object.values(DbType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Port</label>
                <input 
                  type="number" 
                  name="port" 
                  value={formData.port} 
                  onChange={handleChange}
                  placeholder="5432" 
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Host</label>
                <input 
                  type="text" 
                  name="host" 
                  value={formData.host} 
                  onChange={handleChange}
                  placeholder="localhost or 192.168.x.x" 
                  className={inputClass}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange}
                  placeholder="admin" 
                  className={inputClass}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className={inputClass}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-800/30 flex justify-end items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-md"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="connection-form"
            disabled={isConnecting || !formData.name}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Connect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;