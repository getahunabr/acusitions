import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Error hashing the password,${error}`);
    throw new Error('Error hashing.');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error(`Error comparing passwords: ${error}`);
    throw new Error('Error comparing passwords.');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${user.email} authenticated successfully.`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    };
  } catch (error) {
    logger.error(`Error authenticating user: ${error}`);
    throw error; // Re-throw to preserve specific error messages
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length > 0)
      throw new Error('user with this email Already exists');
    const password_hash = await hashPassword(password);
    const [new_user] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
      });
    logger.info(`User ${new_user.email} created Successfully.`);
    return new_user;
  } catch (error) {
    logger.error(`Error creating the users:${error}`);
    throw error; // Re-throw to preserve specific error messages
  }
};
