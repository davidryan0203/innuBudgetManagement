# User Guide and Presentation Script

## 1. What This App Does
The Budget Management System helps schools plan, track, and analyze budgets across a fiscal year.

Main outcomes for users:
- Create annual budgets for a school
- Add budget line items by category
- Record spending transactions
- Monitor budget health on a dashboard
- Review alerts and spending forecasts

## 2. Who Uses It
The app supports these roles during registration:
- `department_head`
- `admin`

Typical responsibilities:
- Department Head: creates and manages budgets for their own department
- Admin: views budgets across all departments and oversees governance actions

## 3. Before You Start
Required:
- A running backend API
- A running frontend app
- A user account

Recommended for demos:
- Run `npm run seed` once before presenting so all screens have realistic sample data.

Environment references:
- Frontend URL: `http://localhost:3000`
- Backend URL (default): `http://localhost:5000` or your configured backend port

Note:
- If root `npm run dev` fails because port is in use, free that backend port or update `backend/.env` and `frontend/.env.local` to matching ports.

## 4. First-Time Login Flow
1. Open the app in your browser.
2. Click `Register` if no account exists.
3. Fill in: name, email, password, school, role.
4. If role is `department_head`, enter the department (example: `IT Department`).
5. Submit registration.
6. You are redirected into the app.

Returning users:
1. Open the app.
2. Enter email and password on `Login`.
3. Submit to enter the dashboard.

## 5. Navigation Overview
After login, the top navigation includes:
- `Dashboard`
- `Budget Management`
- `Transactions`
- `Alerts & Forecasts`
- `Logout`

Important behavior:
- `Transactions` and `Alerts & Forecasts` require a selected budget first.
- Select a budget from `Budget Management` to unlock those pages.

## 6. Budget Status Management
Budget records are controlled through these statuses:

- `pending_approval`: Budget is awaiting admin review and decision.
- `approved`: Admin has approved the budget as the accepted operating baseline.
- `locked`: Admin has finalized the budget and locked all associated line items from further editing.

How statuses are managed:
- Admin users manage approval and lock actions.
- Department heads can create/manage their department budgets, but status governance is controlled by admin.

## 7. Core Workflow for End Users
Use this sequence in production and in demos.

### Step 1: Create a Budget
Page: `Budget Management`

1. In `Create New Budget`, enter:
   - Fiscal Year (example: `2026-2027`)
   - Student Enrollment
   - School
   - Department (admin users only)
2. Click `Create Budget`.
3. Confirm the budget appears in `Existing Budgets`.

### Step 2: Select the Budget
1. In `Existing Budgets`, click the budget card you just created.
2. Confirm it appears selected.
3. This selection powers Dashboard, Transactions, and Alerts/Forecasts.

Department access rules:
- Department Head: can only create and view budgets for their own department.
- Admin: can view all department budgets and can create budgets for any department.

### Step 3: Add Line Items
Still in `Budget Management`, use `Add Line Item`.

1. Choose a category (hardware, software, telecom, support, training, copier).
2. Add optional description.
3. Enter allocated amount.
4. Click `Add Line Item`.
5. Repeat until your budget is fully structured.
6. Review the line items table for allocated/spent/committed/remaining values.

### Step 4: Record Transactions
Page: `Transactions`

1. Ensure a budget is selected first.
2. Fill required fields:
   - Line Item (choose from dropdown)
   - Transaction ID (must be unique)
   - Amount
   - Date
3. Optional fields:
   - Vendor Name
   - Invoice Number
   - Purchase Order ID
4. Click `Record Transaction`.
5. Confirm success message appears.

Tip:
- Keep a consistent naming convention for Transaction IDs for auditing.

### Step 5: Review Dashboard Insights
Page: `Dashboard`

Users can interpret:
- Total Budgeted
- Total Spent
- Remaining Budget
- Utilization Rate
- Cost Per Student

Charts include:
- Budget vs Actual
- Burn Rate by Line Item
- Top Cost Drivers
- Quarterly Trend
- Variance Analysis Table

How to present it:
- Start with utilization and remaining budget.
- Move to burn rate and top cost drivers.
- End with variance table to show where intervention is needed.

### Step 6: Check Alerts and Forecasts
Page: `Alerts & Forecasts`

What users see:
- Active alerts with severity levels
- Forecast projections per category
- Projected overrun values
- Trend direction and confidence level

How to use it:
- Prioritize critical/high alerts first.
- Investigate categories with projected overruns.
- Use confidence and trend to decide urgency.

## 8. Suggested 10-Minute Demo Script
Use this script to present to business users.

1. Login (1 min)
- "I will sign in as a finance user to show end-to-end budget control."

2. Create Budget (2 min)
- "We start by creating a fiscal-year budget for a school with enrollment data."

3. Add Line Items (2 min)
- "Now we break the budget into actionable spending categories."

4. Record Transactions (2 min)
- "As expenses occur, we record each transaction for live tracking."

5. Dashboard (2 min)
- "This view gives decision-ready insights: utilization, top cost drivers, and variance."

6. Alerts & Forecasts (1 min)
- "The system flags risks early and predicts potential overruns so teams can act before year-end."

## 9. Talking Points for Stakeholders
Use these points during Q&A:
- Transparency: every transaction is tied to budget lines.
- Accountability: unique transaction IDs and structured categories support audit readiness.
- Proactive control: alerts and forecasts surface risk before overspending happens.
- Decision support: dashboard consolidates metrics for quick management decisions.
- Governance: role-based access ensures each department head only manages their department's budget while admin has full organizational visibility.

## 10. Common User Questions
### Q: Why can’t I open Transactions or Alerts?
A: A budget is not selected. Go to `Budget Management`, click a budget card, then return.

### Q: Why can’t a department head see another department’s budget?
A: Access is restricted by role. Department heads are scoped to their own department budgets.

### Q: Why did transaction entry fail?
A: Check required fields, choose a valid line item from the dropdown, and ensure `transactionId` is unique.

### Q: Why are there no alerts?
A: Alerts appear only when thresholds or unusual patterns are detected.

### Q: Why are forecasts empty?
A: Forecasting needs sufficient budget/transaction data tied to the selected budget.

## 11. Presenter Checklist (Before Meeting)
- Confirm backend is running and connected to MongoDB.
- Confirm frontend loads at `http://localhost:3000`.
- Confirm login credentials work.
- Prepare one sample budget with at least 3 line items.
- Prepare 2-3 sample transactions.
- Validate dashboard and alerts load for the selected budget.
- Keep one backup user account ready.

## 12. Optional Improvements for Better End-User Experience
If you want this app to be even easier for non-technical users:
- Add CSV import for transaction uploads.
- Add exportable PDF summary from dashboard.
- Add role-based page visibility for cleaner navigation.
