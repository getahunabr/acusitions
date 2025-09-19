import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.services.js';
import { formatValidationError } from '#utils/format.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users...', {
      requestedBy: req.user
        ? `${req.user.email} (${req.user.role})`
        : 'Anonymous',
    });

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved all users.',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error fetching all users:', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    logger.info(`Getting user by ID: ${id}`, {
      requestedBy: req.user
        ? `${req.user.email} (${req.user.role})`
        : 'Anonymous',
    });

    const user = await getUserById(id);

    res.json({
      message: 'Successfully retrieved user.',
      user,
    });
  } catch (error) {
    logger.error('Error fetching user by ID:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist.',
      });
    }

    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate the user ID parameter
    const idValidationResult = userIdSchema.safeParse(req.params);

    if (!idValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidationResult.error),
      });
    }

    // Validate the update data
    const bodyValidationResult = updateUserSchema.safeParse(req.body);

    if (!bodyValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidationResult.error),
      });
    }

    const { id } = idValidationResult.data;
    const updates = bodyValidationResult.data;

    // Authorization logic
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    const isOwner = currentUserId === id;
    const isAdmin = currentUserRole === 'admin';

    // Users can only update their own profile unless they are admin
    if (!isOwner && !isAdmin) {
      logger.warn('Unauthorized update attempt', {
        attemptedBy: req.user.email,
        targetUserId: id,
        currentUserId,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile.',
      });
    }

    // Only admins can change user roles
    if (updates.role && !isAdmin) {
      logger.warn('Unauthorized role change attempt', {
        attemptedBy: req.user.email,
        targetUserId: id,
        currentUserRole,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles.',
      });
    }

    logger.info(`Updating user with ID: ${id}`, {
      updatedBy: `${req.user.email} (${req.user.role})`,
      updateFields: Object.keys(updates),
    });

    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Error updating user:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The user you are trying to update does not exist.',
      });
    }

    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Authorization logic
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    const isOwner = currentUserId === id;
    const isAdmin = currentUserRole === 'admin';

    // Users can delete their own account, admins can delete any account
    if (!isOwner && !isAdmin) {
      logger.warn('Unauthorized delete attempt', {
        attemptedBy: req.user.email,
        targetUserId: id,
        currentUserId,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account.',
      });
    }

    logger.info(`Deleting user with ID: ${id}`, {
      deletedBy: `${req.user.email} (${req.user.role})`,
      isOwner,
      isAdmin,
    });

    const deletedUser = await deleteUser(id);

    res.json({
      message: 'User deleted successfully.',
      user: deletedUser,
    });
  } catch (error) {
    logger.error('Error deleting user:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'The user you are trying to delete does not exist.',
      });
    }

    next(error);
  }
};
