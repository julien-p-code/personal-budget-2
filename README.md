# Personal Budget API

A RESTful backend API built with **Node.js** and **Express** that implements a budget management system based on the envelope budgeting method.

This project was completed as part of the **Codecademy Back-End Engineer Career Path** and focuses on clean API design, proper error handling, and business logic separation.

---

## Features

- Initialize a total budget
- Create, read, update, and delete budget envelopes
- Transfer funds between envelopes
- Track available (unallocated) budget
- Centralized error handling with meaningful HTTP status codes

---

## Architecture

The project follows a clear separation of concerns:

- **Router**: HTTP validation, request parsing, response formatting
- **Controller**: business logic and domain rules
- **Error helper**: standardized HTTP errors
- **Global error handler**: single error response point

```
├── server.js
├── routes/
│   └── budget-router.js
├── controllers/
│   └── budget-controller.js
├── errors/
│   └── httpError.js
├── middleware/
│   └── error-handler.js
└── package.json
```

---

## API Endpoints

### Initialize total budget
**POST** `/init`

```json
{
  "totalBudget": 1000
}
```

---

### Create an envelope
**POST** `/envelopes`

```json
{
  "name": "Food",
  "allocatedAmount": 200
}
```

---

### Get all envelopes
**GET** `/envelopes`

---

### Get a single envelope
**GET** `/envelopes/:id`

---

### Update an envelope
**PUT** `/envelopes/:id`

```json
{
  "name": "Groceries",
  "allocatedAmount": 250
}
```

---

### Delete an envelope
**DELETE** `/envelopes/:id`

Returns `204 No Content`

---

### Transfer funds between envelopes
**POST** `/envelopes/transfer`

```json
{
  "fromEnvelopeId": 1,
  "toEnvelopeId": 2,
  "amount": 50
}
```

---

## Error Handling

- Uses a centralized global error handler
- Controllers throw typed HTTP errors (`httpError(status, message)`)
- Proper HTTP status codes are returned:
  - `400` Bad Request
  - `404` Not Found
  - `500` Internal Server Error

Example error response:
```json
{
  "success": false,
  "message": "Insufficient funds in the source envelope"
}
```

---

## Testing

All endpoints were tested manually using **Postman**.

---

## Installation & Usage

### Install dependencies
```bash
npm install
```

### Run the server
```bash
npm start
```

### Run in development mode (with auto-reload)
```bash
npm run dev
```

---

## What I Learned

- Designing a REST API with proper HTTP semantics
- Implementing business logic in controllers
- Centralized error handling in Express
- Managing state and invariants in a backend application
- Structuring a Node.js project cleanly and scalably

---

## Possible Extensions

- Persist data using PostgreSQL
- Batch operations (bulk envelope creation, batch transfers)
- Low-balance alerts
- Frontend interface (optional)

---

## Author

**Julien Perret**  
GitHub: `julien-p-code`

