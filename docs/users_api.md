# User Profile & Admin API Documentation

## Base URL

```
http://<host>[:<port>]/api/v1/users
```

## Profile Management Endpoints

All profile endpoints require authentication and are under `/profile/*`.

### 1. Get Notification Settings

- **Method:** GET
- **Endpoint:** `/profile/notifications`
- **Description:** Retrieve user's notification preferences.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "sendMatchNotifications": true,
      "sendPriceNotifications": false
    }
    ```

### 2. Update Notification Settings

- **Method:** PATCH
- **Endpoint:** `/profile/notifications`
- **Description:** Update user's notification preferences.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "sendMatchNotifications": true,
    "sendPriceNotifications": false
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully updated notification settings"
    }
    ```

### 3. Change Password

- **Method:** PATCH
- **Endpoint:** `/profile/password`
- **Description:** Change user's password.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "oldPassword": "CurrentPass123",
    "newPassword": "NewSecurePass123"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully changed password"
    }
    ```
- **Error Response:**
  - **Code:** 401 - `{"message": "Incorrect password"}`

### 4. Get Phone Number

- **Method:** GET
- **Endpoint:** `/profile/phone`
- **Description:** Retrieve user's phone number and preference.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "phoneNum": "123-456-7890",
      "isPrefered": true
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "Phone number not found"}`

### 5. Add Phone Number

- **Method:** POST
- **Endpoint:** `/profile/phone`
- **Description:** Add a phone number to user's profile.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "phoneNum": "123-456-7890"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully added phone number"
    }
    ```
- **Error Response:**
  - **Code:** 400 - `{"message": "Invalid phone number"}`

### 6. Update Phone Preference

- **Method:** PATCH
- **Endpoint:** `/profile/phone`
- **Description:** Update whether phone number is preferred contact method.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "isPrefered": true
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully updated preference"
    }
    ```

### 7. Delete Phone Number

- **Method:** DELETE
- **Endpoint:** `/profile/phone`
- **Description:** Remove phone number from user's profile.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully deleted phone number"
    }
    ```

## Admin Endpoints

All admin endpoints require authentication and admin role.

### 1. Ban User

- **Method:** POST
- **Endpoint:** `/ban`
- **Description:** Ban a user from the platform.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Request Body:**
  ```json
  {
    "userEmail": "user@wustl.edu"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "User banned successfully"
    }
    ```
- **Error Responses:**
  - **Code:** 404 - `{"message": "User not found"}`
  - **Code:** 400 - `{"message": "This user is already banned"}`

### 2. Get Weekly User Statistics

- **Method:** GET
- **Endpoint:** `/stats/weekly`
- **Description:** Retrieve weekly user registration statistics.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "weeklyStats": [
          {
            "week": "2024-01-01T00:00:00.000Z",
            "numUsers": 15
          }
        ]
      }
    }
    ```

## Error Codes

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid token, wrong password)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (user or resource doesn't exist)
