// Simple activity logger utility
// In a real application, this would log to a database or file

const activities = []; // In-memory storage for demo purposes

const logActivity = (userId, action, details = {}) => {
  const activity = {
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip || 'unknown'
  };

  // Store in memory (for demo)
  activities.push(activity);

  // Also log to console
  console.log(`[ACTIVITY] User ${userId}: ${action}`, details);

  // Keep only last 1000 activities in memory
  if (activities.length > 1000) {
    activities.shift();
  }

  return activity;
};

const getUserActivities = (userId, limit = 50) => {
  return activities
    .filter(activity => activity.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

const getAllActivities = (limit = 100) => {
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

const getActivitiesByAction = (action, limit = 50) => {
  return activities
    .filter(activity => activity.action === action)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

module.exports = {
  logActivity,
  getUserActivities,
  getAllActivities,
  getActivitiesByAction
};