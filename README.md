# High-Performance Parallel Multi-Objective Optimization for Real-Time Pantry-Aware Meal Planning

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![C++](https://img.shields.io/badge/C++-17%20%2F%2020-blue.svg)](https://isocpp.org/)
[![OpenMP](https://img.shields.io/badge/Parallel-OpenMP%205.0-red.svg)](https://www.openmp.org/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)

A High Performance Computing (HPC) research-oriented project developing a **Zero-Waste AI Meal Planner** that simultaneously minimizes household food waste, out-of-pocket grocery purchases, and nutritional deviations using parallel multi-objective genetic algorithms.

Includes a comprehensive, interactive **"How It Works / Backend Explorer"** suite and a live **"Explain Mode"** side panel that instruments and visualizes every single user interaction across the frontend, REST APIs, SQLite database, C++ OpenMP engine, and fallback layers.

---

## 📌 Project Overview & Objectives

Modern household meal management incurs substantial economic and environmental costs due to premature food spoilage and uncoordinated grocery purchasing. This project formulates daily meal generation as a constrained **Multi-Objective Optimization Problem (MOOP)** and implements high-throughput parallel evolutionary solvers:

- **Sequential Genetic Algorithm (GA)**: Baseline single-threaded evolutionary search.
- **OpenMP Parallel Island Model GA**: Shared-memory coarse-grained island architecture with periodic ring-topology elite migration.
- **Distributed MPI Island Model GA**: Distributed-memory multi-node island parallelization (standalone research prototype).
- **HPC Empirical Benchmarking Framework**: Strong and weak scaling evaluation across thread counts (1, 2, 4, 8, 16), measuring speedup, parallel efficiency, Amdahl fraction, and Karp-Flatt metric.
- **Real-Time Dynamic Pantry Engine**: Instant sub-second re-optimization triggered by pantry state alterations (consumption, expiry changes, new additions).
- **Interactive Backend Explorer & Explain Mode**: Transparent full-stack observability explaining every button click, state mutation, network payload, SQL query, C++ stage timing, and UI update in real time.

---

## 🔍 How It Works & Live Explain Mode

The application includes two deep educational observability tools:

### 1. "How It Works" Tab (`HowItWorksTab.jsx`)
An 8-section interactive handbook built directly into the UI:
1. **System Architecture**: High-level topology diagram, interactive 7-step sequence walkthrough (Button Click → FastAPI → DataLoader → OpenMP Island GA → JSON Serialization → React UI), and component boundary matrix.
2. **Action-by-Action Explorer**: Live inventory of 20+ user interactions with search, category filtering, handler signatures, state mutations, and backend routes.
3. **API Explorer**: Interactive REST directory detailing endpoints, methods, request/response schemas, validation rules, and error handling.
4. **Database & Persistence**: SQLite schema (`pantry_items`, `optimization_history`), disk files, temporary IPC bridge buffers, and localStorage client cache.
5. **Genetic Algorithm Engine**: Complete composite fitness formula derivations, worked numerical examples, genome chromosome layout, and coarse-grained OpenMP island migration mechanics.
6. **Execution Modes & Honesty**: Clear operational truth matrix comparing Backend Native mode (C++ OpenMP) vs Browser Fallback mode (single-threaded heuristic JS) without synthetic or fabricated timings.
7. **HPC Metrics & Provenance**: Mathematical definitions for Speedup $S_p$, Parallel Efficiency $E_p$, and Karp-Flatt Metric $e$, distinguishing prerecorded benchmark sweeps from dynamic runtime traces.
8. **Limitations & Implementation Gaps**: Honest engineering disclosure of known constraints, unwired endpoints (`PUT /pantry/{id}`), and standalone prototype boundaries (MPI).

### 2. Global "Explain Mode" Toggle (`ExplainModePanel.jsx`)
A collapsible live side panel accessible via the **"Explain Mode: ON/OFF"** toggle in the Navbar:
- **Real-Time Action Tracing**: Automatically captures every button click, form input, navigation switch, and background startup fetch.
- **Simple & Technical Views**: One-click toggle between beginner-friendly summaries and low-level technical telemetry (correlation IDs, millisecond timings, SQL queries, file operations, optimizer stage breakdowns).
- **Correlation ID Tracking**: Automatically binds frontend requests to backend execution traces via the `X-Correlation-Id` header.
- **Recursion-Safe**: Panel interactions (copying JSON, switching tabs) never pollute the execution trace log.

---

## 🏛️ System Architecture

```
                                +---------------------------------------------+
                                |          React + Tailwind Frontend          |
                                |     (Pantry Manager, HPC Dash, Explorer)    |
                                +----------------------+----------------------+
                                                       | REST / JSON + Correlation-ID
                                        +--------------v--------------+
                                        |       FastAPI Backend       |
                                        | (SQLite DB & Re-optimizer)  |
                                        +--------------+--------------+
                                                       | Subprocess / Temporary IPC Buffer
                                        +--------------v--------------+
                                        |   C++ HPC Engine (OpenMP)   |
                                        +--------------+--------------+
                                                       |
                        +-------------------------------+-------------------------------+
                        |                               |                               |
           +------------v------------+     +------------v------------+     +------------v------------+
           |    Island 0 (Thread 0)  |     |    Island 1 (Thread 1)  |     |    Island K (Thread K)  |
           |  Pop: N/K Individuals   |     |  Pop: N/K Individuals   |     |  Pop: N/K Individuals   |
           |  - Tournament Selection |     |  - Tournament Selection |     |  - Tournament Selection |
           |  - Uniform Crossover    |     |  - Uniform Crossover    |     |  - Uniform Crossover    |
           |  - Mutation & Elitism   |     |  - Mutation & Elitism   |     |  - Mutation & Elitism   |
           +------------+------------+     +------------+------------+     +------------+------------+
                        |                               |                               |
                        +<====== Ring Migration =======>+<====== Ring Migration =======>+
                                      (Every M Generations: Top-E Elites)
```

---

## 🔬 Multi-Objective Formulation

A candidate solution chromosome is $\mathbf{x} = \langle r_1, r_2, \dots, r_k \rangle$ representing chosen recipe indices across meal slots.

$$\Phi(\mathbf{x}) = w_1 \cdot f_{\text{nutr}}(\mathbf{x}) + w_2 \cdot f_{\text{expiry}}(\mathbf{x}) - w_3 \cdot f_{\text{cost}}(\mathbf{x}) - w_4 \cdot f_{\text{waste}}(\mathbf{x}) - P_{\text{diet}}(\mathbf{x})$$

1. **Nutritional Satisfaction ($f_{\text{nutr}}$)**: Normalized inverse Manhattan distance against target daily Calories, Protein, Carbohydrates, and Fats:
   $$f_{\text{nutr}} = \max\left(0, 1 - \frac{1}{4}\sum_{m \in \{\text{cal, prot, carb, fat}\}} \frac{|A_m - T_m|}{T_m}\right)$$
2. **Perishable Expiry Utilization ($f_{\text{expiry}}$)**: Prioritizes ingredients nearing expiration ($0 \le \text{days} \le 3$) using an exponential decay weight:
   $$w_{\text{urgency}}(i) = e^{-0.5 \cdot \text{days}_i}$$
3. **Out-of-Pocket Procurement Cost ($f_{\text{cost}}$)**: Normalized monetary penalty for ingredients missing from the pantry that require grocery purchase.
4. **Food Waste Spoilage Penalty ($f_{\text{waste}}$)**: Penalty assessed for critical perishables ($\le 2$ days left) that remain unutilized in the proposed plan.

Detailed mathematical derivations and objective proofs are provided in [`docs/problem_formulation.md`](docs/problem_formulation.md).

---

## 📡 REST API Reference

The FastAPI backend dual-mounts all endpoints with and without the `/api` prefix for seamless local and reverse-proxy deployment:

| Method | Endpoint | Description | Calling UI Action | DB / File Ops |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` or `/api/` | Service health & metadata check | System Status tab | None |
| `GET` | `/pantry` | Fetch full pantry inventory | Startup / Pantry Manager | `SELECT * FROM pantry_items` |
| `POST` | `/pantry` | Insert new pantry ingredient | Add Item Form Submit | `INSERT INTO pantry_items` |
| `PUT` | `/pantry/{id}` | Update ingredient properties | *Not currently called by UI* | `UPDATE pantry_items` |
| `DELETE` | `/pantry/{id}` | Remove ingredient from inventory | Delete Button (Grid/Table) | `DELETE FROM pantry_items` |
| `POST` | `/optimize` | Run multi-objective optimization | Meal Plan / Nutrition / Navbar | OpenMP C++ GA + history log |
| `GET` | `/recommendations` | Generate quick recommended plan | *Not currently called by UI* | Triggers live 4-thread GA |
| `GET` | `/performance` | Fetch benchmark scaling sweeps | HPC Dashboard / Startup | Reads `benchmark_results_summary.json` |
| `GET` | `/experiments` | Fetch benchmark matrix | HPC Dashboard | Reads `benchmark_results_summary.json` |
| `POST` | `/simulate-pantry-change` | Simulate spoil / consume / reset | Pantry Simulation Bar | SQLite update + auto-reoptimize |

---

## 📂 Repository Structure

```
parallel-pantry-meal-optimizer/
├── backend/                  # FastAPI REST server, SQLite DB & optimizer bridge
│   ├── main.py               # API routes, CORS, correlation-ID middleware
│   ├── models.py             # Pydantic schemas (Request, Response, TraceMeta)
│   ├── database.py           # SQLite connection & default pantry seeder
│   └── optimizer_bridge.py   # Subprocess invocation & stage timing instrumentation
├── frontend/                 # React + Vite + Tailwind CSS dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── HowItWorksTab.jsx        # 8-section interactive backend explorer
│   │   │   ├── ExplainModePanel.jsx     # Collapsible live action inspection drawer
│   │   │   ├── Navbar.jsx               # Navigation, seed reshuffle, explain toggle
│   │   │   ├── MealPlanView.jsx         # Meal cards, recipe drawer, step checkoffs
│   │   │   ├── PantryManager.jsx        # Pantry inventory grid/table & simulations
│   │   │   ├── NutritionalTargets.jsx   # Macro targets, diet tags, speed presets
│   │   │   ├── HPCMetricsDashboard.jsx  # Scaling charts & island visualization
│   │   │   └── ImplementationStatus.jsx # Real-time system health audit
│   │   └── services/
│   │       ├── actionRegistry.js        # Comprehensive registry of all user actions
│   │       ├── traceManager.js          # Circular trace buffer & subscriber bus
│   │       └── clientOptimizer.js       # Honest browser-side heuristic fallback GA
├── src/
│   ├── sequential_ga/        # C++ single-threaded Genetic Algorithm
│   ├── parallel_ga/          # C++ OpenMP Island Model GA
│   ├── island_model/         # Migration topologies & ring buffer exchange
│   ├── mpi_ga/               # MPI multi-node distributed prototype
│   ├── fitness/              # Multi-objective fitness evaluator
│   └── models/               # Domain data structures (Recipe, Chromosome, Pantry)
├── tests/                    # Backend API, C++ GA, and instrumentation pytest suites
├── data/                     # Recipe tiers (Small, Medium, Large) & benchmark data
├── requirements.txt          # Python dependencies
└── README.md
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **C++ Compiler**: GCC (`g++` 11+) or Clang with OpenMP support (`-fopenmp`)
- **Python**: 3.10+
- **Node.js**: v18+ (for frontend dashboard)

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/KashishUpadhyay30/Parallel-pantry-meal-optimizer.git
cd Parallel-pantry-meal-optimizer

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Compile C++ Executables & Run Tests
```powershell
# Build C++ Executables (Windows PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/build_cpp.ps1

# Run full pytest suite (24 tests including trace instrumentation)
python -m pytest tests/ -v
```

### 3. Launch Backend & Frontend
In Terminal 1 (FastAPI Backend):
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

In Terminal 2 (React Frontend):
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser. Toggle **Explain Mode** in the navigation bar to observe real-time telemetry as you interact with the application.

---

## ⚠️ Known Architecture Limitations & Truthful Disclosures

To preserve academic and engineering rigor, the following design boundaries are explicitly disclosed:

1. **`PUT /pantry/{id}` Route**: The backend implements and tests a full HTTP PUT endpoint for updating pantry items. However, the current UI only exposes Create (Add Item) and Delete actions; no inline edit modal is currently rendered.
2. **Recipe Step Completion vs. Inventory**: Marking a recipe step complete in the recipe drawer tracks local cooking progress; it does not automatically decrement ingredient weights in SQLite. Inventory is decremented exclusively via explicit delete actions or the "Consume 100g" simulation button.
3. **`GET /performance` Provenance**: Benchmark scaling metrics displayed on the HPC Dashboard are loaded from a validated empirical benchmark dataset (`benchmark_results_summary.json`). The dashboard does not execute a live C++ thread sweep upon opening to prevent blocking the web server.
4. **Browser Fallback Fidelity**: When the FastAPI backend is offline, the frontend runs a JavaScript genetic algorithm in the browser. It honestly reports single-threaded browser execution (`Browser JavaScript Heuristic GA`), measures real elapsed time via `performance.now()`, and does not fabricate OpenMP thread speedup.
5. **MPI Multi-Node GA**: The MPI implementation in `src/mpi_ga/mpi_island_ga.cpp` is a high-performance research prototype designed for cluster environments; it is not hooked into the web application's subprocess bridge.

---

## 👥 Authors & Contributors

Developed as an HPC academic research project investigating parallel evolutionary multi-objective heuristics:

| Contributor | GitHub Profile | Role |
| :--- | :--- | :--- |
| **Kashish Upadhyay** | [@KashishUpadhyay30](https://github.com/KashishUpadhyay30) | Lead Author & Project Architect |
| **Animesh Labh** | [@animeshlabh57-rgb](https://github.com/animeshlabh57-rgb) | Research & HPC Co-Author |
