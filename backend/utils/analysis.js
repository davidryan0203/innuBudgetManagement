const calculateBurnRate = (totalSpent, totalBudget, daysElapsed) => {
  if (daysElapsed === 0) return 0;
  return (totalSpent / daysElapsed);
};

const calculateQuarter = (date) => {
  const month = date.getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

const getMonthName = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
};

const predictOverrun = (currentSpend, allocatedAmount, daysElapsed, totalDays) => {
  const dailyBurnRate = currentSpend / daysElapsed;
  const remainingDays = totalDays - daysElapsed;
  const projectedFinalSpend = currentSpend + (dailyBurnRate * remainingDays);
  const projectedOverrun = projectedFinalSpend - allocatedAmount;
  
  return {
    projectedSpend: projectedFinalSpend,
    overrun: projectedOverrun,
    percentageOverrun: (projectedOverrun / allocatedAmount) * 100,
  };
};

const calculateCostPerStudent = (totalSpent, studentEnrollment) => {
  if (studentEnrollment === 0) return 0;
  return totalSpent / studentEnrollment;
};

const detectAnomalies = (transactions) => {
  if (transactions.length < 2) return [];
  
  const amounts = transactions.map(t => t.amount);
  const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sq, n) => sq + Math.pow(n - average, 2), 0) / amounts.length
  );
  
  return transactions.filter(t => 
    Math.abs(t.amount - average) > stdDev * 2
  );
};

module.exports = {
  calculateBurnRate,
  calculateQuarter,
  getMonthName,
  predictOverrun,
  calculateCostPerStudent,
  detectAnomalies,
};
