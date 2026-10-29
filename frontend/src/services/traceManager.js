/**
 * Global Real-Time Action & Telemetry Trace Manager
 * Stores structured trace events, connects frontend user interactions
 * to backend execution stages and correlation IDs, and notifies subscribers.
 */

import { ACTION_REGISTRY } from './actionRegistry';

class TraceManager {
  constructor(maxTraces = 60) {
    this.maxTraces = maxTraces;
    this.traces = [];
    this.listeners = new Set();
    this.explainModeEnabled = true; // default enabled for explorer accessibility
  }

  setExplainMode(enabled) {
    this.explainModeEnabled = Boolean(enabled);
    this.notify();
  }

  isExplainMode() {
    return this.explainModeEnabled;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.traces, this.getLatestTrace(), this.explainModeEnabled);
      } catch (err) {
        console.error('TraceManager subscriber error:', err);
      }
    });
  }

  sanitize(data, maxDepth = 3) {
    if (data === null || data === undefined) return data;
    if (typeof data !== 'object') return data;
    if (maxDepth <= 0) return '[Object / Array]';

    if (Array.isArray(data)) {
      if (data.length > 8) {
        return [
          ...data.slice(0, 5).map((item) => this.sanitize(item, maxDepth - 1)),
          `... (${data.length - 5} more items truncated)`
        ];
      }
      return data.map((item) => this.sanitize(item, maxDepth - 1));
    }

    const clean = {};
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'function') continue;
      if (typeof val === 'string' && val.length > 300) {
        clean[key] = val.slice(0, 300) + '... [truncated]';
      } else {
        clean[key] = this.sanitize(val, maxDepth - 1);
      }
    }
    return clean;
  }

  recordTrace(event) {
    // Prevent recursive logging: ignore internal explain mode viewer actions
    if (!event || event.actionId?.startsWith('EXPLAIN_') || event.isInternal) {
      return null;
    }

    const regEntry = ACTION_REGISTRY[event.actionId] || {
      id: event.actionId,
      name: event.actionName || event.actionId,
      category: 'Custom',
      component: event.component || 'Unknown',
      handler: event.handler || 'unknown'
    };

    const traceId = event.traceId || `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = event.timestamp || new Date().toISOString();

    const traceEvent = {
      traceId,
      actionId: regEntry.id,
      actionName: regEntry.name,
      category: regEntry.category,
      parentActionId: event.parentActionId || null,
      correlationId: event.correlationId || null,
      timestamp,
      executionMode: event.executionMode || (regEntry.hasBackendCall ? 'backend_native' : 'frontend_only'),
      status: event.status || 'success', // 'success', 'error', 'fallback', 'in_flight'
      durationMs: typeof event.durationMs === 'number' ? Math.round(event.durationMs * 10) / 10 : 0,
      measurementScope: event.measurementScope || (regEntry.hasBackendCall ? 'Browser fetch() + Backend Latency' : 'Client synchronous handler'),
      component: event.component || regEntry.component,
      handler: event.handler || regEntry.handler,
      sourceReference: regEntry.sourceReference || 'frontend/src/App.jsx',
      requestSummary: event.requestSummary ? this.sanitize(event.requestSummary) : null,
      responseSummary: event.responseSummary ? this.sanitize(event.responseSummary) : null,
      stateChanges: event.stateChanges ? this.sanitize(event.stateChanges) : regEntry.localStateChanges,
      dbOperations: event.dbOperations || regEntry.dbOperations || [],
      fileOperations: event.fileOperations || regEntry.fileOperations || [],
      optimizerStages: event.optimizerStages || null,
      explanation: event.explanation || regEntry.description,
      error: event.error ? String(event.error) : null
    };

    this.traces.unshift(traceEvent);
    if (this.traces.length > this.maxTraces) {
      this.traces.pop();
    }

    this.notify();
    return traceEvent;
  }

  getTraces() {
    return [...this.traces];
  }

  getLatestTrace() {
    return this.traces[0] || null;
  }

  clearTraces() {
    this.traces = [];
    this.notify();
  }
}

export const traceManager = new TraceManager();

