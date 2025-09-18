# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an "acquisitions" system with authentication, built using modern JavaScript (ES modules), PostgreSQL with Drizzle ORM, and comprehensive logging with Winston.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` - Uses Node's watch mode to automatically restart on changes
- **Database operations**:
  - Generate migrations: `npm run db:generate`
  - Run migrations: `npm run db:migrate`
  - Open Drizzle Studio: `npm run db:studio`

### Code Quality
- **Linting**: `npm run lint` (check) or `npm run lint:fix` (auto-fix)
- **Formatting**: `npm run format` (auto-format) or `npm run format:check` (check only)

## Architecture Overview

### Project Structure
- **Entry point**: `src/index.js` → loads environment variables and starts server
- **Server setup**: `src/server.js` → basic Express server setup
- **App configuration**: `src/app.js` → middleware, routing, and Express app setup
- **Path imports**: Uses custom import maps (e.g., `#config/*`, `#controller/*`) defined in package.json

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL (Neon database)
- **Configuration**: `drizzle.config.js` - points to models in `src/models/*.js`
- **Connection**: `src/config/database.js` - exports `db` and `sql` instances
- **Models**: Currently has `users` table in `src/models/user.model.js`

### Authentication System
- **JWT-based authentication** with secure HTTP-only cookies
- **Password hashing** using bcrypt (salt rounds: 10)
- **Validation** using Zod schemas in `src/validations/`
- **Controllers** handle request/response logic in `src/controller/`
- **Services** contain business logic in `src/services/`
- **Routes** organized by feature in `src/routes/`

### Utilities & Configuration
- **Logging**: Winston logger with file and console transports (`src/config/logger.js`)
  - Error logs: `logs/error.log`
  - Combined logs: `logs/combined.log`
  - Console output in non-production environments
- **Cookie management**: Centralized cookie utilities (`src/utils/cookies.js`)
- **JWT operations**: Token signing/verification (`src/utils/jwt.js`)
- **Error formatting**: Validation error formatting (`src/utils/format.js`)

## Code Standards

### ESLint Configuration
- 2-space indentation with switch case indentation
- Single quotes for strings
- Semicolons required
- No unused variables (except those prefixed with `_`)
- Prefer const over let, no var allowed
- Arrow functions and object shorthand preferred

### Import Style
- Uses ES modules throughout
- Custom import maps for internal modules (e.g., `import logger from '#config/logger.js'`)
- All file extensions (.js) must be explicitly included in imports

## Environment Setup

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (Neon database)
- `JWT_SECRET`: Secret key for JWT token signing
- `LOG_LEVEL`: Winston log level (defaults to 'info')
- `NODE_ENV`: Environment mode (affects cookie security and logging)
- `PORT`: Server port (defaults to 3000)

### Database Setup
1. Set `DATABASE_URL` in `.env` file
2. Run `npm run db:generate` to create migrations
3. Run `npm run db:migrate` to apply migrations
4. Use `npm run db:studio` to view/manage data

## API Endpoints

### Current Routes
- `GET /` - Health check with greeting
- `GET /health` - JSON health status with timestamp and uptime
- `GET /api` - API status confirmation
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Authentication Flow
1. User submits registration data
2. Data validated using Zod schema
3. Password hashed with bcrypt
4. User created in database
5. JWT token generated and set as HTTP-only cookie
6. User data returned (without password)