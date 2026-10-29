import React from 'react';
import {
  UtensilsCrossed, Refrigerator, BarChart2, SlidersHorizontal, Sparkles,
  Zap, Leaf, ShieldCheck, BookOpen, Activity, Eye, EyeOff
} from 'lucide-react';
import { traceManager } from '../services/traceManager';

export default function Navbar({
  activeTab,
  setActiveTab,
  onQuickOptimize,
  isOptimizing,
  pantryCount = 30,
  explainMode = false,
  onToggleExplainMode
}) {
  const navItems = [
    { id: 'meals', label: 'Daily Meal Plan', icon: UtensilsCrossed, actionId: 'NAV_TAB_MEALS' },
    { id: 'pantry', label: 'Pantry Inventory', icon: Refrigerator, count: pantryCount, actionId: 'NAV_TAB_PANTRY' },
    { id: 'hpc', label: 'HPC Performance', icon: BarChart2, actionId: 'NAV_TAB_HPC' },
    { id: 'nutrition', label: 'Nutrition & Diets', icon: SlidersHorizontal, actionId: 'NAV_TAB_NUTRITION' },
    { id: 'status', label: 'System Status', icon: ShieldCheck, actionId: 'NAV_TAB_STATUS' },
    { id: 'explorer', label: 'How It Works', icon: BookOpen, actionId: 'NAV_TAB_HOW_IT_WORKS' },
  ];

  const handleTabClick = (item) => {
    traceManager.recordTrace({
      actionId: item.actionId,
      component: 'Navbar.jsx',
      handler: `onClick={() => setActiveTab("${item.id}")}`,
      stateChanges: [`activeTab: "${item.id}"`]
    });
    setActiveTab(item.id);
  };

  const handleLogoClick = () => {
    traceManager.recordTrace({
      actionId: 'NAV_LOGO_CLICK',
      component: 'Navbar.jsx',
      handler: 'onClick={() => setActiveTab("meals")}',
      stateChanges: ['activeTab: "meals"']
    });
    setActiveTab('meals');
  };

  const handleQuickOptimizeClick = () => {
    traceManager.recordTrace({
      actionId: 'NAV_QUICK_OPTIMIZE',
      component: 'Navbar.jsx',
      handler: 'onClick={onQuickOptimize} -> handleReshuffle()',
      stateChanges: ['isOptimizing: true', 'random_seed: fresh']
    });
    onQuickOptimize();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={handleLogoClick}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Pantry<span className="text-emerald-600">Wise</span></span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  OpenMP Island GA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Zero-Waste AI Meal Optimization</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Tab Dropdown / Horizontal Scroll */}
          <div className="lg:hidden flex items-center overflow-x-auto max-w-[200px] sm:max-w-xs scrollbar-none py-1">
            <select
              value={activeTab}
              onChange={(e) => {
                const found = navItems.find(i => i.id === e.target.value);
                if (found) handleTabClick(found);
              }}
              className="text-xs font-bold py-1.5 px-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-800"
            >
              {navItems.map((i) => (
                <option key={i.id} value={i.id}>{i.label}</option>
              ))}
            </select>
          </div>

          {/* Right Action Controls: Explain Mode Toggle & Generate Plan */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Global Explain Mode Toggle Button */}
            <button
              onClick={onToggleExplainMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                explainMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs ring-1 ring-emerald-400/30'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Explain Mode live side panel"
            >
              <Activity className={`w-3.5 h-3.5 ${explainMode ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Explain Mode:</span>
              <span className={`font-mono font-extrabold ${explainMode ? 'text-emerald-700' : 'text-slate-500'}`}>
                {explainMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Quick Optimize Button */}
            <button
              onClick={handleQuickOptimizeClick}
              disabled={isOptimizing}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isOptimizing ? 'Optimizing...' : 'Generate Plan'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
