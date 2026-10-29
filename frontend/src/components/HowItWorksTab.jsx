import React, { useState } from 'react';
import {
  Layers, Terminal, Database, Cpu, Activity, Server, Laptop, ShieldAlert,
  CheckCircle2, ArrowRight, ExternalLink, Code2, AlertTriangle, BookOpen,
  SlidersHorizontal, Zap, Search, ChevronDown, ChevronRight, FileCode,
  Table, GitCommit, Copy, Check
} from 'lucide-react';
import { ACTION_REGISTRY, ACTION_CATEGORIES } from '../services/actionRegistry';

export default function HowItWorksTab() {
  const [activeSection, setActiveSection] = useState('architecture'); // architecture, actions, api, persistence, ga, modes, metrics, limitations
  const [actionSearch, setActionSearch] = useState('');
  const [actionCategory, setActionCategory] = useState('All');
  const [expandedAction, setExpandedAction] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState('/optimize');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const actionsList = Object.values(ACTION_REGISTRY);

  const filteredActions = actionsList.filter((act) => {
    const matchesCat = actionCategory === 'All' || act.category === actionCategory;
    const q = actionSearch.toLowerCase();
    const matchesSearch =
      !q ||
      act.name.toLowerCase().includes(q) ||
      act.id.toLowerCase().includes(q) ||
      act.component.toLowerCase().includes(q) ||
      (act.backendEndpoint && act.backendEndpoint.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const categories = ['All', ...Object.values(ACTION_CATEGORIES).filter(c => c !== ACTION_CATEGORIES.EXPLAIN_INTERNAL)];

  const sections = [
    { id: 'architecture', label: '1. System Architecture', icon: Layers },
    { id: 'actions', label: '2. Action Explorer', icon: Terminal, count: actionsList.length },
    { id: 'api', label: '3. API Explorer', icon: Server },
    { id: 'persistence', label: '4. Persistence & Files', icon: Database },
    { id: 'ga', label: '5. Genetic Algorithm Engine', icon: Cpu },
    { id: 'modes', label: '6. Execution Modes & Honesty', icon: Laptop },
    { id: 'metrics', label: '7. HPC Metrics Provenance', icon: Activity },
    { id: 'limitations', label: '8. Gaps & Limitations', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Under The Hood • Full System Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            How It Works & Backend Explorer
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Every user click, state mutation, HTTP request, SQLite database transaction, OpenMP C++ island migration, and fallback branch—traced and explained directly from executable source code.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                isActive
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
              {sec.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                  {sec.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: SYSTEM ARCHITECTURE */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Multi-Tier Architecture & Data Movement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The meal optimizer consists of 3 distinct tiers: a React 18 single-page research frontend, a FastAPI asynchronous Python bridge, and high-performance native compiled C++17 OpenMP binaries.
              </p>
            </div>

            {/* Architecture Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: Frontend */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    Tier 1: Client
                  </span>
                  <Laptop className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">React 18 + Vite + Tailwind</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li>• <strong>SPA Architecture:</strong> Tab-based routing in <code>App.jsx</code> with reactive state hooks.</li>
                  <li>• <strong>Dual Fallback:</strong> If backend is offline, runs client heuristic GA in <code>clientOptimizer.js</code>.</li>
                  <li>• <strong>Client Persistence:</strong> Caches pantry locally in <code>localStorage['parallel_pantry_items']</code>.</li>
                  <li>• <strong>Explain Mode:</strong> Embedded drawer with real-time telemetry tracing.</li>
                </ul>
              </div>

              {/* Tier 2: API Gateway */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    Tier 2: Backend
                  </span>
                  <Server className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">FastAPI + SQLite Bridge</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li>• <strong>REST Endpoints:</strong> Full pantry CRUD, simulation, optimization, and metrics.</li>
                  <li>• <strong>SQLite DB:</strong> <code>pantry_planner.db</code> with <code>pantry_items</code> & <code>optimization_history</code>.</li>
                  <li>• <strong>Subprocess Coordinator:</strong> <code>optimizer_bridge.py</code> serializes .dat files and invokes C++ binary.</li>
                  <li>• <strong>Result Enrichment:</strong> Injects photography, step-by-step instructions, and zero-waste tips.</li>
                </ul>
              </div>

              {/* Tier 3: High-Performance Engine */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                    Tier 3: HPC Engine
                  </span>
                  <Cpu className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">C++17 OpenMP Coarse Island GA</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li>• <strong>Binaries:</strong> <code>bin/parallel_ga.exe</code> & <code>bin/sequential_ga.exe</code> compiled with <code>-O3 -fopenmp</code>.</li>
                  <li>• <strong>Island Model:</strong> Partitioned populations with independent thread-local RNG.</li>
                  <li>• <strong>Migration Buffer:</strong> Coarse-grained periodic elite exchange across Ring topology.</li>
                  <li>• <strong>Speedup:</strong> Up to 2.4x speedup over sequential baseline on 4 threads.</li>
                </ul>
              </div>
            </div>

            {/* End-to-End Sequence Walkthrough */}
            <div className="bg-slate-900 rounded-2xl p-6 text-slate-200 space-y-4">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Life of a Request: Clicking "Generate Plan"</span>
              </h4>
              <div className="space-y-3 font-mono text-xs leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[1. Click]</span>
                  <span>User clicks 'Generate Plan' in Navbar → <code>handleReshuffle()</code> generates a fresh seed (e.g. <code>seed=849123</code>).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[2. HTTP]</span>
                  <span>Browser sends <code>POST http://127.0.0.1:8000/optimize</code> with JSON payload (algorithm, num_threads, targets).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[3. Bridge]</span>
                  <span>FastAPI receives request → <code>export_db_pantry_to_dat()</code> queries SQLite and writes temporary file <code>temp_pantry.dat</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[4. Native]</span>
                  <span>Subprocess executes <code>bin/parallel_ga.exe --threads 4 --recipes ... --output_json temp_out.json</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[5. GA Run]</span>
                  <span>OpenMP spawns 4 worker threads. 100 generations evolve across ring islands with migration every 10 generations.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[6. Enrich]</span>
                  <span>Python parses <code>temp_out.json</code>, enriches 4 meal cards with cooking steps and images, records run in <code>optimization_history</code>, cleans up temp files.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">[7. Render]</span>
                  <span>Frontend receives 200 OK → sets <code>optimizationResult</code> state → UI renders 4 meal cards and shows celebratory toast.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACTION-BY-ACTION EXPLORER */}
      {activeSection === 'actions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <span>Interactive Action-by-Action Inventory ({filteredActions.length} Actions)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete trace of every button click, form input, view switch, and indirect automated trigger in the codebase.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActionCategory(c)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                      actionCategory === c
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search actions by name, component handler, or API route..."
                value={actionSearch}
                onChange={(e) => setActionSearch(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 font-medium"
              />
            </div>

            {/* Actions Table / Accordion */}
            <div className="space-y-2.5">
              {filteredActions.map((act) => {
                const isExpanded = expandedAction === act.id;
                return (
                  <div
                    key={act.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-50 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedAction(isExpanded ? null : act.id)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          act.hasBackendCall
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {act.hasBackendCall ? <Server className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{act.name}</span>
                            {act.isUnwiredRoute && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Unwired UI Route
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-600">{act.component}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-emerald-700">{act.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {act.hasBackendCall ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span>{act.backendEndpoint}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            Frontend State Only (No HTTP)
                          </span>
                        )}
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Deep-Dive Details */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-slate-200/80 bg-white rounded-b-2xl space-y-4 text-xs text-slate-700">
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {act.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Handler & Wiring</span>
                            <div>Event Handler: <code className="text-slate-800 font-mono font-bold">{act.handler}</code></div>
                            <div>Source File: <code className="text-emerald-700 font-mono">{act.sourceReference}</code></div>
                            <div>Execution Flow: <span className="text-slate-600">{act.executionPath}</span></div>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Backend & Persistence</span>
                            <div>Backend Route: <code className="text-indigo-700 font-mono font-bold">{act.backendEndpoint || 'None (Client-Only)'}</code></div>
                            <div>Backend Function: <code className="text-slate-800 font-mono">{act.backendFunction || 'N/A'}</code></div>
                            <div>Database Ops: <span className="text-slate-600">{act.dbOperations && act.dbOperations.length > 0 ? act.dbOperations.join('; ') : 'None'}</span></div>
                          </div>
                        </div>

                        {act.fallbackBehavior && (
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                            <strong className="block text-[11px] font-bold text-amber-950 mb-0.5">Offline / Error Fallback Behavior:</strong>
                            <p className="leading-relaxed">{act.fallbackBehavior}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: API EXPLORER */}
      {activeSection === 'api' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                <span>Verified Backend REST API Specification (FastAPI)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every endpoint mounted in <code>backend/main.py</code>. Explains schemas, validation rules, side effects, and UI connectivity.
              </p>
            </div>

            {/* Endpoint Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { path: 'GET /', method: 'GET', label: 'GET /' },
                { path: 'GET /pantry', method: 'GET', label: 'GET /pantry' },
                { path: 'POST /pantry', method: 'POST', label: 'POST /pantry' },
                { path: 'PUT /pantry/{id}', method: 'PUT', label: 'PUT /pantry/{id} (Unwired)' },
                { path: 'DELETE /pantry/{id}', method: 'DELETE', label: 'DELETE /pantry/{id}' },
                { path: 'POST /optimize', method: 'POST', label: 'POST /optimize' },
                { path: 'GET /recommendations', method: 'GET', label: 'GET /recommendations' },
                { path: 'GET /performance', method: 'GET', label: 'GET /performance' },
                { path: 'GET /experiments', method: 'GET', label: 'GET /experiments' },
                { path: 'POST /simulate-pantry-change', method: 'POST', label: 'POST /simulate-pantry-change' },
                { path: 'GET /images/{file}', method: 'GET', label: 'Static /images/*' }
              ].map((ep) => (
                <button
                  key={ep.path}
                  onClick={() => setSelectedEndpoint(ep.path)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    selectedEndpoint === ep.path
                      ? 'bg-slate-900 text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-sans ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                    ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                    ep.method === 'PUT' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span>{ep.path}</span>
                </button>
              ))}
            </div>

            {/* Selected Endpoint Card */}
            {selectedEndpoint === 'POST /optimize' && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-base font-black text-slate-900">POST /optimize (and /api/optimize)</span>
                    <p className="text-slate-500 mt-0.5">Triggers high-speed C++ multi-objective genetic algorithm via subprocess bridge.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active & Calling UI Control: "Generate Plan" / "Reshuffle"
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Request Schema & Defaults</span>
                    <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`{
  "algorithm": "parallel",       // "parallel" or "sequential"
  "num_threads": 4,             // 1 to 16 OpenMP threads
  "dataset_tier": "medium",     // "small" (60), "medium" (500), "large" (2500)
  "population_size": 100,       // GA individuals across islands
  "generations": 100,           // Max evolutionary epochs
  "random_seed": 42,            // Deterministic reproduction
  "target_calories": 2000.0,
  "target_protein": 130.0,
  "target_carbs": 220.0,
  "target_fat": 65.0,
  "required_dietary_tags": [],  // e.g. ["Vegetarian", "Gluten-Free"]
  "correlation_id": "corr_..."  // Tracing correlation ID
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Database & Subprocess Work</span>
                    <ul className="space-y-1.5 leading-relaxed text-slate-600">
                      <li>• <strong>DB Read:</strong> Reads all rows from <code>pantry_items</code> to calculate stock & costs.</li>
                      <li>• <strong>Temp Serialization:</strong> Writes <code>temp_pantry.dat</code> and <code>temp_recipes.dat</code>.</li>
                      <li>• <strong>Subprocess:</strong> Launches <code>bin/parallel_ga.exe</code> with command arguments.</li>
                      <li>• <strong>DB Write:</strong> Appends full run record into <code>optimization_history</code> table.</li>
                      <li>• <strong>Cleanup:</strong> Deletes all temporary files in Python <code>finally</code> block.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Sample Response Payload (200 OK)</span>
                  <pre className="p-3 bg-slate-900 text-cyan-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 scrollbar-thin">
{`{
  "algorithm": "OpenMP Parallel Island GA",
  "num_threads": 4,
  "execution_time_ms": 17.4,
  "best_fitness": 0.218,
  "nutrition_satisfaction_percent": 94.2,
  "expiry_utilization_percent": 88.5,
  "out_of_pocket_cost_inr": 0.0,
  "expiring_items_rescued_count": 4,
  "macro_totals": { "calories": 1980, "protein_g": 134, "carbs_g": 215, "fat_g": 62 },
  "recommendations": [
    {
      "slot": "Breakfast",
      "recipe_id": 436,
      "recipe_name": "Fiesta Grilled Chicken & Quinoa Harvest Bowl",
      "calories": 480,
      "protein_g": 42,
      "prep_time_min": 20,
      "ingredients_used_from_pantry": ["Chicken Breast (200g)", "Spinach (50g)"],
      "instructions": ["Pre-prep protein...", "Sear in skillet...", "..."],
      "image_url": "/images/harvest_bowl_436.png"
    }
  ],
  "trace_meta": {
    "correlation_id": "corr_3a9f1b2c",
    "executable_invoked": "parallel_ga.exe",
    "temp_files_cleaned": true
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedEndpoint === 'GET /recommendations' && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-base font-black text-slate-900">GET /recommendations (and /api/recommendations)</span>
                    <p className="text-slate-500 mt-0.5">Critical Observation: This route does NOT just read saved recommendations!</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Triggers Live Optimization Under The Hood
                  </span>
                </div>
                <div className="space-y-2 leading-relaxed text-slate-600">
                  <p>
                    <strong>Implementation Reality:</strong> Looking at <code>backend/main.py:244</code>:
                  </p>
                  <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px]">
{`@app.get("/recommendations")
def get_latest_recommendations():
    req = OptimizeRequest(algorithm="parallel", num_threads=4, dataset_tier="medium")
    return trigger_optimization(req)`}
                  </pre>
                  <p>
                    Calling <code>GET /recommendations</code> creates a fresh <code>OptimizeRequest</code> and immediately invokes the C++ compiler bridge. It does not return the previous solution from <code>optimization_history</code>.
                  </p>
                </div>
              </div>
            )}

            {selectedEndpoint === 'GET /performance' && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-base font-black text-slate-900">GET /performance (and /benchmark)</span>
                    <p className="text-slate-500 mt-0.5">Loads empirical benchmark summary table.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    Prerecorded Benchmarks (Reads File on Disk)
                  </span>
                </div>
                <div className="space-y-2 leading-relaxed text-slate-600">
                  <p>
                    <strong>Implementation Reality:</strong> When you click "Refresh" on the HPC Metrics dashboard, this endpoint reads <code>results/tables/benchmark_results_summary.json</code> from disk. It does <strong>not</strong> re-run a live multi-thread OpenMP benchmark sweep.
                  </p>
                </div>
              </div>
            )}

            {selectedEndpoint === 'PUT /pantry/{id}' && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-base font-black text-slate-900">PUT /pantry/{'{item_id}'}</span>
                    <p className="text-slate-500 mt-0.5">Updates quantity, days_to_expiry, expiry_date, or estimated_unit_cost.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                    ⚠️ Unwired Endpoint (No UI Control Exists)
                  </span>
                </div>
                <div className="space-y-2 leading-relaxed text-slate-600">
                  <p>
                    <strong>Implementation Gap:</strong> While <code>backend/main.py:191</code> provides a complete <code>update_pantry_item()</code> SQL handler and <code>PantryManager.jsx</code> receives an <code>onUpdateItem</code> prop, inspection of <code>PantryManager.jsx</code> reveals that <strong>no edit button, modal, or inline row editor is rendered in the UI</strong>.
                  </p>
                  <p>
                    Items can be added or deleted, but existing items cannot be directly edited via the current user interface.
                  </p>
                </div>
              </div>
            )}

            {selectedEndpoint !== 'POST /optimize' &&
             selectedEndpoint !== 'GET /recommendations' &&
             selectedEndpoint !== 'GET /performance' &&
             selectedEndpoint !== 'PUT /pantry/{id}' && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-mono text-base font-black text-slate-900">{selectedEndpoint}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Verified Endpoint
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Dual mounted with and without <code>/api</code> prefix in <code>backend/main.py</code>. Handled via SQLite queries or static file server.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: PERSISTENCE & DATA MOVEMENT */}
      {activeSection === 'persistence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>Persistence, Storage Engines & Lifecycle</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Deep-dive into SQLite tables, browser localStorage synchronization, and temporary .dat file lifecycles.
              </p>
            </div>

            {/* SQLite Tables Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-sm">Table: pantry_items</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">SQLite</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-600">
                  <div>• <code>id INTEGER PRIMARY KEY AUTOINCREMENT</code></div>
                  <div>• <code>ingredient_name TEXT NOT NULL</code></div>
                  <div>• <code>quantity REAL NOT NULL</code></div>
                  <div>• <code>unit TEXT NOT NULL</code></div>
                  <div>• <code>days_to_expiry INTEGER NOT NULL</code></div>
                  <div>• <code>expiry_date TEXT NOT NULL</code></div>
                  <div>• <code>estimated_unit_cost REAL NOT NULL</code></div>
                  <div>• <code>category TEXT NOT NULL</code></div>
                  <div>• <code>perishability_hazard REAL NOT NULL</code></div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <strong>Seeding:</strong> On <code>init_db()</code>, if table has 0 rows, it automatically seeds 30 perishable grocery items from <code>data/sample_pantry/pantry_inventory.json</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-sm">Table: optimization_history</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">SQLite</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-600">
                  <div>• <code>id INTEGER PRIMARY KEY AUTOINCREMENT</code></div>
                  <div>• <code>algorithm TEXT NOT NULL</code></div>
                  <div>• <code>num_threads INTEGER NOT NULL</code></div>
                  <div>• <code>execution_time_ms REAL NOT NULL</code></div>
                  <div>• <code>best_fitness REAL NOT NULL</code></div>
                  <div>• <code>calories, protein_g, carbs_g, fat_g REAL</code></div>
                  <div>• <code>out_of_pocket_cost REAL NOT NULL</code></div>
                  <div>• <code>rescued_items INTEGER NOT NULL</code></div>
                  <div>• <code>selected_recipes_json TEXT NOT NULL</code></div>
                  <div>• <code>created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</code></div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <strong>History:</strong> Appended after every successful optimization run in <code>optimizer_bridge.py:483</code>.
                </p>
              </div>
            </div>

            {/* Browser LocalStorage vs SQLite */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5 text-xs text-amber-950">
              <h4 className="font-extrabold text-sm text-amber-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-amber-700" />
                <span>Browser localStorage Synchronization Semantics</span>
              </h4>
              <p className="leading-relaxed">
                The frontend stores an exact copy of pantry state in <code>localStorage.getItem('parallel_pantry_items')</code>.
              </p>
              <ul className="space-y-1 list-disc list-inside text-amber-900">
                <li>When the backend is <strong>online</strong>, <code>fetchPantry()</code> queries <code>GET /pantry</code>, updates React state, and immediately syncs the result to localStorage via <code>saveLocalPantry()</code>.</li>
                <li>When the backend is <strong>offline</strong>, the app falls back seamlessly to <code>getLocalPantry()</code>, reading from localStorage.</li>
                <li><strong>No Background Sync Queue:</strong> Mutations performed while offline are NOT automatically queued for replay when the backend comes back online. The backend's SQLite DB remains the authoritative master.</li>
              </ul>
            </div>

            {/* Ephemeral File Lifecycle */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Ephemeral File Lifecycle (.dat and .json)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                During <code>POST /optimize</code>, Python generates temporary files in the OS temp directory:
              </p>
              <div className="font-mono text-[11px] space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <div>1. <code>tempfile.NamedTemporaryFile(suffix=".dat")</code> &rarr; Formatted binary input for C++ DataLoader</div>
                <div>2. <code>tempfile.NamedTemporaryFile(suffix=".json")</code> &rarr; Target for C++ <code>--output_json</code></div>
                <div>3. <code>finally: os.remove(temp_pantry_dat); os.remove(temp_out_json)</code> &rarr; Guaranteed cleanup</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: GENETIC ALGORITHM ENGINE */}
      {activeSection === 'ga' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <span>High-Performance C++17 Evolutionary Optimization Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Exact mathematical objective functions, coarse-grained island model, and OpenMP ring topology migration.
              </p>
            </div>

            {/* Mathematical Multi-Objective Equations */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 space-y-4 font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-sans">
                Multi-Objective Composite Fitness Function (src/fitness/fitness_evaluator.cpp)
              </span>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-emerald-300">
                <div>F = (0.35 × f_nutr) + (0.35 × f_expiry) - (0.15 × f_cost) - (0.15 × f_waste) - diet_penalty</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <strong className="text-white block mb-1">1. Nutrition Alignment (f_nutr)</strong>
                  <span>f_nutr = max(0, 1 - 0.25 × (|Δcal|/target_cal + |Δprot|/target_prot + |Δcarb|/target_carb + |Δfat|/target_fat))</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <strong className="text-white block mb-1">2. Perishable Expiry Utilization (f_expiry)</strong>
                  <span>urgency = hazard × exp(-days_to_expiry / 3.0)<br/>f_expiry = Σ(util_ratio × urgency) / Σ(urgency)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <strong className="text-white block mb-1">3. Grocery Out-of-Pocket Cost (f_cost)</strong>
                  <span>shortage = max(0, required_qty - pantry_qty)<br/>f_cost = Σ(shortage × unit_cost) / 30.0</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <strong className="text-white block mb-1">4. Food Spoilage Waste Penalty (f_waste)</strong>
                  <span>For critical items (days ≤ 2):<br/>f_waste = Σ(unused_qty × hazard × unit_cost) / 30.0</span>
                </div>
              </div>
            </div>

            {/* Numerical Worked Example */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs text-emerald-950">
              <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Step-by-Step Worked Numerical Example</span>
              </h4>
              <p className="text-emerald-900 leading-relaxed font-medium">
                Suppose a candidate chromosome selects 4 meals delivering <strong>1,950 kcal</strong> (target: 2,000), <strong>128g protein</strong> (target: 130), <strong>215g carbs</strong> (target: 220), and <strong>64g fat</strong> (target: 65):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Δ Calorie Error</span>
                  <strong className="text-emerald-800">|1950 - 2000|/2000 = 2.5%</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Δ Protein Error</span>
                  <strong className="text-emerald-800">|128 - 130|/130 = 1.5%</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Δ Carbs Error</span>
                  <strong className="text-emerald-800">|215 - 220|/220 = 2.3%</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Δ Fat Error</span>
                  <strong className="text-emerald-800">|64 - 65|/65 = 1.5%</strong>
                </div>
              </div>
              <p className="font-mono text-emerald-900 pt-1">
                Average Macro Error = (0.025 + 0.015 + 0.023 + 0.015) / 4 = <strong>0.0195</strong> &rarr; <strong>f_nutr = 0.9805 (98.1%)</strong><br/>
                If expiring utilization f_expiry = 0.85, out-of-pocket cost = ₹0 (f_cost = 0), and f_waste = 0:<br/>
                <strong className="text-emerald-800 font-bold">Composite Fitness F = (0.35 × 0.9805) + (0.35 × 0.85) - 0 - 0 = 0.6407</strong>
              </p>
            </div>

            {/* Coarse Island Model & Ring Topology */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>OpenMP Coarse-Grained Island Topology (src/parallel_ga/parallel_island_ga.cpp)</span>
              </h4>
              <ul className="space-y-1.5 leading-relaxed text-slate-600">
                <li>• <strong>Chromosome Representation:</strong> A 4-element integer vector <code>[Breakfast_ID, Lunch_ID, Dinner_ID, Snack_ID]</code> representing indices into category-compliant recipes.</li>
                <li>• <strong>Population Partitioning:</strong> Total population (default 100) is split evenly across islands (e.g. 4 threads = 25 individuals/island).</li>
                <li>• <strong>Tournament Selection:</strong> Size $k=3$ with independent deterministic thread-local Mersenne Twister RNG (<code>seed + tid * 10007 + 1</code>).</li>
                <li>• <strong>Uniform Crossover:</strong> Rate $p_c = 0.85$, selecting recipe genes 50/50 from parent 1 or parent 2.</li>
                <li>• <strong>Slot Mutation:</strong> Rate $p_m = 0.12$, replacing a meal slot with a random recipe from that category.</li>
                <li>• <strong>Elitism:</strong> Top 2 chromosomes preserved unchanged per island every generation.</li>
                <li>• <strong>Ring Topology Migration:</strong> Every 10 generations, the top 2 elite chromosomes from island $i$ are written to a migration buffer and sent to island $(i+1) \pmod P$, replacing its 2 worst individuals.</li>
                <li>• <strong>Synchronization:</strong> Coarse synchronization with <code>#pragma omp barrier</code> prevents race conditions without fine-grained locks.</li>
              </ul>
            </div>

            {/* MPI Clarification Note */}
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs text-red-950">
              <strong className="text-red-900 text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Clarification: MPI Distributed Memory Status</span>
              </strong>
              <p className="leading-relaxed">
                While the repository contains <code>src/mpi_ga/mpi_island_ga.cpp</code> for multi-node supercomputing clusters (using <code>MPI_Send</code>, <code>MPI_Recv</code>, and <code>MPI_Reduce</code>), <strong>MPI is NOT connected to or callable from the web application</strong>.
              </p>
              <p className="leading-relaxed">
                The Python bridge only invokes <code>bin/parallel_ga.exe</code> (OpenMP shared memory) or <code>bin/sequential_ga.exe</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: EXECUTION MODES & HONESTY */}
      {activeSection === 'modes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-emerald-600" />
                <span>Execution Modes & Honest Transparency Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Clear distinction between native C++ OpenMP execution, client-side browser JavaScript heuristic fallback, and static benchmark datasets.
              </p>
            </div>

            {/* Mode Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Feature / Dimension</th>
                    <th className="py-3 px-4 text-emerald-800">Backend Native (FastAPI + C++)</th>
                    <th className="py-3 px-4 text-amber-800">Browser JavaScript (clientOptimizer.js)</th>
                    <th className="py-3 px-4 text-indigo-800">Static Benchmark Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Execution Runtime</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">Native C++17 (-O3 -fopenmp)</td>
                    <td className="py-3 px-4 font-mono text-amber-700">V8 / Browser JS Engine</td>
                    <td className="py-3 px-4 font-mono text-indigo-700">Static JSON on Disk</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Thread Model</td>
                    <td className="py-3 px-4 text-slate-700">True OpenMP parallel threads (1-16T)</td>
                    <td className="py-3 px-4 text-slate-700">Single-threaded event loop (1T)</td>
                    <td className="py-3 px-4 text-slate-700">Pre-computed across 1, 2, 4, 8 threads</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Timing Measurement</td>
                    <td className="py-3 px-4 font-mono text-slate-700">std::chrono::high_resolution_clock</td>
                    <td className="py-3 px-4 font-mono text-slate-700">window.performance.now()</td>
                    <td className="py-3 px-4 font-mono text-slate-700">Empirical benchmark trials (mean ± std)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Optimization Algorithm</td>
                    <td className="py-3 px-4 text-slate-700">Island Model GA with Ring Migration</td>
                    <td className="py-3 px-4 text-slate-700">Greedy Heuristic Selection by Pantry Overlap</td>
                    <td className="py-3 px-4 text-slate-700">Full 100-generation sweeps across datasets</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Missing Ingredients</td>
                    <td className="py-3 px-4 text-slate-700">Calculated as shortage out-of-pocket cost</td>
                    <td className="py-3 px-4 text-slate-700">Relabeled as "Optional Chef Garnishes"</td>
                    <td className="py-3 px-4 text-slate-700">N/A (Aggregated metric)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Database Persistence</td>
                    <td className="py-3 px-4 text-slate-700">Writes to SQLite optimization_history</td>
                    <td className="py-3 px-4 text-slate-700">Writes only to localStorage pantry array</td>
                    <td className="py-3 px-4 text-slate-700">None</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Honesty Note */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <strong className="text-slate-900 font-bold block">Why Honesty Matters in This Application:</strong>
              <p className="leading-relaxed">
                When deployed on static hosts like Vercel or Netlify without a running Python backend, the application cannot run OpenMP binaries. In this scenario, <code>clientOptimizer.js</code> transparently runs deterministic heuristic ranking in JavaScript, measures real elapsed time using <code>performance.now()</code>, and labels its results as <strong>Browser JavaScript Heuristic Fallback</strong> rather than claiming OpenMP multi-threading.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: HPC METRICS PROVENANCE */}
      {activeSection === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>HPC Performance Metrics & Provenance</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rigorous definitions, mathematical formulas, and provenance of parallel performance metrics displayed in the HPC dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Metric 1</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Speedup S(p)</h4>
                <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                  S(p) = T_1 / T_p
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ratio of sequential execution time $T_1$ to parallel execution time $T_p$ on $p$ threads. Measures performance gain from shared-memory parallelism.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Metric 2</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Parallel Efficiency E(p)</h4>
                <div className="p-2.5 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs">
                  E(p) = S(p) / p × 100%
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Percentage of core utilization. Ideal linear speedup yields 100% efficiency. Degradation reflects synchronization barrier overhead and memory contention.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Metric 3</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Karp-Flatt Metric e</h4>
                <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs">
                  e = (1/S(p) - 1/p) / (1 - 1/p)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Experimentally determined serial fraction of the code. A constant $e$ confirms Amdahl's Law serial bottleneck; an increasing $e$ reveals parallel communication overhead.
                </p>
              </div>
            </div>

            {/* Prerecorded vs Current Run Provenance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <strong className="text-slate-900 text-sm font-bold block">Prerecorded Benchmark Suite vs. Live Single Run:</strong>
              <p className="text-slate-600 leading-relaxed">
                The charts and bar graphs on the <strong>HPC Performance</strong> tab reflect empirical benchmark experiments conducted across 5 test scenarios on a multi-core research workstation. Each data point is the average of multiple repetitions.
              </p>
              <p className="text-slate-600 leading-relaxed">
                In contrast, the top hero banner on the <strong>Daily Meal Plan</strong> tab displays the single-shot execution time of the plan generated for your current pantry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: GAPS & LIMITATIONS */}
      {activeSection === 'limitations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Known Implementation Gaps & Architectural Boundaries</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Full disclosure of known limitations, disconnected endpoints, and features implemented as prototypes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>1. Pantry Item Editing UI Is Unwired</span>
                </div>
                <p className="leading-relaxed">
                  The backend contains a working <code>PUT /pantry/{'{item_id}'}</code> route, and the <code>PantryManager</code> component accepts an <code>onUpdateItem</code> prop, but no edit button or edit modal exists in the interface. To edit an item, users must delete and re-add it.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>2. Viewing a Recipe Does Not Decrement Pantry Stock</span>
                </div>
                <p className="leading-relaxed">
                  Checking cooking steps or viewing a recipe does not automatically decrement ingredient quantities in the database. Stock consumption occurs only when explicitly triggered via the simulation buttons (e.g. "⚡ Consume Chicken") or when deleting items.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>3. MPI Island Model is a Separate Prototype</span>
                </div>
                <p className="leading-relaxed">
                  <code>src/mpi_ga/mpi_island_ga.cpp</code> is designed for distributed supercomputers using MPI rank communication. It is not compiled into the web binary or invoked by the FastAPI server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>4. Browser Mode Relabels Missing Ingredients as Optional</span>
                </div>
                <p className="leading-relaxed">
                  In client fallback mode, if a recipe requires an ingredient not present in the local pantry, it is categorized as an "Optional Chef Garnish", and out-of-pocket costs are set to zero. True out-of-pocket grocery shopping cost calculations are only performed when the native backend evaluates recipes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
