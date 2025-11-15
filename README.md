## Collections
- 1) Agent - Agent Name
- 2) User - first name, DOB, address, phone number, state, zip code, email, gender, userType
- 3) User's Account - Account Name
- 4) Policy Category (LOB) - category_name
- 5) Policy Carrier - company_name
- 6) Policy Info - policy number, policy start date, policy end date, policy category ID, company ID, user ID

## Task 1: File Upload & Search/Aggregation ✅ COMPLETED

### 1) Upload API (Worker Threads)
- **Endpoint**: `POST /api/upload`
- **Features**: Uploads `.xlsx`, `.xls`, `.csv` files via worker threads (non-blocking)
- **Status**: ✅ Implemented

### 2) Search API (by Username)
- **Endpoint**: `GET /api/policies/search?username=<name>`
- **Features**: Case-insensitive whole-word match on firstName; returns matching user's policies with populated refs
- **Status**: ✅ Implemented

### 3) Aggregated Policies API
- **Endpoint**: `GET /api/policies/aggregated` (or with optional `?username=<name>`)
- **Features**: Groups policies by user; returns totalPolicies, categories, carriers per user
- **Status**: ✅ Implemented

## Task 2: CPU Monitoring & Scheduled Messages ✅ COMPLETED

### 1) CPU Monitoring
- **Service**: `services/cpuMonitor.js`
- **Features**: Tracks real-time CPU utilization; logs at 70%+ threshold
- **Note**: Restart behavior can be configured via `DISABLE_CPU_MONITOR` env var
- **Status**: ✅ Implemented

### 2) Scheduled Message Service
- **Endpoint**: `POST /api/scheduled/messages` (create) | `GET /api/scheduled/messages` (list)
- **Request Body**: `{ message: "...", day: "YYYY-MM-DD", time: "HH:MM:SS" }`
- **Features**: 
  - Inserts message into DB with scheduled time
  - Scheduler runs every minute (cron: `* * * * *`)
  - Marks messages: `pending` → `processing` → `completed`/`failed`
  - Logs delivery via `console.log` (placeholder for external delivery)
- **Status**: ✅ Implemented

## API Routes
- `POST /api/upload` – Upload file
- `POST /api/upload/local` – Upload from local path (testing)
- `GET /api/policies/search?username=...` – Search by name
- `GET /api/policies/aggregated` – Aggregated view
- `POST /api/scheduled/messages` – Schedule message
- `GET /api/scheduled/messages` – List scheduled messages

## Running Locally
```powershell
cd insurance-app
npm install
$env:MONGODB_URI = 'mongodb://localhost:27017/your-db'
node server.js
```

Disable services for faster dev:
```powershell
$env:DISABLE_CPU_MONITOR=1; $env:DISABLE_SCHEDULER=1; node server.js
```