const express = require('express');
const { User } = require('../models/models');
const {authMiddleware} = require('./auth_router');
const user_router = express.Router();

// Get all users (admin only)
user_router.get('/users', authMiddleware, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const users = await User.findAll({
      attributes: ['user_id', 'name', 'email', 'role', 'createdAt'] // alias createdAt for created_at
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {user_router};
