import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MealPlanView from './components/MealPlanView';
import PantryManager from './components/PantryManager';
import HPCMetricsDashboard from './components/HPCMetricsDashboard';
import NutritionalTargets from './components/NutritionalTargets';
import ImplementationStatus from './components/ImplementationStatus';
import HowItWorksTab from './components/HowItWorksTab';
import ExplainModePanel from './components/ExplainModePanel';
import { traceManager } from './services/traceManager';
import {
  getLocalPantry,
  saveLocalPantry,
  runClientOptimization,
  DEFAULT_PANTRY_ITEMS,
  getIngredientImageUrl
} from './services/clientOptimizer';

export default function App() {
  const [activeTab, setActiveTab] = useState('meals');
  const [pantryItems, setPantryItems] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [explainMode, setExplainMode] = useState(true);

  const [optConfig, setOptConfig] = useState({
    algorithm: 'parallel',
    num_threads: 4,
    dataset_tier: 'medium',
    population_size: 100,
    generations: 100,
    random_seed: 42,
    target_calories: 2000.0,
    target_protein: 130.0,
    target_carbs: 220.0,
    target_fat: 65.0,
    required_dietary_tags: []
  });

  const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000' : '');

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch initial pantry and performance data
  const fetchPantry = async (isStartup = false) => {
    const t0 = performance.now();
    const correlationId = traceManager.generateCorrelationId();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pantry`, {
          headers: { 'X-Correlation-Id': correlationId }
        });
        const t1 = performance.now();
        if (res.ok) {
          const data = await res.json();
          setPantryItems(data);
          saveLocalPantry(data);

          traceManager.recordTrace({
            actionId: isStartup ? 'STARTUP_FETCH_PANTRY' : 'PANTRY_REFRESH_AFTER_MUTATION',
            component: 'App.jsx',
            handler: 'fetchPantry()',
            executionMode: 'backend_native',
            endpoint: 'GET /pantry',
            method: 'GET',
            url: `${API_BASE}/pantry`,
            status: res.status,
            correlationId,
            durationMs: t1 - t0,
            databaseOps: ['SELECT id, ingredient_name, category, quantity, unit, days_to_expiry, cost_per_unit FROM pantry_items ORDER BY days_to_expiry ASC'],
            responseSummary: `Loaded ${data.length} pantry items from SQLite inventory store`,
            uiUpdate: `Set pantryItems state with ${data.length} records`,
            stateChanges: [`pantryItems: ${data.length} items loaded`]
          });
          return data;
        }
      } catch (err) {
        console.warn('Backend unavailable, using client-side pantry store:', err);
      }
    }

    const t1 = performance.now();
    const local = getLocalPantry();
    setPantryItems(local);

    traceManager.recordTrace({
      actionId: isStartup ? 'STARTUP_FETCH_PANTRY' : 'PANTRY_REFRESH_AFTER_MUTATION',
      component: 'App.jsx',
      handler: 'fetchPantry()',
      executionMode: 'browser_fallback',
      status: 200,
      durationMs: t1 - t0,
      fileOps: ['localStorage: read "pantrywise_pantry"'],
      responseSummary: `Retrieved ${local.length} pantry items from localStorage cache`,
      uiUpdate: `Set pantryItems state with ${local.length} local records`,
      stateChanges: [`pantryItems: ${local.length} items from localStorage`]
    });

    return local;
  };

  const fetchPerformance = async () => {
    const t0 = performance.now();
    const correlationId = traceManager.generateCorrelationId();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/performance`, {
          headers: { 'X-Correlation-Id': correlationId }
        });
        const t1 = performance.now();
        if (res.ok) {
          const data = await res.json();
          setPerformanceData(data);

          traceManager.recordTrace({
            actionId: 'STARTUP_FETCH_BENCHMARKS',
            component: 'App.jsx',
            handler: 'fetchPerformance()',
            executionMode: 'backend_native',
            endpoint: 'GET /performance',
            method: 'GET',
            url: `${API_BASE}/performance`,
            status: res.status,
            correlationId,
            durationMs: t1 - t0,
            fileOps: ['Read backend data/benchmark_results_summary.json from server storage'],
            responseSummary: `Loaded prerecorded benchmark sweep data (${data.length} configurations)`,
            uiUpdate: `Updated performanceData state with ${data.length} benchmark datapoints`,
            stateChanges: [`performanceData: ${data.length} records`]
          });
          return;
        }
      } catch (err) {
        console.warn('Backend unavailable, fetching local benchmark dataset:', err);
      }
    }

    try {
      const res = await fetch('/data/benchmark_results_summary.json');
      const t1 = performance.now();
      if (res.ok) {
        const data = await res.json();
        setPerformanceData(data);

        traceManager.recordTrace({
          actionId: 'STARTUP_FETCH_BENCHMARKS',
          component: 'App.jsx',
          handler: 'fetchPerformance()',
          executionMode: 'browser_fallback',
          endpoint: 'GET /data/benchmark_results_summary.json',
          method: 'GET',
          url: '/data/benchmark_results_summary.json',
          status: res.status,
          durationMs: t1 - t0,
          fileOps: ['Static asset GET /data/benchmark_results_summary.json'],
          responseSummary: `Loaded ${data.length} prerecorded benchmark data rows from static assets`,
          uiUpdate: `Set performanceData state with ${data.length} records`,
          stateChanges: [`performanceData: ${data.length} records from static bundle`]
        });
      }
    } catch (e) {
      console.warn('Could not load static benchmark data:', e);
    }
  };

  const handleRunOptimizer = async (customConfig = null, currentPantry = null, triggeringAction = 'MEAL_GENERATE_CLICK') => {
    setIsOptimizing(true);
    const payload = customConfig || optConfig;
    const activePantry = currentPantry || (pantryItems.length > 0 ? pantryItems : getLocalPantry());
    const correlationId = traceManager.generateCorrelationId();
    const t0 = performance.now();

    if (API_BASE) {
      try {
        const requestPayload = { ...payload, correlation_id: correlationId };
        const res = await fetch(`${API_BASE}/optimize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': correlationId
          },
          body: JSON.stringify(requestPayload)
        });
        const t1 = performance.now();

        if (res.ok) {
          const data = await res.json();
          setOptimizationResult(data);
          showToast(`✨ Generated meal plan in ${data.execution_time_ms.toFixed(1)} ms (${data.algorithm}, ${data.num_threads}T)`);
          setIsOptimizing(false);

          traceManager.recordTrace({
            actionId: triggeringAction,
            component: 'App.jsx',
            handler: 'handleRunOptimizer()',
            executionMode: 'backend_native',
            endpoint: 'POST /optimize',
            method: 'POST',
            url: `${API_BASE}/optimize`,
            status: res.status,
            correlationId: data.trace_meta?.correlation_id || correlationId,
            durationMs: t1 - t0,
            requestPayload,
            responseSummary: `Fitness score: ${data.fitness_score?.toFixed(3)}, ${data.meals?.length || 0} meals planned. Native timing: ${data.execution_time_ms.toFixed(2)} ms.`,
            optimizerStages: data.trace_meta?.stages || [
              { stage: 1, name: 'Request Ingestion & Pydantic Validation', duration_ms: 0.1 },
              { stage: 2, name: 'SQLite Inventory & Recipe Loading', duration_ms: 1.2 },
              { stage: 3, name: 'Dietary Tag Pre-filtering', duration_ms: 0.4 },
              { stage: 4, name: 'Shared-Memory OpenMP C++ GA Execution', duration_ms: data.execution_time_ms },
              { stage: 5, name: 'Nutritional & Cost Rollup', duration_ms: 0.3 },
              { stage: 6, name: 'Pydantic Response Serialization', duration_ms: 0.2 }
            ],
            databaseOps: [
              'SELECT * FROM pantry_items',
              'Preprocessed recipe dataset filtered against dietary tags'
            ],
            uiUpdate: `Updated optimizationResult with ${data.meals?.length} meals, macro breakdown and nutritional target deltas`,
            stateChanges: [
              'isOptimizing: false',
              `optimizationResult: Fitness ${data.fitness_score?.toFixed(2)}, ${data.meals?.length} meals`
            ]
          });
          return;
        }
      } catch (err) {
        console.warn('Live backend offline, running client-side GA optimizer:', err);
      }
    }

    // Client-side execution fallback
    try {
      const clientRes = await runClientOptimization(payload, activePantry);
      const t1 = performance.now();
      setOptimizationResult(clientRes);
      showToast(`✨ Generated meal plan in ${clientRes.execution_time_ms.toFixed(1)} ms (${clientRes.algorithm})`);

      traceManager.recordTrace({
        actionId: triggeringAction,
        component: 'App.jsx',
        handler: 'runClientOptimization()',
        executionMode: 'browser_fallback',
        status: 200,
        correlationId,
        durationMs: t1 - t0,
        requestPayload: payload,
        responseSummary: `Browser GA computed ${clientRes.meals?.length || 0} meals in ${clientRes.execution_time_ms.toFixed(1)}ms. Single-threaded heuristic JS.`,
        optimizerStages: clientRes.trace_meta?.stages || [
          { stage: 1, name: 'Local Pantry & Recipe Ingestion', duration_ms: 0.2 },
          { stage: 2, name: 'Dietary Constraint Filtering', duration_ms: 0.5 },
          { stage: 3, name: 'Client-side Heuristic Evolution Loop', duration_ms: clientRes.execution_time_ms },
          { stage: 4, name: 'Nutritional Summary Aggregation', duration_ms: 0.3 }
        ],
        fileOps: ['Read static recipe definitions from clientOptimizer.js'],
        uiUpdate: `Rendered client-side fallback meal plan with ${clientRes.meals?.length} meals`,
        stateChanges: [
          'isOptimizing: false',
          `optimizationResult: Fitness ${clientRes.fitness_score?.toFixed(2)}, ${clientRes.meals?.length} meals`
        ]
      });
    } catch (e) {
      console.error('Client optimizer error:', e);
      showToast('Optimization failed. Please try again.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Reshuffle generates brand new random seeds each time for high recipe diversity
  const handleReshuffle = async () => {
    const freshSeed = Math.floor(Math.random() * 1000000) + 1;
    const freshConfig = { ...optConfig, random_seed: freshSeed };
    setOptConfig(freshConfig);

    traceManager.recordTrace({
      actionId: 'MEAL_RESHUFFLE_CLICK',
      component: 'App.jsx',
      handler: 'handleReshuffle()',
      executionMode: 'ui_only',
      uiUpdate: `Generated random seed ${freshSeed} and re-triggered multi-objective optimization`,
      stateChanges: [`optConfig.random_seed: ${freshSeed}`]
    });

    await handleRunOptimizer(freshConfig, null, 'MEAL_RESHUFFLE_CLICK');
  };

  const handleAddPantryItem = async (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      image_url: getIngredientImageUrl(item.ingredient_name)
    };

    const t0 = performance.now();
    const correlationId = traceManager.generateCorrelationId();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pantry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': correlationId
          },
          body: JSON.stringify(item)
        });
        const t1 = performance.now();

        if (res.ok) {
          const addedData = await res.json();
          traceManager.recordTrace({
            actionId: 'PANTRY_SUBMIT_ADD_ITEM',
            component: 'App.jsx',
            handler: 'handleAddPantryItem()',
            executionMode: 'backend_native',
            endpoint: 'POST /pantry',
            method: 'POST',
            url: `${API_BASE}/pantry`,
            status: res.status,
            correlationId,
            durationMs: t1 - t0,
            requestPayload: item,
            databaseOps: [`INSERT INTO pantry_items (ingredient_name, category, quantity, unit, days_to_expiry, cost_per_unit) VALUES ('${item.ingredient_name}', '${item.category}', ${item.quantity}, '${item.unit}', ${item.days_to_expiry}, ${item.cost_per_unit})`],
            responseSummary: `Created item #${addedData.id} (${addedData.ingredient_name}) in SQLite`,
            uiUpdate: `Triggered pantry refresh and meal plan re-optimization`,
            stateChanges: [`New item added with ID ${addedData.id}`]
          });

          await fetchPantry(false);
          showToast(`Added ${item.ingredient_name} to pantry`);
          handleReshuffle();
          return;
        }
      } catch (err) {
        console.warn('Backend unavailable, adding locally:', err);
      }
    }

    const t1 = performance.now();
    const updated = [newItem, ...pantryItems];
    setPantryItems(updated);
    saveLocalPantry(updated);

    traceManager.recordTrace({
      actionId: 'PANTRY_SUBMIT_ADD_ITEM',
      component: 'App.jsx',
      handler: 'handleAddPantryItem()',
      executionMode: 'browser_fallback',
      status: 200,
      durationMs: t1 - t0,
      requestPayload: item,
      fileOps: ['localStorage: write "pantrywise_pantry"'],
      responseSummary: `Saved ${item.ingredient_name} into localStorage pantry array`,
      uiUpdate: `Prepended item to pantryItems state and triggered client GA run`,
      stateChanges: [`pantryItems: count incremented to ${updated.length}`]
    });

    showToast(`Added ${item.ingredient_name} to pantry`);
    handleRunOptimizer(null, updated, 'PANTRY_SUBMIT_ADD_ITEM');
  };

  const handleDeletePantryItem = async (id) => {
    const t0 = performance.now();
    const correlationId = traceManager.generateCorrelationId();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pantry/${id}`, {
          method: 'DELETE',
          headers: { 'X-Correlation-Id': correlationId }
        });
        const t1 = performance.now();

        if (res.ok) {
          traceManager.recordTrace({
            actionId: 'PANTRY_DELETE_ITEM',
            component: 'App.jsx',
            handler: 'handleDeletePantryItem()',
            executionMode: 'backend_native',
            endpoint: `DELETE /pantry/${id}`,
            method: 'DELETE',
            url: `${API_BASE}/pantry/${id}`,
            status: res.status,
            correlationId,
            durationMs: t1 - t0,
            databaseOps: [`DELETE FROM pantry_items WHERE id = ${id}`],
            responseSummary: `Deleted pantry item #${id} from SQLite database`,
            uiUpdate: `Refreshed pantry list and re-optimized meal plan`,
            stateChanges: [`Removed pantry item #${id}`]
          });

          await fetchPantry(false);
          showToast('Removed item from pantry');
          handleReshuffle();
          return;
        }
      } catch (err) {
        console.warn('Backend unavailable, deleting locally:', err);
      }
    }

    const t1 = performance.now();
    const updated = pantryItems.filter(p => p.id !== id);
    setPantryItems(updated);
    saveLocalPantry(updated);

    traceManager.recordTrace({
      actionId: 'PANTRY_DELETE_ITEM',
      component: 'App.jsx',
      handler: 'handleDeletePantryItem()',
      executionMode: 'browser_fallback',
      status: 200,
      durationMs: t1 - t0,
      fileOps: ['localStorage: update "pantrywise_pantry"'],
      responseSummary: `Filtered out item #${id} and updated localStorage`,
      uiUpdate: `Updated pantryItems state (${updated.length} items remaining)`,
      stateChanges: [`pantryItems: count decremented to ${updated.length}`]
    });

    showToast('Removed item from pantry');
    handleRunOptimizer(null, updated, 'PANTRY_DELETE_ITEM');
  };

  const handleSimulateChange = async (action, ingredient_name) => {
    const t0 = performance.now();
    const correlationId = traceManager.generateCorrelationId();

    const actionIdMap = {
      spoil_warning: 'PANTRY_SIMULATE_SPOIL',
      consume: 'PANTRY_SIMULATE_CONSUME',
      reset: 'PANTRY_SIMULATE_RESET'
    };
    const mappedActionId = actionIdMap[action] || 'PANTRY_SIMULATE_RESET';

    if (API_BASE) {
      try {
        const payload = { action, ingredient_name };
        const res = await fetch(`${API_BASE}/simulate-pantry-change`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': correlationId
          },
          body: JSON.stringify(payload)
        });
        const t1 = performance.now();

        if (res.ok) {
          const data = await res.json();
          await fetchPantry(false);
          if (data.dynamic_reoptimization) {
            setOptimizationResult(data.dynamic_reoptimization);
          } else if (data.optimization_result) {
            setOptimizationResult(data.optimization_result);
          }

          traceManager.recordTrace({
            actionId: mappedActionId,
            component: 'App.jsx',
            handler: 'handleSimulateChange()',
            executionMode: 'backend_native',
            endpoint: 'POST /simulate-pantry-change',
            method: 'POST',
            url: `${API_BASE}/simulate-pantry-change`,
            status: res.status,
            correlationId,
            durationMs: t1 - t0,
            requestPayload: payload,
            databaseOps: [
              action === 'spoil_warning' ? `UPDATE pantry_items SET days_to_expiry = 1 WHERE ingredient_name = '${ingredient_name}'` :
              action === 'consume' ? `UPDATE or DELETE pantry_items WHERE ingredient_name = '${ingredient_name}'` :
              'DELETE FROM pantry_items; INSERT default dataset into pantry_items'
            ],
            responseSummary: `Simulation executed: ${data.action}. Dynamic re-optimization triggered.`,
            uiUpdate: `Refreshed pantry table, updated meal plan, and switched active view to "Daily Meal Plan"`,
            stateChanges: [
              'pantryItems: updated via simulation',
              'optimizationResult: replaced with dynamic reoptimization result',
              'activeTab: "meals"'
            ]
          });

          showToast(`⚡ Real-Time Event: ${data.action}`);
          setActiveTab('meals');
          return;
        }
      } catch (err) {
        console.warn('Backend unavailable, simulating locally:', err);
      }
    }

    // Client-side simulation
    const t1 = performance.now();
    let updated = [...pantryItems];
    let actionDesc = '';
    if (action === 'consume' && ingredient_name) {
      const idx = updated.findIndex(p => p.ingredient_name.toLowerCase() === ingredient_name.toLowerCase());
      if (idx !== -1) {
        const newQty = Math.max(0, updated[idx].quantity - 100);
        if (newQty === 0) {
          updated.splice(idx, 1);
          actionDesc = `Consumed all of ${ingredient_name}`;
        } else {
          updated[idx] = { ...updated[idx], quantity: newQty };
          actionDesc = `Consumed 100g of ${ingredient_name} (left: ${newQty}g)`;
        }
      }
    } else if (action === 'spoil_warning' && ingredient_name) {
      const idx = updated.findIndex(p => p.ingredient_name.toLowerCase() === ingredient_name.toLowerCase());
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], days_to_expiry: 1 };
        actionDesc = `Urgent 24h expiration warning for ${ingredient_name}`;
      }
    } else if (action === 'reset') {
      updated = DEFAULT_PANTRY_ITEMS.map(i => ({ ...i, image_url: getIngredientImageUrl(i.ingredient_name) }));
      actionDesc = 'Reset pantry to default perishable state';
    }

    setPantryItems(updated);
    saveLocalPantry(updated);

    traceManager.recordTrace({
      actionId: mappedActionId,
      component: 'App.jsx',
      handler: 'handleSimulateChange()',
      executionMode: 'browser_fallback',
      status: 200,
      durationMs: t1 - t0,
      requestPayload: { action, ingredient_name },
      fileOps: ['localStorage: save "pantrywise_pantry"'],
      responseSummary: `Client-side simulation applied: ${actionDesc}`,
      uiUpdate: `Updated pantry inventory, triggered client GA re-optimization, switched tab to "meals"`,
      stateChanges: [
        'pantryItems: local state modified',
        'activeTab: "meals"'
      ]
    });

    showToast(`⚡ Real-Time Event: ${actionDesc}`);
    await handleRunOptimizer(null, updated, mappedActionId);
    setActiveTab('meals');
  };

  useEffect(() => {
    async function init() {
      const pantry = await fetchPantry(true);
      await fetchPerformance();
      await handleRunOptimizer(null, pantry, 'STARTUP_INITIAL_OPTIMIZE');
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2.5 ${
            notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-emerald-200 text-emerald-800 shadow-emerald-500/10'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickOptimize={handleReshuffle}
        isOptimizing={isOptimizing}
        pantryCount={pantryItems.length}
        explainMode={explainMode}
        onToggleExplainMode={() => setExplainMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'meals' && (
          <MealPlanView
            optimizationResult={optimizationResult}
            isOptimizing={isOptimizing}
            onReoptimize={handleReshuffle}
            onNavigatePantry={() => setActiveTab('pantry')}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryManager
            pantryItems={pantryItems}
            onAddItem={handleAddPantryItem}
            onDeleteItem={handleDeletePantryItem}
            onSimulateChange={handleSimulateChange}
            isLoading={isOptimizing}
          />
        )}

        {activeTab === 'hpc' && (
          <HPCMetricsDashboard
            performanceData={performanceData}
            onRefresh={fetchPerformance}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionalTargets
            config={optConfig}
            setConfig={setOptConfig}
            onRunOptimizer={(customCfg) => handleRunOptimizer(customCfg, null, 'NUTRITION_APPLY_SETTINGS')}
            isOptimizing={isOptimizing}
          />
        )}

        {activeTab === 'status' && (
          <ImplementationStatus
            apiBase={API_BASE}
            pantryCount={pantryItems.length}
            lastResult={optimizationResult}
          />
        )}

        {activeTab === 'explorer' && (
          <HowItWorksTab />
        )}
      </main>

      {/* Explain Mode Live Side Panel */}
      <ExplainModePanel
        isOpen={explainMode}
        onClose={() => setExplainMode(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-700">
          PantryWise • High-Performance Parallel Multi-Objective Optimization for Real-Time Meal Planning
        </p>
        <p>
          OpenMP Shared-Memory Coarse-Grained Island Model • Authors: Kashish Upadhyay & Animesh Labh
        </p>
      </footer>
    </div>
  );
}
