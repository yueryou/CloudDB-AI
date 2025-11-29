import React, { useState, useEffect } from 'react';
import { MOCK_CONNECTIONS } from './constants';
import { Connection, QueryResult } from './types';
import Sidebar from './components/Sidebar';
import SqlEditor from './components/SqlEditor';
import ResultsTable from './components/ResultsTable';
import SchemaViewer from './components/SchemaViewer';
import ConnectionModal from './components/ConnectionModal';
import { simulateQueryExecution } from './services/geminiService';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>(MOCK_CONNECTIONS);
  const [activeConnectionId, setActiveConnectionId] = useState<string>(MOCK_CONNECTIONS[0].id);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const activeConnection = connections.find(c => c.id === activeConnectionId) || connections[0];

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("API KEY is missing from process.env");
    }
  }, []);

  const handleRunQuery = async () => {
    if (!query) return;
    
    setIsExecuting(true);
    setQueryResult(null);
    
    try {
      const result = await simulateQueryExecution(query, activeConnection.schema);
      setQueryResult(result);
    } catch (e) {
      setQueryResult({
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Execution failed"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddConnection = (newConnection: Connection) => {
    setConnections(prev => [...prev, newConnection]);
    setActiveConnectionId(newConnection.id);
    setIsConnectionModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      {/* Modal */}
      <ConnectionModal 
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onConnect={handleAddConnection}
      />

      {/* Sidebar */}
      <Sidebar 
        connections={connections}
        activeConnectionId={activeConnectionId}
        onSelectConnection={setActiveConnectionId}
        onAddConnection={() => setIsConnectionModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <div className="h-16 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-slate-400">
                    <span className="font-semibold text-white">{activeConnection.name}</span>
                    <span className="mx-2 text-slate-600">/</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">{activeConnection.type}</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-700"></div>
                <div className="flex items-center space-x-1 text-xs text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>Online</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
               {!process.env.API_KEY && (
                 <div className="bg-amber-900/30 text-amber-200 text-xs px-3 py-1 rounded border border-amber-900/50 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    <span>Demo Mode (API Key Missing)</span>
                 </div>
               )}
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 overflow-hidden">
            <div className="grid grid-cols-12 gap-6 h-full">
                
                {/* Left Column: Editor & Results */}
                <div className="col-span-9 flex flex-col gap-6 h-full min-h-0">
                    {/* Top: Editor */}
                    <div className="h-1/2 min-h-[300px]">
                        <SqlEditor 
                            value={query}
                            onChange={setQuery}
                            onRun={handleRunQuery}
                            schema={activeConnection.schema}
                            dbType={activeConnection.type}
                            isExecuting={isExecuting}
                        />
                    </div>
                    {/* Bottom: Results */}
                    <div className="flex-1 min-h-0">
                         <ResultsTable result={queryResult} />
                    </div>
                </div>

                {/* Right Column: Schema */}
                <div className="col-span-3 h-full min-h-0 bg-slate-900 rounded-lg border border-slate-700 p-4">
                    <SchemaViewer schema={activeConnection.schema} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;