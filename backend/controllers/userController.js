const User = require('../models/User');
const activityLogger = require('../utils/activityLogger');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    activityLogger.logActivity(req.user.id, 'Profile accessed', {
      email: user.email
    });
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!name && !email) {
      return res.status(400).json({ message: 'At least one field must be provided' });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) {
      updateData.email = email.toLowerCase().trim();

      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    activityLogger.logActivity(userId, 'Profile updated', {
      oldEmail: req.user.email,
      newEmail: user.email,
      oldName: req.user.name,
      newName: user.name,
      changes: Object.keys(updateData)
    });
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Only allow admin users to see all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    activityLogger.logActivity(req.user.id, 'Viewed all users', {
      userCount: users.length
    });
    
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers
};