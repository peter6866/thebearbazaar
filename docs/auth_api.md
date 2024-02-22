# API Documentation for User Authentication Service

## Base URL

The base URL for all API endpoints is:

```
http://<host>[:<port>]/api/v1/users
```

Replace `<host>` and `<port>` with your actual server host and port.

e.g.

```
127.0.0.1:3001/api/v1/users
```

## Endpoints Overview

### 1. Get Verification Code

- **Method:** POST
- **Endpoint:** `/get-code`
- **Description:** Generates and sends a one-time verification code to the user's email to verify their account.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "email": "user@example.com",
        "verificationCode": "123456"
      }
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:** `{"message": "User already registered or invalid email"}`

### 2. Sign Up Verification

- **Method:** POST
- **Endpoint:** `/signup-verify`
- **Description:** Verifies the email address with the provided verification code and sets a password for the user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "verificationCode": "123456",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Email verified successfully",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Response:**
  - **Code:** 400 / 404
  - **Content:** `{"message": "Verification code expired or incorrect"}`

### 3. Resend Verification Code

- **Method:** POST
- **Endpoint:** `/resend-code`
- **Description:** Resends the verification code to the user's email.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Verification code resent successfully"
    }
    ```
- **Error Response:**
  - **Code:** 404
  - **Content:** `{"message": "User not found"}`

### 4. Login

- **Method:** POST
- **Endpoint:** `/login`
- **Description:** Authenticates the user by their email and password, returning a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Response:**
  - **Code:** 401
  - **Content:** `{"message": "Incorrect email or password"}`

## Model Specifics

- **Email:** Must be unique and is required for registration.
- **Password:** Stored securely and used for authentication.
- **Verification Code:** A temporary code sent to the user's email for account verification.
- **isVerified:** Indicates whether the user has verified their email.
- **Verification Code Timestamp:** The timestamp when the verification code was last generated.
