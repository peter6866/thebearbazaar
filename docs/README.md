# Bear Bazaar API Documentation

## Overview

Bear Bazaar is a secure meal point exchange platform for Washington University students. This RESTful API enables students to buy and sell meal points through a fair, automated matching system.

## Base URL

```
http://<host>[:<port>]/api/v1
```

## API Documentation Index

### 📋 [Authentication API](./auth_api.md)

- **Base Path:** `/users/auth/*`
- **Description:** User registration, login, and verification
- **Key Features:**
  - Email verification with WashU addresses
  - JWT token-based authentication
  - CAPTCHA protection
  - Password reset functionality

### 👤 [User Profile & Admin API](./users_api.md)

- **Base Path:** `/users/*`
- **Description:** User profile management and admin functions
- **Key Features:**
  - Notification preferences
  - Phone number management
  - Password changes
  - User statistics (admin)
  - User banning (admin)

### 💰 [Bids API](./bids_api.md)

- **Base Path:** `/bids/*`
- **Description:** Core bidding functionality
- **Key Features:**
  - Unified buy/sell bid creation
  - Market information (public)
  - Price guidance and notifications
  - Admin bid management

### 🤝 [Match & Transactions API](./match_api.md)

- **Base Path:** `/match/*`
- **Description:** Matching system and transaction management
- **Key Features:**
  - Automated weekly matching
  - Transaction cancellation
  - Price history (public)
  - Match administration

### 📚 [Content & Settings API](./content_api.md)

- **Base Path:** `/faq/*`, `/feedback/*`, `/settings/*`
- **Description:** FAQ management, user feedback, and system settings
- **Key Features:**
  - Public FAQ system
  - User feedback collection
  - Scheduled match time configuration

## API Design Principles

### RESTful Architecture

- **Resource-based URLs**: `/users/profile/phone` instead of `/updatePhoneNumber`
- **HTTP methods**: GET, POST, PATCH, DELETE used appropriately
- **Consistent response format**: All responses follow standard JSON structure
- **Status codes**: Proper HTTP status codes for different scenarios

### Security Features

- **JWT Authentication**: Bearer token for secure API access
- **Role-based permissions**: Admin vs. user access levels
- **WashU email verification**: Only verified WashU students can participate
- **CAPTCHA protection**: Prevents automated abuse
- **Ban system**: Admins can ban problematic users

### Public vs Protected Endpoints

#### Public Endpoints (No Authentication)

- `GET /bids/market` - Market information
- `GET /match/price-history` - Historical pricing
- `GET /faq` - Frequently asked questions
- `GET /settings/schedule` - Match schedule

#### Protected Endpoints (Authentication Required)

- All user profile operations
- Bid creation and management
- Match information and cancellation
- Feedback submission

#### Admin-Only Endpoints

- User banning and statistics
- FAQ management
- Feedback administration
- System settings
- Bid and match administration

## Quick Start

### 1. Authentication Flow

```bash
# Get verification code
POST /api/v1/users/auth/code
{
  "email": "student@wustl.edu",
  "reset": false,
  "turnstileToken": "<TOKEN>"
}

# Verify and complete registration
POST /api/v1/users/auth/verify
{
  "email": "student@wustl.edu",
  "verificationCode": "123456",
  "password": "SecurePass123"
}

# Login (returns JWT token)
POST /api/v1/users/auth/login
{
  "email": "student@wustl.edu",
  "password": "SecurePass123",
  "turnstileToken": "<TOKEN>"
}
```

### 2. Create a Bid

```bash
# Create buy bid (include JWT in Authorization header)
POST /api/v1/bids
Authorization: Bearer <JWT_TOKEN>
{
  "type": "buy",
  "price": 150
}
```

### 3. Check for Matches

```bash
# Check current match status
GET /api/v1/match/current
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    // Additional error details (development only)
  }
}
```

## Common HTTP Status Codes

- **200** - OK (successful GET requests)
- **201** - Created (successful POST requests)
- **204** - No Content (successful DELETE requests)
- **400** - Bad Request (validation errors, malformed requests)
- **401** - Unauthorized (invalid or missing authentication)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (server-side issues)

## Rate Limiting

- **Production**: 100 requests per hour per IP address
- **Development**: No rate limiting
- **Headers**: Rate limit information included in response headers

## Environment Variables

Required environment variables for the API:

```bash
# Database
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGHOST=your_db_host

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email (Production - AWS SES)
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key

# Email (Development - SendGrid)
SENDGRID_API_KEY=your_sendgrid_key

# CAPTCHA
TURNSTILE_SECRET_KEY=your_turnstile_secret

# Environment
NODE_DEV_ENV=development|production
```

## Testing

### Development Server

```bash
npm start
# API available at http://localhost:3001/api/v1
```

### Run Tests

```bash
npm test
```

## Support

For API support or questions:

- **Email**: hjiayu@wustl.edu
- **Documentation Issues**: Submit feedback through the API
- **Bug Reports**: Use the feedback system in the application

## Changelog

### v1.0.0 (Current)

- ✅ RESTful API design implementation
- ✅ Unified bid creation endpoint
- ✅ Route parameter-based operations
- ✅ Consistent authentication patterns
- ✅ Public endpoint optimization
- ✅ Comprehensive error handling
