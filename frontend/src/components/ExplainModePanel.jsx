import React, { useState, useEffect } from 'react';
import {
  Activity, X, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle,
  Server, Laptop, Database, FileCode, Clock, Cpu, ArrowUpRight,
  RefreshCw, Trash2, ShieldCheck, Eye, Terminal, Layers
} from 'lucide-react';
import { traceManager } from '../services/traceManager';

export default function ExplainModePanel({ isOpen, onClose }) {
  const [traces, setTraces] = useState(traceManager.getTraces());
  const [selectedTrace, setSelectedTrace] = useState(traceManager.getLatestTrace());
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'technical'
  const [searchFilter, setSearchFilter] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = traceManager.subscribe((newTraces, latest) => {
      setTraces(newTraces);
      setSelectedTrace((prev) => {
        // If nothing was selected or user was watching the latest, update to latest
        if (!prev || (newTraces.length > 0 && prev.traceId === newTraces[1]?.traceId)) {
          return latest;
        }
        return prev || latest;
      });
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const filteredTraces = traces.filter((t) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.actionName.toLowerCase().includes(q) ||
      t.component.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.actionId.toLowerCase().includes(q)
    );
  });

  const activeTrace = selectedTrace || traces[0];

  const getModeBadge = (mode) => {
    switch (mode) {
      case 'backend_native':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Server className="w-3 h-3 text-emerald-600" />
            <span>FastAPI + C++ Native</span>
          </span>
        );
      case 'browser_fallback':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Laptop className="w-3 h-3 text-amber-600" />
            <span>Browser JS Fallback</span>
          </span>
        );
      case 'frontend_only':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Laptop className="w-3 h-3 text-slate-500" />
            <span>Frontend State Only</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Success</span>
          </span>
        );
      case 'fallback':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Fallback</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Error</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            <Activity className="w-3 h-3 animate-spin text-cyan-600" />
            <span>In Flight</span>
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="Explain Mode Live Inspector"
      className={`fixed right-0 top-18 bottom-0 z-50 bg-white/95 backdrop-blur-md border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-16' : 'w-full sm:w-[500px] md:w-[560px] lg:w-[600px]'
      }`}
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          {!isMinimized && (
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Explain Mode</h3>
                <span className="px-2 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 uppercase tracking-wider">
                  Live Trace
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Real-time interaction & backend telemetry</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isMinimized && (
            <button
              onClick={() => traceManager.clearTraces()}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition text-xs flex items-center gap-1 font-semibold"
              title="Clear Trace History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            title={isMinimized ? 'Expand panel' : 'Minimize panel'}
          >
            {isMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            title="Close Explain Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isMinimized ? (
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs"
            title="Expand Explain Mode"
          >
            <Eye className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Explain Mode
          </span>
          <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600">
            {traces.length}
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Controls: View Mode Switch & Search */}
          <div className="p-3 border-b border-slate-100 bg-white space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setViewMode('simple')}
                  className={`px-3 py-1 rounded-lg transition ${
                    viewMode === 'simple'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Simple Explanation
                </button>
                <button
                  onClick={() => setViewMode('technical')}
                  className={`px-3 py-1 rounded-lg transition ${
                    viewMode === 'technical'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Technical Details
                </button>
              </div>

              <span className="text-xs font-mono text-slate-500 font-semibold">
                {traces.length} trace{traces.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Quick Action Search / Filter */}
            <input
              type="text"
              placeholder="Filter actions by name, component, or category..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 font-medium placeholder-slate-400"
            />
          </div>

          {/* Trace Event Selector Reel (Horizontal or Compact List) */}
          <div className="border-b border-slate-200 bg-slate-50/50 p-2 overflow-x-auto whitespace-nowrap flex gap-2 shrink-0 scrollbar-thin">
            {filteredTraces.length === 0 ? (
              <span className="text-xs text-slate-400 italic px-2 py-1">No matching traces found</span>
            ) : (
              filteredTraces.map((t) => {
                const isSelected = activeTrace?.traceId === t.traceId;
                return (
                  <button
                    key={t.traceId}
                    onClick={() => setSelectedTrace(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-white border-emerald-400 text-emerald-900 shadow-sm font-bold ring-1 ring-emerald-400/20'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="max-w-[140px] truncate">{t.actionName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{t.durationMs}ms</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Trace Inspector Body */}
          {activeTrace ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs text-slate-700">
              {/* Header Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-500">
                    {activeTrace.category} • {activeTrace.actionId}
                  </span>
                  <div className="flex items-center gap-2">
                    {getModeBadge(activeTrace.executionMode)}
                    {getStatusBadge(activeTrace.status)}
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {activeTrace.actionName}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeTrace.explanation}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                  <span>⏱️ Duration: <strong>{activeTrace.durationMs} ms</strong></span>
                  <span>Scope: {activeTrace.measurementScope}</span>
                </div>
              </div>

              {/* Simple View */}
              {viewMode === 'simple' ? (
                <div className="space-y-4">
                  {/* What Happened Step-by-Step */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <h5 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Interaction Flow Summary</span>
                    </h5>
                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 shrink-0">1. User Interaction:</span>
                        <span>Clicked or changed a control in <code>{activeTrace.component}</code> (handler: <code>{activeTrace.handler}</code>).</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-teal-700 shrink-0">2. Execution Path:</span>
                        <span>{activeTrace.executionMode === 'backend_native'
                          ? 'Sent an HTTP network request to the local FastAPI Python service.'
                          : activeTrace.executionMode === 'browser_fallback'
                          ? 'Processed instantly in your browser via client-side JavaScript heuristic.'
                          : 'Handled entirely in React state with zero network calls.'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-cyan-700 shrink-0">3. Persistence / Data:</span>
                        <span>{activeTrace.dbOperations && activeTrace.dbOperations.length > 0
                          ? `Updated database records: ${activeTrace.dbOperations.join('; ')}`
                          : 'No database modification was required for this interaction.'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-indigo-700 shrink-0">4. UI Outcome:</span>
                        <span>React state updated and refreshed the screen in {activeTrace.durationMs} ms.</span>
                      </div>
                    </div>
                  </div>

                  {/* High-level source link card */}
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Source Component</span>
                      <code className="text-emerald-800 font-mono font-semibold">{activeTrace.sourceReference}</code>
                    </div>
                    <span className="text-emerald-700 text-xs font-semibold">Verified Source</span>
                  </div>
                </div>
              ) : (
                /* Technical Details View */
                <div className="space-y-4">
                  {/* Component & Handler */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Frontend Wiring</span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Component</span>
                        <strong className="text-slate-800">{activeTrace.component}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Event Handler</span>
                        <strong className="text-slate-800">{activeTrace.handler}</strong>
                      </div>
                      <div className="col-span-2 pt-1">
                        <span className="text-slate-500 block text-[10px]">Source File Link</span>
                        <code className="text-emerald-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 block truncate">
                          {activeTrace.sourceReference}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Network Request & Response */}
                  {activeTrace.requestSummary && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">HTTP Request Summary</span>
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed scrollbar-thin">
                        {JSON.stringify(activeTrace.requestSummary, null, 2)}
                      </pre>
                    </div>
                  )}

                  {activeTrace.responseSummary && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">HTTP Response Summary</span>
                      <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
                        {JSON.stringify(activeTrace.responseSummary, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Optimizer Stages (if instrumented) */}
                  {activeTrace.optimizerStages && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Observed Optimizer Pipeline Stages</span>
                      <div className="space-y-2">
                        {activeTrace.optimizerStages.map((st, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800 block text-[11px]">{st.stage}</span>
                              <span className="text-[10px] text-slate-500 font-sans">{st.description}</span>
                            </div>
                            <span className="text-emerald-700 font-bold ml-2 shrink-0">{st.duration_ms} ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Database Operations */}
                  {activeTrace.dbOperations && activeTrace.dbOperations.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Database Operations (SQLite)</span>
                      </span>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {activeTrace.dbOperations.map((op, i) => (
                          <div key={i} className="p-2 bg-indigo-50/60 text-indigo-950 rounded-lg border border-indigo-200/60 break-all">
                            {op}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Operations */}
                  {activeTrace.fileOperations && activeTrace.fileOperations.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-amber-600" />
                        <span>File System Operations</span>
                      </span>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {activeTrace.fileOperations.map((fop, i) => (
                          <div key={i} className="p-2 bg-amber-50/60 text-amber-950 rounded-lg border border-amber-200/60">
                            {fop}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* State Changes */}
                  {activeTrace.stateChanges && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Local State Mutations</span>
                      <div className="space-y-1 font-mono text-[11px]">
                        {Array.isArray(activeTrace.stateChanges) ? (
                          activeTrace.stateChanges.map((sc, i) => (
                            <div key={i} className="p-1.5 bg-slate-50 text-slate-800 rounded border border-slate-200">
                              {sc}
                            </div>
                          ))
                        ) : (
                          <pre className="p-2 bg-slate-50 text-slate-800 rounded border border-slate-200">
                            {JSON.stringify(activeTrace.stateChanges, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Technical Identifiers */}
                  <div className="p-3 rounded-xl bg-slate-100 text-[10px] font-mono text-slate-500 space-y-1">
                    <div>Trace ID: <strong className="text-slate-700">{activeTrace.traceId}</strong></div>
                    <div>Timestamp: <span>{activeTrace.timestamp}</span></div>
                    {activeTrace.correlationId && (
                      <div>Correlation ID: <strong className="text-emerald-700">{activeTrace.correlationId}</strong></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Activity className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="font-semibold text-sm text-slate-600">No actions recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Interact with the application tabs, add or delete ingredients, or reshuffle recipes to view real-time traces here.
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

