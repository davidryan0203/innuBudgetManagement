# Budget Management System - Development Guide

## Project Overview
Full-stack Budget Management Application for school budget tracking with authentication, real-time monitoring, forecasting, and intelligent alerts.

**Tech Stack:**
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- Additional: Recharts for analytics, Axios for API calls

## Project Status: ✅ COMPLETE

The Budget Management System has been fully scaffolded with:
- Complete backend API with 8 route modules
- React frontend with authentication and dashboard
- MongoDB models for all data entities
- Real-time analytics and forecasting engines
- Smart alert and recommendation systems

## File Structure

```
innuBudgetApp/
├── backend/
│   ├── models/          (10 MongoDB schemas)
│   ├── controllers/     (6 business logic modules)
│   ├── routes/          (8 API route modules)
│   ├── middleware/      (Authentication)
│   ├── config/          (Database & config)
│   ├── utils/           (Analysis helpers)
│   ├── server.js        (Express entry point)
│   ├── package.json
│   └── .env (configure with MongoDB URI)
├── frontend/
│   ├── src/
│   │   ├── pages/       (6 page components)
│   │   ├── services/    (API integration)
│   │   ├── context/     (Auth management)
│   │   ├── styles/      (CSS modules)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json         (Root scripts)
├── README.md            (Full documentation)
├── SETUP.md             (Installation guide)
├── ARCHITECTURE.md      (System design)
└── .gitignore
```

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
**Backend `.env`:**
```
MONGO_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/budgetApp?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**Frontend `.env.local`:**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Application
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Features
✅ User authentication and authorization (JWT + bcrypt)
✅ Budget structure management (fiscal year, line items)
✅ Supplemental budget support
✅ Real-time budget burn rate tracking
✅ Variance analysis (budgeted vs actual)
✅ AI-powered forecasting with overrun predictions
✅ Cost per student calculation
✅ Asset management and lifecycle tracking
✅ Intelligent alerts (threshold exceeded, unusual spikes)
✅ Comprehensive dashboard with 5+ metrics
✅ Commitment tracking (PO management)
✅ Smart recommendations engine
✅ Role-based access control

## Running the Application

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- npm or yarn

### Development Commands
```bash
# Install all dependencies
npm run install:all

# Start backend and frontend together
npm run dev

# Backend only
npm run backend

# Frontend only  
npm run frontend

# Build for production
npm run build:all
```

## Database
MongoDB Atlas connection string format:
`mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/budgetApp?retryWrites=true&w=majority`

## Key Features Implemented

### Authentication & Authorization
- User registration and login
- JWT token management
- Role-based access control
- Password encryption with bcrypt

### Budget Management
- Create and manage fiscal year budgets
- Add line items with allocations
- Lock budgets after approval
- Support for budget realignment

### Real-Time Monitoring
- Record transactions
- Calculate burn rate
- Automatic alert generation
- Cost per student tracking

### Analytics
- Variance analysis (budgeted vs actual)
- Quarterly spending trends
- Top cost drivers identification
- Line-item performance breakdown

### Forecasting & Predictions
- Generate spending forecasts
- Predict budget overruns
- Confidence level calculation
- Trend analysis (increasing/decreasing/stable)

### Asset Management
- Track IT equipment lifecycle
- Project end-of-life costs
- Asset status management

### Smart Features
- Intelligent alerts for budget thresholds
- Anomaly detection in spending
- AI-generated recommendations
- Supplemental budget support
- Commitment tracking (purchase orders)
- Contract management

## API Endpoints Overview

**Auth:** /api/auth (register, login, profile)
**Budget:** /api/budget (CRUD, transactions, approvals, locks)
**Analytics:** /api/analytics (variance, quarterly comparison)
**Forecast:** /api/forecast (generate, list)
**Supplemental:** /api/supplemental (create, approve, list)
**Assets:** /api/assets (CRUD, end-of-life tracking)
**Commitments:** /api/commitments (PO management)
**Recommendations:** /api/recommendations (AI suggestions)

## Documentation

- **README.md** - Complete feature documentation and usage guide
- **SETUP.md** - Step-by-step installation and configuration
- **ARCHITECTURE.md** - System design and data flow diagrams

## Next Steps

1. ✅ Install dependencies: `npm run install:all`
2. ✅ Configure MongoDB Atlas credentials in `backend/.env`
3. ✅ Start the application: `npm run dev`
4. ✅ Register your first account
5. ✅ Create a budget and start tracking

## Support & Documentation

- See README.md for detailed feature documentation
- See SETUP.md for troubleshooting guide
- See ARCHITECTURE.md for system design overview
- Check individual controller files for API documentation
