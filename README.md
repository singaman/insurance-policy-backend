A robust Node.js backend service for insurance policy management with file processing, search capabilities, data aggregation, and system monitoring.

## 🏗️ Architecturee

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Processing**: Worker threads for non-blocking operations
- **Monitoring**: Real-time CPU utilization tracking
- **API Design**: RESTful endpoints with proper error handling

## 📊 Database Collections

| Collection | Description | Key Fields |
|------------|-------------|------------|
| **Agent** | Insurance agents | Agent Name |
| **User** | Policy holders | firstName, DOB, address, phone, email, userType |
| **User''s Account** | User accounts | Account Name |
| **Policy Category** | Line of Business | category_name |
| **Policy Carrier** | Insurance companies | company_name |
| **Policy Info** | Policy details | policyNumber, startDate, endDate, categoryId, companyId, userId |

## 🚀 Features

### ✅ Task 1: File Upload & Data Processing
- **File Upload API** - Process Excel/CSV files with worker threads
- **Policy Search** - Case-insensitive user name search
- **Data Aggregation** - Group policies by user with analytics

### ✅ Task 2: System Monitoring & Message Service
- **CPU Monitoring** - Real-time server health monitoring
- **Message Storage** - Store messages with date/time for future reference

## 📡 API Endpoints

### File Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload policy file (multipart/form-data) |
| `POST` | `/api/upload/local` | Upload from local file path |

### Policy Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/policies/search?username=...` | Search policies by user name |
| `GET` | `/api/policies/aggregated` | Get aggregated policy data |

### Message Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/Message/messages` | Store message with date/time |
| `GET` | `/api/Message/messages` | Retrieve stored messages |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd insurance-app

# Install dependencies
npm install

# Start development server
npm run start