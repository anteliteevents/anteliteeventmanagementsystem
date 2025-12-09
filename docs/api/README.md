# API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.antelite.com/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Example Corp",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "exhibitor"
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Booths

#### Get Available Booths
```http
GET /api/booths/available?eventId=<uuid>&size=<size>&minPrice=<number>&maxPrice=<number>
Authorization: Bearer <token>
```

Query Parameters:
- `eventId` (required): Event UUID
- `size` (optional): Filter by size (small, medium, large, xlarge)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

#### Get Booth Details
```http
GET /api/booths/:id
Authorization: Bearer <token>
```

#### Reserve Booth
```http
POST /api/booths/reserve
Authorization: Bearer <token>
Content-Type: application/json

{
  "boothId": "uuid",
  "eventId": "uuid"
}
```

### Events

#### Get All Events
```http
GET /api/events?status=<status>
```

#### Get Event Details
```http
GET /api/events/:id
```

#### Create Event (Admin Only)
```http
POST /api/events
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Tech Expo 2024",
  "description": "Annual technology exhibition",
  "startDate": "2024-06-01T09:00:00Z",
  "endDate": "2024-06-03T18:00:00Z",
  "venue": "Convention Center"
}
```

### Transactions

#### Create Payment Intent
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "reservationId": "uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "clientSecret": "stripe_client_secret",
    "transactionId": "uuid"
  }
}
```

#### Get Transaction Status
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

## WebSocket Events

### Client Events

#### Join Event Room
```javascript
socket.emit('join:event', { eventId: 'uuid' });
```

#### Leave Event Room
```javascript
socket.emit('leave:event', { eventId: 'uuid' });
```

### Server Events

#### Booth Status Update
```javascript
socket.on('boothStatusUpdate', (data) => {
  // data: { boothId, status, eventId }
});
```

#### Reservation Update
```javascript
socket.on('reservationUpdate', (data) => {
  // data: { reservationId, status, boothId }
});
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

(To be implemented)
- 100 requests per minute per IP
- 10 requests per minute for authentication endpoints

