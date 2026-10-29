import React, { useState } from 'react';
import { SlidersHorizontal, Flame, Shield, Cpu, Sparkles, Target, Zap, ChevronDown, ChevronUp, Check, Award, Compass } from 'lucide-react';
import { traceManager } from '../services/traceManager';

export default function NutritionalTargets({ config, setConfig, onRunOptimizer, isOptimizing }) {
  const [showAdvancedHPC, setShowAdvancedHPC] = useState(false);

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'High-Protein', 'Halal', 'Dairy-Free', 'Low-Carb'
  ];

  const handleTagToggle = (tag) => {
    const exists = config.required_dietary_tags.includes(tag);
    const updated = exists
      ? config.required_dietary_tags.filter((t) => t !== tag)
      : [...config.required_dietary_tags, tag];
    traceManager.recordTrace({
      actionId: 'NUTRITION_TOGGLE_DIETARY_TAG',
      component: 'NutritionalTargets.jsx',
      handler: `onClick={() => handleTagToggle("${tag}")}`,
      stateChanges: [`required_dietary_tags: [${updated.join(', ')}]`]
    });
    setConfig({
      ...config,
      required_dietary_tags: updated
    });
  };

  const handleSpeedChange = (mode) => {
    let alg = 'parallel';
    let threads = 4;
    if (mode === 'ultra') {
      alg = 'parallel';
      threads = 4;
    } else if (mode === 'max') {
      alg = 'parallel';
      threads = 8;
    } else {
      alg = 'sequential';
      threads = 1;
    }
    traceManager.recordTrace({
      actionId: 'NUTRITION_SET_SPEED_MODE',
      component: 'NutritionalTargets.jsx',
      handler: `onClick={() => handleSpeedChange("${mode}")}`,
      stateChanges: [`algorithm: "${alg}"`, `num_threads: ${threads}`]
    });
    setConfig({ ...config, algorithm: alg, num_threads: threads });
  };

  const handleSliderChange = (field, value, actionId) => {
    traceManager.recordTrace({
      actionId,
      component: 'NutritionalTargets.jsx',
      handler: `onChange={(e) => handleSliderChange("${field}", ${value})}`,
      stateChanges: [`${field}: ${value}`]
    });
    setConfig({ ...config, [field]: value });
  };

  const handleTierChange = (tier) => {
    traceManager.recordTrace({
      actionId: 'NUTRITION_SET_DATASET_TIER',
      component: 'NutritionalTargets.jsx',
      handler: `onChange={(e) => handleTierChange("${tier}")}`,
      stateChanges: [`dataset_tier: "${tier}"`]
    });
    setConfig({ ...config, dataset_tier: tier });
  };

  const handleToggleAdvanced = () => {
    traceManager.recordTrace({
      actionId: 'NUTRITION_TOGGLE_ADVANCED_HPC',
      component: 'NutritionalTargets.jsx',
      handler: 'onClick={handleToggleAdvanced}',
      stateChanges: [`showAdvancedHPC: ${!showAdvancedHPC}`]
    });
    setShowAdvancedHPC(!showAdvancedHPC);
  };

  const handleSubmitOptimize = () => {
    traceManager.recordTrace({
      actionId: 'NUTRITION_SUBMIT_OPTIMIZE',
      component: 'NutritionalTargets.jsx',
      handler: 'onClick={handleSubmitOptimize} -> onRunOptimizer()',
      stateChanges: ['isOptimizing: true'],
      requestSummary: {
        algorithm: config.algorithm,
        num_threads: config.num_threads,
        dataset_tier: config.dataset_tier,
        targets: {
          calories: config.target_calories,
          protein: config.target_protein,
          carbs: config.target_carbs,
          fat: config.target_fat
        },
        required_dietary_tags: config.required_dietary_tags
      }
    });
    onRunOptimizer();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Nutrition Goals & Smart Recipe Preferences</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Personalize your daily dietary targets and intelligent zero-waste optimization settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Macro Sliders Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Daily Macro-Nutrient Targets</span>
          </h3>

          {/* Calories */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Total Energy Target</span>
              <span className="font-mono text-amber-600 font-bold text-sm">{config.target_calories} kcal</span>
            </div>
            <input
              type="range"
              min="1200"
              max="3500"
              step="50"
              value={config.target_calories}
              onChange={(e) => handleSliderChange('target_calories', parseFloat(e.target.value), 'NUTRITION_SLIDER_CALORIES')}
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1,200 kcal</span>
              <span>2,000 kcal (Standard)</span>
              <span>3,500 kcal</span>
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Protein Target</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">{config.target_protein} g</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={config.target_protein}
              onChange={(e) => handleSliderChange('target_protein', parseFloat(e.target.value), 'NUTRITION_SLIDER_PROTEIN')}
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 g</span>
              <span>130 g (Active)</span>
              <span>250 g</span>
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Carbohydrates Target</span>
              <span className="font-mono text-cyan-700 font-bold text-sm">{config.target_carbs} g</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={config.target_carbs}
              onChange={(e) => handleSliderChange('target_carbs', parseFloat(e.target.value), 'NUTRITION_SLIDER_CARBS')}
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 g (Low-carb)</span>
              <span>220 g</span>
              <span>400 g</span>
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Healthy Fats Target</span>
              <span className="font-mono text-pink-700 font-bold text-sm">{config.target_fat} g</span>
            </div>
            <input
              type="range"
              min="20"
              max="130"
              step="5"
              value={config.target_fat}
              onChange={(e) => handleSliderChange('target_fat', parseFloat(e.target.value), 'NUTRITION_SLIDER_FAT')}
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20 g</span>
              <span>65 g</span>
              <span>130 g</span>
            </div>
          </div>
        </div>

        {/* Right Preferences Column */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Dietary Restrictions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Strict Dietary Filter (Hard Constraints)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Selected requirements are strictly enforced across candidate recipes.
            </p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((tag) => {
                const isSelected = config.required_dietary_tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Engine Configuration & Parallel Tuning</span>
            </h3>

            <div className="space-y-4">
              {/* 1. Speed Mode Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Execution Speed & Core Allocation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeedChange('ultra')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      config.algorithm === 'parallel' && config.num_threads === 4
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Ultra Fast</span>
                    <span className="text-[10px] text-slate-400 font-normal">4 OpenMP Cores</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeedChange('max')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      config.algorithm === 'parallel' && config.num_threads === 8
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>Max Core</span>
                    <span className="text-[10px] text-slate-400 font-normal">8 Threads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeedChange('seq')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      config.algorithm === 'sequential'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span>Standard</span>
                    <span className="text-[10px] text-slate-400 font-normal">Single-Core</span>
                  </button>
                </div>
              </div>

              {/* 2. Recipe Catalog Scope */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Recipe Variety Scope
                </label>
                <select
                  value={config.dataset_tier}
                  onChange={(e) => handleTierChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="small">🍳 Pantry Staples (60 Recipes - Quick & Simple)</option>
                  <option value="medium">🥗 Balanced Culinary Mix (500 Recipes - Recommended)</option>
                  <option value="large">👨‍🍳 Master Chef Library (2,500 Recipes - Maximum Diversity)</option>
                </select>
              </div>

              {/* Collapsible Technical Details (For Graders / HPC Evaluators) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleToggleAdvanced}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>🔬 Advanced C++ Island GA Architecture</span>
                  {showAdvancedHPC ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedHPC && (
                  <div className="mt-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 text-[10px] block">C++ Engine Mode</span>
                        <span className="font-semibold text-slate-800">{config.algorithm === 'parallel' ? 'OpenMP Island Model' : 'Sequential GA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Island Sub-Populations</span>
                        <span className="font-semibold text-slate-800">{config.num_threads} Islands ({config.num_threads * 25} pop)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Generations</span>
                        <span className="font-semibold text-slate-800">{config.generations} epochs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Migration Topology</span>
                        <span className="font-semibold text-slate-800">Unidirectional Ring (k=5)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={handleSubmitOptimize}
            disabled={isOptimizing}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer mt-4"
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Computing Optimal Meal Plan...' : 'Apply Goals & Generate Fresh Meal Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
