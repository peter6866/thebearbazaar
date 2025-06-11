# Match & Transactions API Documentation

## Base URL

```
http://<host>[:<port>]/api/v1/match
```

## Public Endpoints

### 1. Get Price History

- **Method:** GET
- **Endpoint:** `/price-history`
- **Description:** Retrieve historical pricing data from past matches.
- **Authentication:** None required (public endpoint)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "matchHistory": [
        {
          "createdAt": "2024-01-15T10:00:00.000Z",
          "price": 125
        },
        {
          "createdAt": "2024-01-08T10:00:00.000Z",
          "price": 130
        }
      ]
    }
    ```

## Protected Endpoints (Authentication Required)

### 2. Get Current Match Information

- **Method:** GET
- **Endpoint:** `/current`
- **Description:** Retrieve current user's match details if they have been matched.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response (Matched):**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "matchDetails": {
          "matchedType": "Seller",
          "email": "seller@wustl.edu",
          "phoneNum": "123-456-7890",
          "price": 125
        }
      }
    }
    ```
- **Success Response (Not Matched):**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "User not found"}`

### 3. Cancel Transaction

- **Method:** DELETE
- **Endpoint:** `/current`
- **Description:** Cancel the current transaction/match.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "type": "Buyer"
  }
  ```
- **Request Parameters:**
  - `type`: `"Buyer"` or `"Seller"` (indicating the user's role in the transaction)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Transaction canceled"
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "No match found"}`

## Admin Endpoints

All admin endpoints require authentication and admin role.

### 4. Get All Matches

- **Method:** GET
- **Endpoint:** `/`
- **Description:** Retrieve all current matches (admin view).
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "matches": [
        {
          "id": 1,
          "buyer_id": 5,
          "seller_id": 8,
          "price": 125,
          "createdAt": "2024-01-15T10:00:00.000Z",
          "isValid": true,
          "buyerid": "buyer@wustl.edu",
          "sellerid": "seller@wustl.edu"
        }
      ]
    }
    ```

### 5. Delete All Matches

- **Method:** DELETE
- **Endpoint:** `/`
- **Description:** Invalidate all current matches (admin utility).
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 204
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "All match bids deleted"
    }
    ```

### 6. Get Transaction Cancellations

- **Method:** GET
- **Endpoint:** `/cancellations`
- **Description:** Retrieve history of canceled transactions.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "cancels": [
        {
          "email": "user@wustl.edu",
          "createdAt": "2024-01-15T14:30:00.000Z"
        }
      ]
    }
    ```

## Match Process Flow

### Automatic Weekly Matching

1. **Scheduled Trigger**: System runs matching algorithm at scheduled time
2. **Bid Collection**: Gathers all active buy and sell bids
3. **Price Sorting**: Sorts buyers by highest price, sellers by lowest price
4. **Matching Logic**: Pairs buyers with sellers where buy price ≥ sell price
5. **Notification**: Sends email notifications to matched users
6. **Cleanup**: Removes matched bids from active pool

### Manual Match Cancellation

1. **User Initiates**: User cancels their match via the API
2. **Match Invalidation**: System marks the match as invalid
3. **Re-matching Logic**:
   - If recent match: other user enters priority queue for re-matching
   - If old match: both users return to general pool
4. **Notifications**: Both users receive cancellation emails

### Contact Information Sharing

- **Email**: Always shared between matched users
- **Phone**: Shared only if user marked phone as "preferred"
- **Privacy**: No personal info shared until after successful match

## Transaction Guidelines

### For Users

1. **Contact**: Reach out to matched user via provided email/phone
2. **Meeting**: Coordinate to meet at WashU Dining Services Office
3. **Timing**: Office hours are M-F, 8:30 AM - 4:30 PM
4. **Payment**: Only exchange money at the Dining Services Office
5. **Safety**: Never pay before arriving at the official location

### Security Features

- **Verification**: Both users must be verified WashU students
- **Ban System**: Admins can ban problematic users
- **Audit Trail**: All matches and cancellations are logged
- **Time Limits**: Matches expire if not completed within reasonable time

## Error Codes

- **400** - Bad Request (invalid parameters)
- **401** - Unauthorized (invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (user or match doesn't exist)
