import api from './api';

const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  logout: () => localStorage.removeItem('token'),
};

const budgetService = {
  createBudget: (budgetData) => api.post('/budget/create', budgetData),
  getBudgets: (school) => api.get('/budget/list', { params: { school } }),
  getBudget: (id) => api.get(`/budget/${id}`),
  addLineItem: (lineItemData) => api.post('/budget/line-item/add', lineItemData),
  getLineItems: (budgetId) => api.get('/budget/line-items/list', { params: { budgetId } }),
  getTransactions: (budgetId, lineItemId) =>
    api.get('/budget/transactions/list', { params: { budgetId, lineItemId } }),
  recordTransaction: (transactionData) => api.post('/budget/transaction/record', transactionData),
  approveBudget: (budgetId) => api.put(`/budget/${budgetId}/approve`),
  lockBudget: (budgetId) => api.put(`/budget/${budgetId}/lock`),
  getDashboard: (budgetId) => api.get(`/budget/${budgetId}/dashboard`),
  getAlerts: (budgetId) => api.get('/budget/alerts/list', { params: { budgetId } }),
};

const analyticsService = {
  getVarianceAnalysis: (budgetId) => api.get(`/analytics/${budgetId}/variance`),
  getQuarterlyComparison: (budgetId) => api.get(`/analytics/${budgetId}/quarterly-comparison`),
};

const forecastService = {
  generateForecast: (forecastData) => api.post('/forecast/generate', forecastData),
  getForecasts: (budgetId) => api.get('/forecast/list', { params: { budgetId } }),
};

const supplementalService = {
  createSupplementalBudget: (supplementalData) => api.post('/supplemental/create', supplementalData),
  approveSupplementalBudget: (id) => api.put(`/supplemental/${id}/approve`),
  getSupplementalBudgets: (budgetId) => api.get('/supplemental/list', { params: { budgetId } }),
};

const assetService = {
  createAsset: (assetData) => api.post('/assets/create', assetData),
  getAssets: (budgetId) => api.get('/assets/list', { params: { budgetId } }),
  getEndOfLifeAssets: (budgetId) => api.get('/assets/end-of-life', { params: { budgetId } }),
  updateAssetStatus: (assetId, status) => api.put(`/assets/${assetId}/status`, { status }),
};

const recommendationService = {
  generateRecommendations: (budgetId) => api.post(`/recommendations/${budgetId}/generate`),
  getRecommendations: (budgetId) => api.get('/recommendations/list', { params: { budgetId } }),
  updateRecommendationStatus: (id, status) => api.put(`/recommendations/${id}/status`, { status }),
};

const commitmentService = {
  createCommitment: (commitmentData) => api.post('/commitments/create', commitmentData),
  getCommitments: (budgetId) => api.get('/commitments/list', { params: { budgetId } }),
  updateCommitmentStatus: (id, status) => api.put(`/commitments/${id}/status`, { status }),
};

export {
  authService,
  budgetService,
  analyticsService,
  forecastService,
  supplementalService,
  assetService,
  recommendationService,
  commitmentService,
};
