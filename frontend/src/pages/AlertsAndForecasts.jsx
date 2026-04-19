import React, { useState, useEffect } from 'react';
import { budgetService, forecastService } from '../services/services';
import '../styles/Alerts.css';

export const AlertsAndForecasts = ({ budgetId }) => {
  const [alerts, setAlerts] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [budgetId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, forecastsRes] = await Promise.all([
        budgetService.getAlerts(budgetId),
        forecastService.getForecasts(budgetId),
      ]);
      setAlerts(alertsRes.data);
      setForecasts(forecastsRes.data);
    } catch (err) {
      setError('Failed to fetch alerts and forecasts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#ff4444';
      case 'high':
        return '#ff8800';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#88aa00';
      default:
        return '#666666';
    }
  };

  if (loading) return <div className="loading">Loading alerts and forecasts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="alerts-forecasts">
      <h1>Alerts & Forecasts</h1>

      <div className="alerts-section">
        <h2>Active Alerts</h2>
        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert._id} className="alert-card" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
                <div className="alert-header">
                  <h3>{alert.alertType}</h3>
                  <span className={`severity-badge severity-${alert.severity}`}>{alert.severity}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <p className="alert-date">{new Date(alert.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="forecasts-section">
        <h2>Forecasts</h2>
        {forecasts.length === 0 ? (
          <p>No forecasts available</p>
        ) : (
          <table className="forecasts-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Current Spend Rate</th>
                <th>Projected EOY Spend</th>
                <th>Projected Overrun</th>
                <th>Trend</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((forecast) => (
                <tr key={forecast._id}>
                  <td>{forecast.lineItem?.category}</td>
                  <td>${forecast.currentSpendRate?.toLocaleString()}</td>
                  <td>${forecast.projectedEndOfYearSpend?.toLocaleString()}</td>
                  <td className={forecast.projectedOverrun > 0 ? 'alert-value' : 'normal-value'}>
                    ${forecast.projectedOverrun?.toLocaleString()}
                  </td>
                  <td>
                    <span className={`trend-badge trend-${forecast.trend}`}>{forecast.trend}</span>
                  </td>
                  <td>{forecast.confidenceLevel}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
