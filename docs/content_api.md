# Content & Settings API Documentation

## FAQ Endpoints

### Base URL

```
http://<host>[:<port>]/api/v1/faq
```

#### 1. Get All FAQs

- **Method:** GET
- **Endpoint:** `/`
- **Description:** Retrieve all frequently asked questions and answers.
- **Authentication:** None required (public endpoint)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "questions": [
        {
          "id": 1,
          "question": "How does the meal point exchange work?",
          "answer": "Students can buy and sell meal points through our secure matching system.",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "Could not load FAQ data"}`

#### 2. Add FAQ (Admin Only)

- **Method:** POST
- **Endpoint:** `/`
- **Description:** Add a new frequently asked question.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Request Body:**
  ```json
  {
    "question": "How long does matching take?",
    "answer": "Matching occurs weekly at the scheduled time."
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "FAQ added successfully",
      "data": {
        "faq": {
          "id": 2,
          "question": "How long does matching take?",
          "answer": "Matching occurs weekly at the scheduled time."
        }
      }
    }
    ```
- **Error Response:**
  - **Code:** 400 - `{"message": "This question already exists"}`

#### 3. Delete FAQ (Admin Only)

- **Method:** DELETE
- **Endpoint:** `/`
- **Description:** Delete a frequently asked question.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Request Body:**
  ```json
  {
    "question": "How long does matching take?"
  }
  ```
- **Success Response:**
  - **Code:** 204
  - **Content:**
    ```json
    {
      "status": "success"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "Could not find the question"}`

---

## Feedback Endpoints

### Base URL

```
http://<host>[:<port>]/api/v1/feedback
```

#### 1. Submit Feedback

- **Method:** POST
- **Endpoint:** `/`
- **Description:** Submit user feedback to administrators.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "subject": "Report a bug",
    "feedback": "The price slider is not working properly on mobile devices."
  }
  ```
- **Request Parameters:**
  - `subject`: Must be one of: `"Report a bug"`, `"Suggest Changes"`, `"Ask a question"`
  - `feedback`: User's detailed feedback message
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Feedback added successfully"
    }
    ```

#### 2. Get All Feedback (Admin Only)

- **Method:** GET
- **Endpoint:** `/`
- **Description:** Retrieve all user feedback submissions.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "feedbacks": [
        {
          "id": 1,
          "subject": "Report a bug",
          "feedback": "The price slider is not working properly.",
          "user_id": 5,
          "userEmail": "user@wustl.edu",
          "hidden": false,
          "createdAt": "2024-01-15T10:00:00.000Z"
        }
      ]
    }
    ```

#### 3. Delete Feedback (Admin Only)

- **Method:** DELETE
- **Endpoint:** `/:id`
- **Description:** Permanently delete a feedback submission.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **URL Parameters:**
  - `id`: Feedback ID to delete
- **Success Response:**
  - **Code:** 204
  - **Content:**
    ```json
    {
      "status": "success"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "Feedback not found"}`

#### 4. Archive Feedback (Admin Only)

- **Method:** PATCH
- **Endpoint:** `/:id/archive`
- **Description:** Hide feedback from the main list (soft delete).
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **URL Parameters:**
  - `id`: Feedback ID to archive
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "Feedback not found"}`

---

## Settings Endpoints

### Base URL

```
http://<host>[:<port>]/api/v1/settings
```

#### 1. Get Scheduled Match Time

- **Method:** GET
- **Endpoint:** `/schedule`
- **Description:** Retrieve the current scheduled time for weekly matching.
- **Authentication:** None required (public endpoint)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "matchTime": 61200
    }
    ```
- **Response Parameters:**
  - `matchTime`: Time in seconds from start of week (Sunday 00:00 UTC)
  - Example: `61200` = Monday 5:00 PM UTC

#### 2. Set Scheduled Match Time (Admin Only)

- **Method:** PATCH
- **Endpoint:** `/schedule`
- **Description:** Update the scheduled time for weekly matching.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Request Body:**
  ```json
  {
    "matchTime": 61200
  }
  ```
- **Request Parameters:**
  - `matchTime`: Time in seconds from start of week (0-604800)
  - Must be between 0 (Sunday 00:00 UTC) and 604800 (Sunday 00:00 UTC next week)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Scheduled match time updated successfully"
    }
    ```
- **Error Response:**
  - **Code:** 400 - `{"message": "Invalid time of the week"}`

### Time Calculation Helper

To convert day/time to `matchTime` seconds:

```javascript
// Example: Monday 5:00 PM UTC
const targetDate = new Date('2024-01-08T17:00:00Z'); // Monday 5 PM
const matchTime =
  targetDate.getUTCDay() * 86400 + // Day of week * seconds per day
  targetDate.getUTCHours() * 3600 + // Hours * seconds per hour
  targetDate.getUTCMinutes() * 60; // Minutes * seconds per minute
// Result: 61200
```

## Error Codes

- **400** - Bad Request (validation errors, invalid parameters)
- **401** - Unauthorized (invalid token)
- **403** - Forbidden (insufficient permissions for admin endpoints)
- **404** - Not Found (resource doesn't exist)

## Admin Role Requirements

The following endpoints require admin role:

- **FAQ**: POST `/`, DELETE `/`
- **Feedback**: GET `/`, DELETE `/:id`, PATCH `/:id/archive`
- **Settings**: PATCH `/schedule`

Regular authenticated users can:

- **FAQ**: GET `/` (public)
- **Feedback**: POST `/`
- **Settings**: GET `/schedule` (public)
