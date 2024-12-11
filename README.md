# C-Derm API

## Overview
A Node.js Express API for user authentication, article management, and OTP generation, connected to a MySQL database.

## Technologies
- Node.js
- Express.js
- MySQL
- SendGrid
- JWT
- bcrypt

## Features
- User Registration
- User Login
- OTP Verification
- Article Retrieval
- User Profile Management

## Prerequisites
- Node.js (v14+)
- MySQL Database
- SendGrid Account

## Environment Variables

Configure Environment Variables
Create a `.env` file with:
```
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
MYSQL_HOST=your_database_host
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_DATABASE=your_database_name
```

## API Endpoints

### User Routes
- `POST /register`: Register new user
- `POST /login`: User login
- `POST /verify-otp`: Verify OTP
- `POST /logout`: User logout
- `PUT /change-username`: Update username
- `PUT /change-password`: Update password

### Articles Route
- `GET /articles`: Retrieve all articles

## Authentication
- JWT-based authentication
- OTP verification for sensitive operations

## Error Handling
- `400`: Bad Request
- `401`: Unauthorized
- `500`: Server Error

## Security Features
- Bcrypt password hashing
- JWT token validation
- OTP verification
- Token blacklisting

## Project Structure
```
api_c-derm/
│
├── controllers/
│   ├── articlesController.js
│   ├── userController.js
│   ├── changeController.js
│   ├── otpController.js
│   └── logoutController.js
│
├── middleware/
│   └── authenticateJWT.js
│
├── services/
│   └── emailService.js
│
├── utils/
│   └── helpers.js
│
├── routes/
│   └── userRouter.js
│
├── db.js
└── server.js
```

## Contributor

- **C183B4KY3040** - Muhammad Ridhwan Hakiki
- **C183B4KX3195** - Nada Satya Maharani
