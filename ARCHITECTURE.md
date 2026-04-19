# Budget Management System - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     React Application (Vite)                         │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ Pages:                                         │   │  │
│  │ │ • Dashboard (analytics & metrics)              │   │  │
│  │ │ • Budget Management (create & edit)            │   │  │
│  │ │ • Transaction Entry (record spending)          │   │  │
│  │ │ • Alerts & Forecasts (risk monitoring)        │   │  │
│  │ │ • Auth Pages (login/register)                  │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ Services:                                      │   │  │
│  │ │ • API Service (Axios interceptor)              │   │  │
│  │ │ • Auth Service                                 │   │  │
│  │ │ • Budget Service                               │   │  │
│  │ │ • Analytics Service                            │   │  │
│  │ │ • Forecast Service                             │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ Context: AuthContext (JWT token management)   │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/HTTPS
                               │ (Port 3000)
┌──────────────────────────────┴──────────────────────────────┐
│                     EXPRESS SERVER                         │
│                  (Node.js Backend)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       API Routes (8 Router Files)                    │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ /api/auth        - Authentication              │   │  │
│  │ │ /api/budget      - Budget management           │   │  │
│  │ │ /api/analytics   - Variance analysis           │   │  │
│  │ │ /api/forecast    - Forecasting engine          │   │  │
│  │ │ /api/supplemental- Supplemental budgets        │   │  │
│  │ │ /api/assets      - Asset tracking              │   │  │
│  │ │ /api/commitments - PO tracking                 │   │  │
│  │ │ /api/recommend   - Recommendations             │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Controllers (Business Logic)                       │  │
│  │ ├─ authController      (JWT token generation)      │  │
│  │ ├─ budgetController    (CRUD operations)           │  │
│  │ ├─ analyticsController (variance calculations)     │  │
│  │ ├─ forecastController  (predictions)               │  │
│  │ └─ ... more controllers                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Middleware                                         │  │
│  │ └─ authMiddleware      (JWT verification)          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Utils & Helpers                                   │  │
│  │ ├─ analysis.js   (burn rate, predictions)         │  │
│  │ └─ jwt.js        (token generation)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                    │
│                       │ Connection Pool                    │
│                       ▼                                    │
└──────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               │ (Port 5000)
┌──────────────────────────────┴──────────────────────────────┐
│                   MongoDB Atlas (Cloud)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Collections (MongoDB Documents)           │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ users                (User accounts)            │   │  │
│  │ │ budgets              (Fiscal year budgets)      │   │  │
│  │ │ lineitems            (Budget categories)        │   │  │
│  │ │ transactions         (Actual spending)          │   │  │
│  │ │ supplementalbudgets  (Budget reallocations)     │   │  │
│  │ │ forecasts            (Predictions)              │   │  │
│  │ │ assets               (IT equipment)             │   │  │
│  │ │ alerts               (System alerts)            │   │  │
│  │ │ commitments          (Purchase orders)          │   │  │
│  │ │ contracts            (Vendor contracts)         │   │  │
│  │ │ recommendations      (AI suggestions)           │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User Registration/Login
        ↓
Frontend: AuthPage
        ↓
Call: POST /api/auth/register or /api/auth/login
        ↓
Backend: authController.register/login
        ↓
Check User in MongoDB
        ↓
Generate JWT Token
        ↓
Return Token to Frontend
        ↓
Store in localStorage
        ↓
Include in all subsequent API calls via Axios interceptor
```

### 2. Budget Creation Flow
```
User Input: Budget Form
        ↓
Frontend: BudgetManagement Component
        ↓
Call: POST /api/budget/create
        ↓
Backend: budgetController.createBudget
        ↓
Validate Input
        ↓
Create Budget Document in MongoDB
        ↓
Return Budget Data
        ↓
Frontend: Update UI with new budget
```

### 3. Transaction Recording Flow
```
User Enters Transaction
        ↓
Frontend: TransactionEntry Component
        ↓
Call: POST /api/budget/transaction/record
        ↓
Backend: budgetController.recordTransaction
        ↓
Create Transaction Document
        ↓
Update LineItem.spentAmount
        ↓
Update Budget.totalSpent
        ↓
Calculate Quarter & Month
        ↓
Check Thresholds (>80%)
        ↓
If threshold exceeded: Create Alert
        ↓
Return Transaction Data
        ↓
Frontend: Show success & refresh
```

### 4. Analytics & Forecasting Flow
```
Dashboard Load
        ↓
Frontend: Dashboard Component
        ↓
Parallel Calls:
├─ GET /api/budget/:id/dashboard
├─ GET /api/analytics/:budgetId/variance
└─ GET /api/analytics/:budgetId/quarterly-comparison
        ↓
Backend: Multiple Controllers
├─ Calculate metrics
├─ Sum transactions
└─ Aggregate by quarter/month
        ↓
Return Data Objects
        ↓
Frontend: Recharts Visualization
        ↓
Display Dashboard
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
├── BrowserRouter
│   ├── Routes
│   │   ├── /login → LoginPage
│   │   ├── /register → RegisterPage
│   │   └── Protected Routes:
│   │       ├── / → Dashboard
│   │       ├── /budget → BudgetManagement
│   │       ├── /transactions → TransactionEntry
│   │       └── /alerts → AlertsAndForecasts
│   │
│   └── Layout
│       ├── Navbar (Navigation)
│       └── MainContent (Page Content)
│
└── Context
    └── AuthContext (user, token, login, logout)
```

## Database Schema Relationships

```
User
  ↓
  ├─ has many → Budgets (created by)
  │
Budget
  ├─ has many → LineItems
  ├─ has many → Transactions
  ├─ has many → SupplementalBudgets
  ├─ has many → Assets
  ├─ has many → Forecasts
  ├─ has many → Alerts
  ├─ has many → Recommendations
  └─ has many → Commitments

LineItem
  ├─ belongs to → Budget
  ├─ has many → Transactions
  ├─ has many → SupplementalBudgets
  ├─ has many → Forecasts
  └─ has many → Commitments

Transaction
  ├─ belongs to → Budget
  └─ belongs to → LineItem

SupplementalBudget
  ├─ belongs to → Budget
  └─ belongs to → LineItem

Forecast
  ├─ belongs to → Budget
  └─ belongs to → LineItem

Alert
  ├─ belongs to → Budget
  └─ belongs to (optional) → LineItem

Asset
  └─ belongs to → Budget

Commitment
  ├─ belongs to → Budget
  └─ belongs to → LineItem

Recommendation
  └─ belongs to → Budget
```

## API Request/Response Pattern

### Example: Record Transaction

**Request:**
```javascript
POST /api/budget/transaction/record
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "lineItemId": "507f1f77bcf86cd799439011",
  "budgetId": "507f191e810c19729de860ea",
  "transactionId": "TXN-20240401-001",
  "amount": 5000,
  "date": "2024-04-01",
  "vendorName": "Tech Supply Co.",
  "invoiceNumber": "INV-2024-001",
  "purchaseOrderId": "PO-2024-001"
}
```

**Response (Success):**
```json
{
  "_id": "507f191e810c19729de860eb",
  "lineItem": "507f1f77bcf86cd799439011",
  "budget": "507f191e810c19729de860ea",
  "transactionId": "TXN-20240401-001",
  "amount": 5000,
  "date": "2024-04-01T00:00:00.000Z",
  "quarter": "Q2",
  "month": "April",
  "vendorName": "Tech Supply Co.",
  "invoiceNumber": "INV-2024-001",
  "paymentStatus": "paid",
  "purchaseOrderId": "PO-2024-001",
  "createdAt": "2024-04-01T12:30:45.000Z",
  "updatedAt": "2024-04-01T12:30:45.000Z"
}
```

**Response (Error):**
```json
{
  "message": "Error recording transaction",
  "error": "Details of the error"
}
```

## Key Algorithms

### Burn Rate Calculation
```javascript
burnRate = totalSpent / daysElapsed
```

### Budget Variance
```javascript
variance = allocatedAmount - spentAmount
variancePercentage = (variance / allocatedAmount) * 100
```

### Cost Per Student
```javascript
costPerStudent = totalSpent / studentEnrollment
```

### Overrun Prediction
```javascript
dailyBurnRate = currentSpend / daysElapsed
remainingDays = totalDays - daysElapsed
projectedFinalSpend = currentSpend + (dailyBurnRate * remainingDays)
projectedOverrun = projectedFinalSpend - allocatedAmount
```

### Anomaly Detection
```javascript
Uses Standard Deviation:
- Calculate average transaction amount
- Calculate standard deviation
- Flag transactions > 2SD from mean as anomalies
```

## Security Considerations

1. **Authentication**: JWT tokens with expiration (7 days)
2. **Authorization**: Role-based access control (admin, finance_manager, site_coordinator)
3. **Password**: Bcrypt hashing with salt rounds
4. **Database**: MongoDB Atlas with firewall rules
5. **API**: Token required for all protected endpoints
6. **Input Validation**: Express validator on all inputs
7. **CORS**: Configured for frontend URL only

## Performance Optimizations

1. **Database**: Indexes on frequently queried fields
2. **API**: Connection pooling via Mongoose
3. **Frontend**: React lazy loading, code splitting with Vite
4. **Caching**: Token stored in localStorage
5. **Charts**: Recharts with optimized rendering

## Scaling Considerations

- **Database**: MongoDB scaling with replica sets
- **Backend**: Horizontal scaling with load balancer
- **Frontend**: CDN distribution for static assets
- **Caching**: Redis for session/data caching
- **Queue**: Message queue for async operations (future)

---

This architecture provides a solid foundation for a production-grade budget management system with room for scaling and enhancement.
