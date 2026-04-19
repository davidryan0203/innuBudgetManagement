const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Budget = require('../models/Budget');
const LineItem = require('../models/LineItem');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const Forecast = require('../models/Forecast');
const Commitment = require('../models/Commitment');
const SupplementalBudget = require('../models/SupplementalBudget');
const Recommendation = require('../models/Recommendation');
const Asset = require('../models/Asset');
const Contract = require('../models/Contract');

const LINE_ITEM_CATEGORIES = [
  'Hardware-SIS',
  'Software-SIS',
  'Hardware-NIMS',
  'Software-NIMS',
  'Telecommunications',
  'IT-Support',
  'Training',
  'Copier-SIS',
  'Copier-NIMS',
  'Copier-Board',
];

const DEPARTMENTS = [
  'IT Department',
  'Finance Department',
  'Operations Department',
  'Facilities Department',
  'Student Services Department',
];

const SCHOOLS = ['SIS', 'NIMS'];
const FISCAL_YEARS = ['2025-2026', '2026-2027'];

const VENDORS = [
  'Northern Systems Inc.',
  'Arctic Tech Solutions',
  'Classroom Cloud Ltd.',
  'Inuulitsivik Telecom',
  'Board Office Supplies',
  'Kativik Infrastructure Co.',
  'EduSupport Group',
  'Nunavik Hardware Partners',
];

const RUN_ID = Date.now().toString(36);

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));
const pickOne = (arr) => arr[randInt(0, arr.length - 1)];

const getQuarter = (date) => {
  const month = date.getMonth();
  if (month <= 2) return 'Q1';
  if (month <= 5) return 'Q2';
  if (month <= 8) return 'Q3';
  return 'Q4';
};

const getMonthName = (date) =>
  date.toLocaleString('en-US', {
    month: 'long',
  });

const randomDateInPastYear = () => {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - 1);
  return new Date(randInt(start.getTime(), now.getTime()));
};

async function clearCollections() {
  const collections = [
    Contract,
    Recommendation,
    SupplementalBudget,
    Commitment,
    Forecast,
    Alert,
    Transaction,
    LineItem,
    Budget,
    User,
  ];

  for (const model of collections) {
    await model.deleteMany({});
  }
}

async function fixLegacyIndexes() {
  try {
    await Budget.collection.dropIndex('fiscalYear_1');
    console.log('Dropped legacy budget index fiscalYear_1.');
  } catch (error) {
    if (error.codeName !== 'IndexNotFound') {
      throw error;
    }
  }

  await Budget.syncIndexes();
}

async function createUsers() {
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const departmentHeadPassword = await bcrypt.hash('DeptHead123!', 10);

  const admins = await User.insertMany([
    {
      name: 'System Admin One',
      email: 'admin1@budget.local',
      password: adminPassword,
      role: 'admin',
      school: 'District Office',
    },
    {
      name: 'System Admin Two',
      email: 'admin2@budget.local',
      password: adminPassword,
      role: 'admin',
      school: 'District Office',
    },
  ]);

  const departmentHeadsPayload = [];
  for (const school of SCHOOLS) {
    for (const department of DEPARTMENTS) {
      const emailBase = `${department.split(' ')[0].toLowerCase()}.${school.toLowerCase()}`;
      departmentHeadsPayload.push({
        name: `${department} Head (${school})`,
        email: `${emailBase}@budget.local`,
        password: departmentHeadPassword,
        role: 'department_head',
        school,
        department,
      });
    }
  }

  const departmentHeads = await User.insertMany(departmentHeadsPayload);

  return { admins, departmentHeads };
}

async function createBudgetData(users) {
  const createdBudgets = [];
  const lineItemsByBudget = new Map();

  for (const fiscalYear of FISCAL_YEARS) {
    for (const school of SCHOOLS) {
      for (const department of DEPARTMENTS) {
        const departmentHead = users.departmentHeads.find(
          (u) => u.school === school && u.department === department
        );

        const budget = await Budget.create({
          fiscalYear,
          school,
          department,
          studentEnrollment: randInt(350, 1600),
          status: pickOne(['draft', 'pending_approval', 'approved', 'locked']),
          createdBy: departmentHead ? departmentHead._id : users.admins[0]._id,
          notes: `Seeded budget for ${school} - ${department} (${fiscalYear})`,
        });

        createdBudgets.push(budget);

        const lineItems = [];
        for (const category of LINE_ITEM_CATEGORIES) {
          const allocatedAmount = randInt(25000, 220000);
          const lineItem = await LineItem.create({
            budget: budget._id,
            category,
            description: `${category} planning and operations for ${department}`,
            allocatedAmount,
            quotaAmount: randInt(0, Math.round(allocatedAmount * 0.1)),
            notes: `Seeded line item for ${category}`,
            isLocked: budget.status === 'locked',
          });
          lineItems.push(lineItem);
        }

        lineItemsByBudget.set(String(budget._id), lineItems);
      }
    }
  }

  return { createdBudgets, lineItemsByBudget };
}

async function createTransactionsAndCommitments(budgets, lineItemsByBudget) {
  let transactionCounter = 1;
  let commitmentCounter = 1;

  for (const budget of budgets) {
    const lineItems = lineItemsByBudget.get(String(budget._id)) || [];

    let budgetTotalSpent = 0;
    let budgetTotalCommitted = 0;
    let budgetTotalAllocated = 0;

    for (const lineItem of lineItems) {
      const transactionCount = randInt(4, 11);
      let lineItemSpent = 0;
      const transactionDocs = [];

      for (let i = 0; i < transactionCount; i += 1) {
        const txDate = randomDateInPastYear();
        const amount = randFloat(900, Math.max(1500, lineItem.allocatedAmount * 0.12));

        transactionDocs.push({
          lineItem: lineItem._id,
          budget: budget._id,
          transactionId: `TX-${RUN_ID}-${String(transactionCounter).padStart(6, '0')}`,
          amount,
          date: txDate,
          quarter: getQuarter(txDate),
          month: getMonthName(txDate),
          vendorName: pickOne(VENDORS),
          invoiceNumber: `INV-${randInt(10000, 99999)}`,
          paymentStatus: pickOne(['paid', 'paid', 'paid', 'pending']),
          purchaseOrderId: `PO-LINK-${randInt(1000, 9999)}`,
          description: `${lineItem.category} transaction ${i + 1}`,
        });

        lineItemSpent += amount;
        transactionCounter += 1;
      }

      if (transactionDocs.length > 0) {
        await Transaction.insertMany(transactionDocs);
      }

      const commitmentCount = randInt(1, 3);
      let lineItemCommitted = 0;
      const commitmentDocs = [];

      for (let i = 0; i < commitmentCount; i += 1) {
        const totalAmount = randFloat(1000, Math.max(2000, lineItem.allocatedAmount * 0.25));
        const remainingBalance = randFloat(0, totalAmount * 0.6);

        commitmentDocs.push({
          budget: budget._id,
          lineItem: lineItem._id,
          poId: `PO-${RUN_ID}-${String(commitmentCounter).padStart(6, '0')}`,
          poDate: randomDateInPastYear(),
          vendor: pickOne(VENDORS),
          totalAmount,
          remainingBalance,
          linkedBudgetCategory: lineItem.category,
          status: pickOne(['draft', 'pending', 'approved', 'delivered']),
        });

        lineItemCommitted += totalAmount - remainingBalance;
        commitmentCounter += 1;
      }

      if (commitmentDocs.length > 0) {
        await Commitment.insertMany(commitmentDocs);
      }

      const cappedSpent = Math.min(lineItemSpent, lineItem.allocatedAmount * randFloat(0.58, 1.28));
      const cappedCommitted = Math.min(lineItemCommitted, Math.max(0, lineItem.allocatedAmount - cappedSpent));

      lineItem.spentAmount = Number(cappedSpent.toFixed(2));
      lineItem.committedAmount = Number(cappedCommitted.toFixed(2));
      await lineItem.save();

      budgetTotalSpent += lineItem.spentAmount;
      budgetTotalCommitted += lineItem.committedAmount;
      budgetTotalAllocated += lineItem.allocatedAmount;
    }

    budget.totalBudget = Number(budgetTotalAllocated.toFixed(2));
    budget.totalSpent = Number(budgetTotalSpent.toFixed(2));
    budget.totalCommitted = Number(budgetTotalCommitted.toFixed(2));
    await budget.save();
  }
}

async function createForecastsAndAlerts(budgets, lineItemsByBudget) {
  for (const budget of budgets) {
    const lineItems = lineItemsByBudget.get(String(budget._id)) || [];
    const forecastDocs = [];
    const alertDocs = [];

    for (const lineItem of lineItems) {
      const utilization = lineItem.allocatedAmount > 0 ? lineItem.spentAmount / lineItem.allocatedAmount : 0;
      const projectedMultiplier = randFloat(0.9, 1.4);
      const projectedEndOfYearSpend = Number((lineItem.spentAmount * projectedMultiplier).toFixed(2));
      const projectedOverrun = Number((projectedEndOfYearSpend - lineItem.allocatedAmount).toFixed(2));

      forecastDocs.push({
        budget: budget._id,
        lineItem: lineItem._id,
        historicalData: {
          monthlySamples: randInt(6, 12),
          volatility: randFloat(0.1, 0.6),
        },
        currentSpendRate: Number((lineItem.spentAmount / 12).toFixed(2)),
        projectedEndOfYearSpend,
        projectedOverrun,
        quarter: pickOne(['Q1', 'Q2', 'Q3', 'Q4']),
        confidenceLevel: randInt(62, 96),
        trend: projectedOverrun > 0 ? pickOne(['increasing', 'stable']) : pickOne(['decreasing', 'stable']),
        seasonalFactors: {
          winter: randFloat(0.8, 1.3),
          spring: randFloat(0.8, 1.3),
        },
      });

      if (utilization > 0.8) {
        alertDocs.push({
          budget: budget._id,
          lineItem: lineItem._id,
          alertType: 'threshold_exceeded',
          severity: utilization > 1 ? 'critical' : 'high',
          message: `${lineItem.category} is at ${(utilization * 100).toFixed(1)}% utilization`,
          data: {
            utilizationPercentage: Number((utilization * 100).toFixed(2)),
            allocatedAmount: lineItem.allocatedAmount,
            spentAmount: lineItem.spentAmount,
          },
          isResolved: false,
        });
      }

      if (projectedOverrun > 0) {
        alertDocs.push({
          budget: budget._id,
          lineItem: lineItem._id,
          alertType: 'forecast_overrun',
          severity: projectedOverrun > lineItem.allocatedAmount * 0.15 ? 'critical' : 'medium',
          message: `${lineItem.category} is projected to overrun by ${Math.round(projectedOverrun)}`,
          data: {
            projectedEndOfYearSpend,
            projectedOverrun,
          },
          isResolved: false,
        });
      }

      if (Math.random() > 0.7) {
        alertDocs.push({
          budget: budget._id,
          lineItem: lineItem._id,
          alertType: 'unusual_spike',
          severity: pickOne(['medium', 'high']),
          message: `Unusual spending spike detected in ${lineItem.category}`,
          data: {
            spikeFactor: randFloat(1.2, 2.8),
          },
          isResolved: Math.random() > 0.7,
          resolvedAt: Math.random() > 0.7 ? new Date() : undefined,
        });
      }
    }

    if (forecastDocs.length > 0) {
      await Forecast.insertMany(forecastDocs);
    }

    if (alertDocs.length > 0) {
      await Alert.insertMany(alertDocs);
    }
  }
}

async function createSupplementalsRecommendationsAssetsContracts(budgets, lineItemsByBudget, users) {
  let contractCounter = 1;

  const supplementalDocs = [];
  const recommendationDocs = [];
  const assetDocs = [];
  const contractDocs = [];

  for (const budget of budgets) {
    const lineItems = lineItemsByBudget.get(String(budget._id)) || [];

    const supplementalTargets = lineItems.slice(0, 4);
    for (const lineItem of supplementalTargets) {
      const supplementalAmount = randFloat(1800, Math.max(5000, lineItem.allocatedAmount * 0.18));
      const status = pickOne(['pending', 'approved', 'rejected']);

      supplementalDocs.push({
        budget: budget._id,
        lineItem: lineItem._id,
        reason: `Adjusted funding for ${lineItem.category} due to operational demand`,
        previousAmount: lineItem.allocatedAmount,
        supplementalAmount,
        status,
        approvalDate: status === 'approved' ? randomDateInPastYear() : undefined,
        approvedBy: status === 'approved' ? users.admins[0]._id : undefined,
      });
    }

    recommendationDocs.push(
      {
        budget: budget._id,
        title: `Consolidate software licenses for ${budget.department}`,
        description: 'Bundle subscriptions to reduce duplicate SaaS spend across teams.',
        type: 'cost_saving',
        potentialSavings: randInt(3000, 12000),
        implementationDifficulty: pickOne(['easy', 'moderate']),
        priority: 'high',
        status: pickOne(['suggested', 'under_review', 'implemented']),
      },
      {
        budget: budget._id,
        title: `Adjust payment schedule for ${budget.school}`,
        description: 'Shift vendor payments to align with quarterly cash inflow timing.',
        type: 'cash_flow',
        potentialSavings: randInt(2000, 8000),
        implementationDifficulty: 'moderate',
        priority: 'medium',
        status: pickOne(['suggested', 'under_review']),
      },
      {
        budget: budget._id,
        title: `Mitigate hardware replacement risk in ${budget.department}`,
        description: 'Prioritize high-failure assets and renegotiate warranty extensions.',
        type: 'risk_mitigation',
        potentialSavings: randInt(5000, 20000),
        implementationDifficulty: pickOne(['moderate', 'difficult']),
        priority: pickOne(['medium', 'high']),
        status: pickOne(['suggested', 'under_review', 'dismissed']),
      },
    );

    assetDocs.push(
      {
        budget: budget._id,
        assetType: 'laptop',
        quantity: randInt(25, 120),
        purchaseDate: randomDateInPastYear(),
        expectedEndOfLife: new Date(Date.now() + randInt(150, 900) * 24 * 60 * 60 * 1000),
        estimatedReplacementCost: randInt(12000, 65000),
        location: budget.school,
        status: pickOne(['active', 'maintenance']),
      },
      {
        budget: budget._id,
        assetType: 'server',
        quantity: randInt(1, 8),
        purchaseDate: randomDateInPastYear(),
        expectedEndOfLife: new Date(Date.now() + randInt(60, 450) * 24 * 60 * 60 * 1000),
        estimatedReplacementCost: randInt(15000, 120000),
        location: `${budget.school} Data Room`,
        status: pickOne(['active', 'maintenance', 'end-of-life']),
      },
      {
        budget: budget._id,
        assetType: 'network_equipment',
        quantity: randInt(8, 40),
        purchaseDate: randomDateInPastYear(),
        expectedEndOfLife: new Date(Date.now() + randInt(120, 800) * 24 * 60 * 60 * 1000),
        estimatedReplacementCost: randInt(8000, 50000),
        location: `${budget.school} Campus Network`,
        status: pickOne(['active', 'maintenance', 'retired']),
      },
    );

    contractDocs.push(
      {
        budget: budget._id,
        contractId: `CT-${RUN_ID}-${String(contractCounter).padStart(5, '0')}`,
        contractorName: pickOne(VENDORS),
        startDate: randomDateInPastYear(),
        endDate: new Date(Date.now() + randInt(60, 730) * 24 * 60 * 60 * 1000),
        totalValue: randInt(12000, 180000),
        lineItem: pickOne(lineItems)._id,
        terms: 'Quarterly billing. Includes support and maintenance addendum.',
        status: pickOne(['active', 'pending_renewal', 'expired']),
      },
      {
        budget: budget._id,
        contractId: `CT-${RUN_ID}-${String(contractCounter + 1).padStart(5, '0')}`,
        contractorName: pickOne(VENDORS),
        startDate: randomDateInPastYear(),
        endDate: new Date(Date.now() + randInt(90, 900) * 24 * 60 * 60 * 1000),
        totalValue: randInt(18000, 240000),
        lineItem: pickOne(lineItems)._id,
        terms: 'Annual renewable contract with SLA and emergency response clause.',
        status: pickOne(['active', 'pending_renewal', 'terminated']),
      },
    );

    contractCounter += 2;
  }

  if (supplementalDocs.length > 0) {
    await SupplementalBudget.insertMany(supplementalDocs);
  }

  if (recommendationDocs.length > 0) {
    await Recommendation.insertMany(recommendationDocs);
  }

  if (assetDocs.length > 0) {
    await Asset.insertMany(assetDocs);
  }

  if (contractDocs.length > 0) {
    await Contract.insertMany(contractDocs);
  }
}

async function printSummary() {
  const [
    users,
    budgets,
    lineItems,
    transactions,
    alerts,
    forecasts,
    commitments,
    supplementals,
    recommendations,
    assets,
    contracts,
  ] = await Promise.all([
    User.countDocuments(),
    Budget.countDocuments(),
    LineItem.countDocuments(),
    Transaction.countDocuments(),
    Alert.countDocuments(),
    Forecast.countDocuments(),
    Commitment.countDocuments(),
    SupplementalBudget.countDocuments(),
    Recommendation.countDocuments(),
    Asset.countDocuments(),
    Contract.countDocuments(),
  ]);

  console.log('\nSeed complete with the following records:');
  console.log(`- Users: ${users}`);
  console.log(`- Budgets: ${budgets}`);
  console.log(`- Line Items: ${lineItems}`);
  console.log(`- Transactions: ${transactions}`);
  console.log(`- Alerts: ${alerts}`);
  console.log(`- Forecasts: ${forecasts}`);
  console.log(`- Commitments: ${commitments}`);
  console.log(`- Supplemental Budgets: ${supplementals}`);
  console.log(`- Recommendations: ${recommendations}`);
  console.log(`- Assets: ${assets}`);
  console.log(`- Contracts: ${contracts}`);

  console.log('\nDemo credentials:');
  console.log('- Admin: admin1@budget.local / AdminPass123!');
  console.log('- Admin: admin2@budget.local / AdminPass123!');
  console.log('- Department Heads: <department>.<school>@budget.local / DeptHead123!');
  console.log('  Example: it.sis@budget.local / DeptHead123!');
}

async function seed() {
  try {
    await connectDB();

    await fixLegacyIndexes();

    console.log('Connected to MongoDB. Clearing existing data...');
    await clearCollections();

    console.log('Creating users...');
    const users = await createUsers();

    console.log('Creating budgets and line items...');
    const { createdBudgets, lineItemsByBudget } = await createBudgetData(users);

    console.log('Creating transactions and commitments...');
    await createTransactionsAndCommitments(createdBudgets, lineItemsByBudget);

    console.log('Creating forecasts and alerts...');
    await createForecastsAndAlerts(createdBudgets, lineItemsByBudget);

    console.log('Creating supplementals, recommendations, assets, and contracts...');
    await createSupplementalsRecommendationsAssetsContracts(createdBudgets, lineItemsByBudget, users);

    await printSummary();
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seed();
