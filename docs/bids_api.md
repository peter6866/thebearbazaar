# Bids API Documentation

## Base URL

```
http://<host>[:<port>]/api/v1/bids
```

## Public Endpoints

### 1. Get Market Information

- **Method:** GET
- **Endpoint:** `/market`
- **Description:** Retrieve current market statistics and pricing information.
- **Authentication:** None required (public endpoint)
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "Success",
      "info": {
        "numBuyers": 15,
        "numSellers": 8,
        "buyPrice": 95,
        "sellPrice": 105
      }
    }
    ```

## Protected Endpoints (Authentication Required)

### 2. Get Current User's Bid

- **Method:** GET
- **Endpoint:** `/`
- **Description:** Retrieve the current user's active bid.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response (Has Bid):**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Here is your bid",
      "trans": "Buy",
      "price": 150,
      "hasBid": true
    }
    ```
- **Success Response (No Bid):**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "status": "success",
      "hasBid": false
    }
    ```
- **Error Response:**
  - **Code:** 404 - `{"message": "User not found"}`

### 3. Create New Bid (Unified Buy/Sell)

- **Method:** POST
- **Endpoint:** `/`
- **Description:** Create a new bid for buying or selling meal points.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "type": "buy",
    "price": 150
  }
  ```
- **Request Parameters:**
  - `type`: `"buy"` or `"sell"`
  - `price`: Integer between 1 and 500
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Successfully placed a buy bid",
      "data": {
        "type": "buy",
        "price": 150
      }
    }
    ```
- **Error Responses:**
  - **Code:** 400 - `{"message": "Bid type must be 'buy' or 'sell'"}`
  - **Code:** 400 - `{"message": "Price must be between 1 and 500"}`
  - **Code:** 400 - `{"message": "You have already placed a bid!"}`
  - **Code:** 404 - `{"message": "User not found"}`

### 4. Cancel Current Bid

- **Method:** DELETE
- **Endpoint:** `/`
- **Description:** Cancel the user's current active bid.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "Success",
      "message": "Successfully canceled bid"
    }
    ```
- **Error Responses:**
  - **Code:** 404 - `{"message": "User not found"}`
  - **Code:** 404 - `{"message": "No bid found"}`

## Admin Endpoints

All admin endpoints require authentication and admin role.

### 5. Trigger Manual Matching

- **Method:** POST
- **Endpoint:** `/match`
- **Description:** Manually trigger the bid matching process.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "Success",
      "message": "Successfully matched bids",
      "matches": [
        {
          "buyer_id": 1,
          "seller_id": 3,
          "price": 125,
          "isValid": true
        }
      ]
    }
    ```

### 6. Delete All Bids

- **Method:** DELETE
- **Endpoint:** `/all`
- **Description:** Delete all active bids (admin utility).
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Role:** Admin
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "status": "Success",
      "message": "Successfully deleted all bids"
    }
    ```

## Bid Lifecycle

1. **Create Bid**: User creates a buy or sell bid with desired price
2. **Price Notifications**: System may send emails if bid price is not competitive
3. **Matching**: Weekly automated matching process pairs buyers with sellers
4. **Match Notifications**: Users receive email with match details
5. **Transaction**: Users coordinate to complete the exchange
6. **Completion**: Bids are automatically removed after successful matching

## Market Pricing Logic

- **Buy Price**: Suggested minimum price for buyers to increase matching chances
- **Sell Price**: Suggested maximum price for sellers to increase matching chances
- **Matching**: Buyers are matched with sellers when buy price ≥ sell price
- **Priority**: Earlier bids get priority, then price preference

## Error Codes

- **400** - Bad Request (invalid parameters, validation errors)
- **401** - Unauthorized (invalid token)
- **403** - Forbidden (insufficient permissions for admin endpoints)
- **404** - Not Found (user or bid doesn't exist)
