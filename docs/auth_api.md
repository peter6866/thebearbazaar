# API Documentation for Bear Bazaar Authentication

## Base URL

```
http://<host>[:<port>]/api/v1/users
```

## Authentication Endpoints

All authentication endpoints are under `/auth/*` and are **public** (no authentication required).

### 1. Get Verification Code

- **Method:** POST
- **Endpoint:** `/auth/code`
- **Description:** Generates and sends a one-time verification code to the user's email.
- **Request Body:**
  ```json
  {
    "email": "user@wustl.edu",
    "reset": false,
    "turnstileToken": "<TURNSTILE_TOKEN>"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": 1,
          "email": "user@wustl.edu"
        }
      }
    }
    ```
- **Error Responses:**
  - **Code:** 400 - `{"message": "User already registered"}`
  - **Code:** 400 - `{"message": "Please enter your wustl email"}`
  - **Code:** 400 - `{"message": "CAPTCHA verification required"}`

### 2. Sign Up Verification

- **Method:** POST
- **Endpoint:** `/auth/verify`
- **Description:** Verifies the email with the provided code and completes registration.
- **Request Body:**
  ```json
  {
    "email": "user@wustl.edu",
    "verificationCode": "123456",
    "password": "SecurePass123"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "role": "user",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Responses:**
  - **Code:** 400 - `{"message": "Verification code expired"}`
  - **Code:** 400 - `{"message": "Incorrect verification code"}`
  - **Code:** 404 - `{"message": "User not found"}`

### 3. Resend Verification Code

- **Method:** POST
- **Endpoint:** `/auth/resend`
- **Description:** Resends the verification code to the user's email.
- **Request Body:**
  ```json
  {
    "email": "user@wustl.edu"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Verification code sent successfully"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "User not found"}`

### 4. Login

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Description:** Authenticates user and returns JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@wustl.edu",
    "password": "SecurePass123",
    "turnstileToken": "<TURNSTILE_TOKEN>"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "role": "user",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Responses:**
  - **Code:** 401 - `{"message": "Incorrect email or password"}`
  - **Code:** 401 - `{"message": "Please verify your email"}`
  - **Code:** 403 - `{"message": "You are banned from the bear bazaar"}`

### 5. Check Authentication Status

- **Method:** GET
- **Endpoint:** `/auth/status`
- **Description:** Verifies if the current token is valid.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "message": "User is logged in"
      }
    }
    ```
- **Error Response:**
  - **Code:** 401 - `{"message": "Please log in to access this page"}`

## Authentication Headers

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Error Codes

- **400** - Bad Request (validation errors, invalid data)
- **401** - Unauthorized (invalid credentials, expired token)
- **403** - Forbidden (banned user, insufficient permissions)
- **404** - Not Found (user doesn't exist)
