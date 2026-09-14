# PRAVAH-AI — Predictive Resolution & Anomaly Vector Analysis for Grievances
> **Enterprise Public Grievance Intelligence & Administrative Decision Support Platform**

PRAVAH-AI answers **why** public grievances become stalled in bureaucratic bottlenecks, predicts **which** complaints are likely to breach statutory SLAs next, uncovers **procedural ping-pong / circular routing cycles** using graph algorithms, and identifies **systemic root causes** across municipal jurisdictions.

Designed with a **dark obsidian & vibrant electric gold editorial aesthetic** inspired by high-impact executive command centers.

---

## 🏛️ System Highlights & Core Capabilities

1. **Executive Command Center & Intelligence Spotlight**
   - High-impact editorial hero banner showcasing critical vector escalations.
   - Live KPI cards: **1,284 Total Grievances**, **347 Active Backlog**, **86 High Risk**, **42 SLA Breaches**, **17 Deadlocks**, **31 Recurring Clusters**.
   - Interactive Recharts suite tracking 30-day backlog trends, LightGBM risk distributions, and department caseloads.

2. **Geospatial GIS Intelligence & DBSCAN Hotspots**
   - Interactive **Leaflet + OpenStreetMap** cartography rendered with dark **CartoDB Dark Matter** tiles.
   - Color-coded pulsing pins: Critical SLA Risk (Red), Tarjan Deadlocks (Purple), Recurring Clusters (Amber), Normal (Emerald).
   - Sliding inspection drawer with one-click direct access to 360° grievance intelligence.
   - **Geographic Hotspots (`/dashboard/map/hotspots`)**: Spatial density clustering isolating localized infrastructure breakdowns (e.g., Ward 112 Central Bus Terminal culvert subsidence).

3. **Explainable AI (XAI / TreeSHAP) & Predictive Risk Engine**
   - 0–100 SLA breach probability calculated from 10 operational vectors (inactivity days, transfer count, officer workload %, department backlog saturation, severity weight).
   - **SHAP Waterfall Visualizer**: Additive feature attribution charts explaining the exact mathematical factors driving high breach risk.

4. **Procedural Ping-Pong & Tarjan SCC Deadlock Graph**
   - Directed acyclic and cyclic graph visualizer utilizing **NetworkX** and **Tarjan's Strongly Connected Components (SCC)** algorithm.
   - Unmasks circular transfer loops (e.g., *Roads & Highways → Municipal Administration → Revenue & Land → Roads & Highways*).

5. **Semantic Loopbacks (all-MiniLM-L6-v2 384-dim Embeddings)**
   - Clusters disparate complaints reporting the same underlying breakdown despite completely different vocabulary or phrasing.

6. **Mobile-First Citizen Portal & Live Camera Capture**
   - 7-Step Complaint Wizard (`/citizen/grievances/new`) with real-time NLP department auto-suggestion.
   - WebRTC live camera capture (`navigator.mediaDevices.getUserMedia`) with mirror view and local file fallback.
   - GPS coordinate geo-tagging with PII minimization assurances.

7. **Forensic Computer Vision & Evidence Chronicity Timeline**
   - Automated visual analysis detecting surface craters, ponding water, and hazardous cables.
   - **Chronicity Timeline**: Displays multi-photo progression across Day 1 → Day 10 → Day 20 to demonstrate persistent non-resolution.

8. **Officer Workload Rebalancing Engine**
   - Real-time caseload ratios highlighting overloaded personnel (e.g., Vikram Malhotra operating at 126% capacity) vs underutilized staff (Aditya Sen at 58%).

9. **Administrative Decision & Recommendation Engine**
   - Surfaces prioritized actions: `PRIORITIZE`, `REASSIGN`, `REROUTE`, `ESCALATE`, `MONITOR`.
   - Nodal Officer one-click **Approve**, **Reject**, and **Review** workflows.

10. **Statutory Intelligence Reports & Printable Dossier**
    - Executive dossier print layouts with one-click export (`/reports/visual-evidence/[id]`).
    - Immutable audit logs capturing logins, status changes, transfers, and approvals.

---

## 🚀 Quick Start (Local Windows PowerShell)

### 1-Click Launch (All Services)
Double-click or run from PowerShell:
```powershell
.\run-all.ps1
```
This automatically launches both the **FastAPI AI microservice** (`http://127.0.0.1:8000`) and the **Next.js frontend** (`http://localhost:3000`).

---

### Manual Step-by-Step Launch

#### Terminal 1: Python AI Microservice
```powershell
cd ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

#### Terminal 2: Next.js Web Application
```powershell
cd web
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 🔑 Dual-Portal Authentication & Access Gateway (`/login`)

The login gateway features two dedicated, purpose-built access portals:
1. **Public / Citizen Portal (नागरिक सेवा केंद्र)**:
   - **Direct Complaint Tracking**: Instant public lookup by Reference ID (`GRV-2026-0001`).
   - **File New Grievance**: Fast-track launcher to the 7-step wizard with camera and GPS.
   - **1-Click Demo Citizen**: Instant login as Priya Sharma (`citizen@pravah.demo`).
   - **Citizen Mobile/Email Authentication**: Streamlined public access.
2. **Government Authorities Portal (प्रशासनिक अधिकारी केंद्र)**:
   - **Department Scope Selector**: Filter access to Roads & Highways, Drainage, Water Supply, Electricity, Revenue, or All Divisions.
   - **1-Click Official Personas**: Direct entry for Nodal Officer, Executive Engineer, Data Analyst, or Super Admin.
   - **Official Credentials Login**: Government email and security credential (`demoPassword123!`).

| Persona | Portal | Email | Demo Password | Primary Role & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Public | `citizen@pravah.demo` | `demoPassword123!` | Submits complaints, takes camera photos, tracks live status & timeline |
| **Nodal Officer** | Authority | `nodal@pravah.demo` | `demoPassword123!` | Senior decision maker; approves AI recommendations, resolves deadlocks |
| **Department Officer**| Authority | `officer@pravah.demo` | `demoPassword123!` | Senior Executive Engineer; manages assigned caseload, adds notes, transfers cases |
| **Data Analyst** | Authority | `analyst@pravah.demo` | `demoPassword123!` | Analyzes DBSCAN hotspots, MiniLM semantic clusters, department performance |
| **Super Admin** | Authority | `admin@pravah.demo` | `demoPassword123!` | Configures SLA charter thresholds, manages department master, inspects audit logs |

---

## 🎯 Complete End-to-End Demonstration Scenario (Key Demo Flow)

To verify the complete intelligence chain as outlined in Section 52 of the PRD:

1. **Examine Key Showcase Complaint**:
   - Open `http://localhost:3000/grievances/GRV-2026-0001`.
   - Observe the **84% SLA Risk Score** and **Deadlock Detected** banner.
   - Inspect the **Visual Evidence Chronicity Timeline** showing worsening conditions from Day 1 to Day 20.
   - Review the **Explainable AI (TreeSHAP)** waterfall chart ranking Reassignment Count (+21%) and Inactivity (+19%).
   - Inspect the **Tarjan SCC Routing Graph** showing circular transfers (*Roads → Municipal → Revenue → Roads*).
   - Review the **AI Recommendation** ("Escalate complaint to Nodal Officer").
   - Click **Approve Action** and verify the status updates to Critical Escalation with an audit log created.

2. **Citizen Workflow**:
   - Navigate to `/citizen/grievances/new`.
   - Enter: *"Large potholes and collapsed drainage outside Central Bus Terminal"*.
   - Notice real-time NLP classification suggests **Roads & Highways** (94% confidence).
   - Click **Use Device GPS** to geotag coordinates.
   - Open **Camera / Upload Evidence** to capture photographic proof.
   - Review and submit to receive sequential tracking ID (e.g. `GRV-2026-0106`).

3. **Geospatial & Hotspot Intelligence**:
   - Navigate to `/dashboard/map` to view dark CartoDB tile rendering with live pins and marker clustering.
   - Click on any pin to inspect the sliding drawer and jump directly into the complaint 360° view.
   - Navigate to `/dashboard/map/hotspots` to review density-based spatial clusters with clear distinction between **Detected Pattern** and **Potential Root Cause**.

4. **Executive Reports**:
   - Open `/reports/visual-evidence/GRV-2026-0001` and click **Print / Export PDF Dossier**.
   - Navigate to `/dashboard/admin` to inspect the immutable audit trail of all previous actions.

---

## 📂 Project Architecture

```
pravah-ai/
├── web/                               # Next.js 14/15 App Router Frontend & REST API
│   ├── app/
│   │   ├── (auth)/login/page.tsx      # Multi-role authentication & 1-click login
│   │   ├── (dashboard)/               # Executive command center & dashboard routes
│   │   │   ├── dashboard/page.tsx     # Executive Dashboard & Spotlight Hero
│   │   │   ├── dashboard/map/page.tsx # Leaflet GIS Map with dark tiles
│   │   │   ├── dashboard/map/hotspots/page.tsx # DBSCAN Geographic Hotspots
│   │   │   ├── dashboard/grievances/page.tsx   # All grievances intake queue
│   │   │   ├── dashboard/intelligence/risk/page.tsx # TreeSHAP explainability
│   │   │   ├── dashboard/intelligence/deadlocks/page.tsx # Tarjan SCC graph
│   │   │   ├── dashboard/intelligence/clusters/page.tsx # MiniLM semantic clusters
│   │   │   ├── dashboard/intelligence/root-causes/page.tsx # Root causes engine
│   │   │   ├── dashboard/intelligence/recommendations/page.tsx # Nodal decisions
│   │   │   ├── dashboard/departments/page.tsx  # Department Master & Hierarchy
│   │   │   ├── dashboard/officers/page.tsx     # Officer workload rebalancing
│   │   │   ├── dashboard/analytics/page.tsx    # Recharts analytics
│   │   │   ├── dashboard/reports/page.tsx      # Statutory intelligence reports
│   │   │   ├── dashboard/notifications/page.tsx # Live alert center
│   │   │   └── dashboard/admin/page.tsx        # Audit logs & SLA rules
│   │   ├── citizen/                   # Citizen mobile-first filing wizard
│   │   ├── grievances/[id]/page.tsx   # Grievance 360° Intelligence Dossier
│   │   ├── reports/visual-evidence/[id]/page.tsx # Printable Visual Evidence Report
│   │   └── api/                       # Next.js server actions & AI proxy routes
│   ├── components/                    # Reusable React & Leaflet UI components
│   ├── lib/                           # Prisma singleton, auth, and AI client bridge
│   └── prisma/
│       ├── schema.prisma              # Database schema (SQLite / PostgreSQL ready)
│       └── seed.ts                    # Realistic demo seed data (100+ cases, 25 depts)
│
├── ai-service/                        # Python FastAPI Machine Learning Microservice
│   ├── main.py                        # FastAPI application & endpoints
│   ├── requirements.txt               # Dependencies (FastAPI, NetworkX, Scikit-learn)
│   ├── models/providers.py            # Real & Demo Model Provider adapters
│   └── services/                      # Classification, Risk, Tarjan SCC, Vision, Embeddings
│
---

## 🗄️ Database Architecture & Live Connections

PRAVAH-AI utilizes a multi-model data tier:
1. **Primary Relational Store (Prisma ORM)**:
   - Manages relational structures, departments, officers, locations, and audit logs.
   - Initialized locally with `dev.db` (105 grievances, 25 departments, 20 officers).
2. **🍃 MongoDB Atlas Cluster (`cluster0.bncya5w.mongodb.net`)**:
   - High-throughput document store for grievances, users, and unstructured metadata.
   - Collections: `grievances`, `users`, `departments`.
   - Seeded via: `npm run mongo:seed`.
3. **⚡ Supabase Storage (`qlljjbmrdotmlbrpezdm.supabase.co`)**:
   - Cloud photographic evidence storage bucket: `grievance-evidence` (Public).
   - High-res citizen camera uploads & computer vision inspection overlays delivered via Supabase CDN.

### Database Diagnostic & Management Commands
```bash
# Test all database connections & latencies (Prisma, MongoDB, Supabase)
npm run test:db

# Seed or re-seed MongoDB Atlas with complete government department & grievance records
npm run mongo:seed

# Query live database health status via REST endpoint
curl http://localhost:3000/api/database/status
```

---

## 🛡️ Data Protection & Privacy Notice
PRAVAH-AI is designed to minimize unnecessary PII exposure and support alignment with government data-protection requirements. Citizen contact details are masked from unauthorized tiers and restricted to designated inquiry officers.
