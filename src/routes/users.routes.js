import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controller/users.controller.js';
import {
  authenticateToken,
  authorizeRoles,
} from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Get all users - requires authentication and admin role
router.get('/', authenticateToken, fetchAllUsers);

// Get user by ID - requires authentication, users can view their own profile or admins can view any
router.get('/:id', authenticateToken, fetchUserById);

// Update user by ID - requires authentication, users can update their own profile
router.put('/:id', authenticateToken, updateUserById);

// Delete user by ID - requires authentication, users can delete their own account or admins can delete any
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteUserById
);

export default router;
