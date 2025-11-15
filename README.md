# Insurance Policy Backend API

A Node.js backend service for insurance policy management with file upload, search, aggregation, and CPU monitoring features.

## Database Collections

1. **Agent** - Agent Name
2. **User** - first name, DOB, address, phone number, state, zip code, email, gender, userType
3. **User's Account** - Account Name
4. **Policy Category (LOB)** - category_name
5. **Policy Carrier** - company_name
6. **Policy Info** - policy number, policy start date, policy end date, policy category ID, company ID, user ID

## Task 1: File Upload & Search/Aggregation ✅ COMPLETED

### 📤 Upload APIs
- **Endpoint**: `POST /api/upload`
- **Features**: 
  - Upload `.xlsx`, `.xls`, `.csv` files via worker threads (non-blocking)
  - Multipart form-data support
- **Alternative**: `POST /api/upload/local` - Upload from local file path
- **Status**: ✅ Implemented

### 🔍 Search API
- **Endpoint**: `GET /api/policies/search?username=<name>`
- **Features**: 
  - Case-insensitive search on user's first name
  - Returns matching user's policies with populated references
- **Status**: ✅ Implemented

### 📊 Aggregation API
- **Endpoint**: `GET /api/policies/aggregated`
- **Features**: 
  - Groups policies by user
  - Returns total policies, categories, and carriers per user
- **Status**: ✅ Implemented

## Task 2: CPU Monitoring ✅ COMPLETED

### 1:⚡ CPU Monitoring Service
- **File**: `services/cpuMonitor.js`
- **Features**:
  - Real-time CPU utilization tracking
  - Configurable threshold (default: 70%)
  - Automatic logging and alerts
- **Environment Variables**:
  - `CPU_THRESHOLD=70` - CPU usage threshold percentage
  - `CPU_CHECK_INTERVAL=5000` - Check interval in milliseconds
  - `DISABLE_CPU_MONITOR=1` - Disable monitoring for development
- **Status**: ✅ Implemented

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload policy file (multipart/form-data) |
| `POST` | `/api/upload/local` | Upload from local file path |
| `GET` | `/api/policies/search?username=...` | Search policies by user name |
| `GET` | `/api/policies/aggregated` | Get aggregated policy data |


## Task 2: Message Service ✅ COMPLETED

### 💬 Message Service
- **Endpoint**: `POST /api/messages`
- **Request Body**:
  ```json
  {
    "message": "Your message content",
    "day": "2024-01-15",
    "time": "14:30"
  }


## 🛠️ Development

### Prerequisites
- Node.js
- MongoDB
- npm

### Installation & Running
```bash
# Clone and setup
cd insurance-app
npm install

# Set environment variables
$env:MONGODB_URI = 'mongodb://localhost:27017/insurance-db'

# Start server
node server.js