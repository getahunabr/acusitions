import logger from '#config/logger.js';
import { createUser, authenticateUser } from '#services/Auth.services.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';
import { jwttoken } from '#utils/jwt.js';
export const signup = async (req, res, next) => {
  try {
    const validationResults = signupSchema.safeParse(req.body);

    if (!validationResults.success) {
      return res.status(400).json({
        error: 'Validations failed',
        details: formatValidationError(validationResults.error),
      });
    }
    const { name, email, password, role } = validationResults.data;
    // Auth services
    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);
    logger.info(`User registered successfully:${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('signup error', error);

    if (error.message === 'user with this email Already exists') {
      return res.status(409).json({ error: 'user Already exists.' });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResults = signInSchema.safeParse(req.body);

    if (!validationResults.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResults.error),
      });
    }

    const { email, password } = validationResults.data;

    // Authenticate user
    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User signed in successfully: ${email}`);

    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('signin error', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (error.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');

    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('signout error', error);
    next(error);
  }
};
