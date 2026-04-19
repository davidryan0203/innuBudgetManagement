# Budget Management System - Setup & Installation Guide

## Prerequisites

Before you begin, make sure you have:
- Node.js v16 or higher
- npm or yarn package manager
- MongoDB Atlas account (sign up at https://mongodb.com/atlas)
- A code editor (VS Code recommended)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new cluster (default settings are fine)
4. Create a database user with a password
5. Get your connection string from "Connect" → "Drivers"
6. Replace `<username>` and `<password>` with your credentials

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.example.mongodb.net/budgetApp?retryWrites=true&w=majority
```

## Step 2: Clone & Setup Project

```bash
# Navigate to your documents folder
cd ~/Documents

# Clone or checkout the repository
cd innuBudgetApp

# Install dependencies for all packages
npm run install:all
```

This will:
1. Install root dependencies (concurrently)
2. Install backend dependencies (Express, MongoDB, JWT, etc.)
3. Install frontend dependencies (React, Vite, Recharts, etc.)

## Step 3: Configure Environment Variables

### Backend Configuration

Create or edit `backend/.env`:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.example.mongodb.net/budgetApp?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

Replace:
- `your-username` with your MongoDB Atlas username
- `your-password` with your MongoDB Atlas password
- `your-secret-key-change-in-production` with a secure secret (use `openssl rand -base64 32` to generate)

### Frontend Configuration

Create or edit `frontend/.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Start the Application

### Option A: Run Both Frontend & Backend (Recommended for Development)

```bash
npm run dev
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

## Step 5: Access the Application

1. Open your browser and go to http://localhost:3000
2. You should see the login page

## First Time Setup

### Create Your First Account

1. Click "Register here" on the login page
2. Fill in the registration form:
   - Name: Your full name
   - Email: Your email address
   - Password: Create a secure password
   - School: Enter school name (e.g., "SIS" or "NIMS")
   - Role: Select "admin" for full access

3. Click "Register"
4. You'll be logged in automatically

### Create Your First Budget

1. Click on "Budget Management" in the navigation
2. Fill in "Create New Budget" form:
   - Fiscal Year: e.g., "2026-2027"
   - Student Enrollment: e.g., "500"
   - School: e.g., "SIS"
3. Click "Create Budget"
4. Click on the created budget to select it
5. Add line items:
   - Category: Select from dropdown (e.g., "Hardware-SIS")
   - Description: Add details (e.g., "Laptops and desktops")
   - Allocated Amount: Enter budget (e.g., "50000")
6. Click "Add Line Item"

### Record Transactions

1. Go to "Transactions" in navigation
2. Fill in transaction details:
   - Line Item ID: (Will need to look up from database or provide UI)
   - Transaction ID: Unique identifier (e.g., "TXN-001")
   - Amount: Spend amount (e.g., "5000")
   - Date: Transaction date
   - Vendor Name: (e.g., "Tech Supply Co.")
   - Invoice Number: (e.g., "INV-2024-001")
3. Click "Record Transaction"

### View Dashboard

1. Click "Dashboard" in navigation
2. View:
   - Total budgeted vs spent
   - Burn rate by line item
   - Top cost drivers
   - Quarterly trends
   - Detailed variance analysis

## Project Features

### Authentication
- ✅ User registration and login
- ✅ Role-based access control
- ✅ JWT token management
- ✅ Password encryption with bcrypt

### Budget Management
- ✅ Create fiscal year budgets
- ✅ Add line items with allocations
- ✅ Lock budgets after approval
- ✅ Track supplemental budgets

### Real-Time Monitoring
- ✅ Record transactions
- ✅ Calculate burn rate
- ✅ Automatic alert generation (80% threshold)
- ✅ Cost per student calculation

### Analytics & Insights
- ✅ Variance analysis (budgeted vs actual)
- ✅ Quarterly comparison
- ✅ Top 5 cost drivers
- ✅ Line item breakdown

### Forecasting
- ✅ Generate spending forecasts
- ✅ Predict budget overruns
- ✅ Confidence level calculation
- ✅ Trend analysis

### Additional Features
- ✅ Asset lifecycle tracking
- ✅ Commitment tracking (POs)
- ✅ Smart recommendations
- ✅ Supplemental budget support
- ✅ Alert management

## Troubleshooting

### Backend won't start

**Error: "Connection refused" or "Cannot connect to MongoDB"**
```
✓ Check MongoDB Atlas connection string in backend/.env
✓ Verify username and password are correct
✓ Check firewall/IP whitelist settings in MongoDB Atlas
✓ Ensure NODE_ENV is set to "development"
```

**Error: "Cannot find module 'express'"**
```
cd backend
npm install
```

### Frontend won't load

**Error: "Cannot GET /"**
```
✓ Make sure both backend and frontend are running
✓ Check that frontend is on port 3000 and backend on 5000
✓ Check browser console for network errors
```

**Error: "VITE_API_URL not found"**
```
✓ Create frontend/.env.local file with VITE_API_URL=http://localhost:5000/api
✓ Restart the development server
```

### Login fails

**Error: "Invalid email or password"**
```
✓ Check that you created an account via registration
✓ Verify email and password are correct
✓ Check MongoDB Atlas database for User records
```

**Error: "No token provided"**
```
✓ Token might be expired
✓ Try logging in again
✓ Check browser localStorage for "token" key
```

### Can't record transactions

**Error: "Failed to record transaction"**
```
✓ Verify line item ID is correct
✓ Check that budget exists and is not locked
✓ Ensure all required fields are filled
✓ Check browser console for detailed error message
```

## Development Tips

### Database Inspection

To view your MongoDB data:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. View data in real-time

### API Testing

Use Postman or curl to test endpoints:

```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Create budget (requires token from above)
curl -X POST http://localhost:5000/api/budget/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fiscalYear":"2026-2027",
    "school":"SIS",
    "studentEnrollment":500
  }'
```

### Code Changes

The application uses hot-reload:
- Backend: Changes require restart
- Frontend: Changes auto-reload in browser

## Next Steps

1. **Customize dashboard**: Modify `frontend/src/pages/Dashboard.jsx`
2. **Add more alerts**: Update `backend/utils/analysis.js`
3. **Enhance forecasting**: Improve prediction algorithm
4. **Add user roles**: Implement role-specific views
5. **Deploy to production**: Follow deployment guides

## Build for Production

```bash
# Build both frontend and backend
npm run build:all

# Build individually
cd backend && npm run build
cd frontend && npm run build
```

## Support

For issues or questions:
1. Check the README.md for architecture overview
2. Review individual file comments for implementation details
3. Check MongoDB Atlas logs for database errors
4. Use browser developer tools (F12) for frontend debugging

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install all dependencies |
| `npm run dev` | Start both frontend and backend |
| `npm run backend` | Start backend only |
| `npm run frontend` | Start frontend only |
| `npm run build:all` | Build for production |

---

**Happy budgeting! 🎉**
