import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/Auth.services.js';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);

    return allUsers;
  } catch (error) {
    logger.error('Error getting users', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    logger.error('Error getting user by ID', {
      id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prepare update object
    const updateData = { ...updates };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Add updated timestamp
    updateData.updated_at = new Date();

    // Update user in database
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User with ID ${id} updated successfully`);
    return updatedUser;
  } catch (error) {
    logger.error('Error updating user', {
      id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Delete user from database
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    logger.info(`User with ID ${id} deleted successfully`);
    return deletedUser;
  } catch (error) {
    logger.error('Error deleting user', {
      id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};
