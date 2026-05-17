# Amend Landscaping Web Application

Code base for Amend Landscaping LLC web app.

## API Documentation

The backend is built with Express.js and uses Sequelize ORM to interact with a PostgreSQL database.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/appointments` | Retrieves a list of all appointments, sorted by newest first. |
| **GET** | `/appointments/:id` | Retrieves a single appointment by its ID. |
| **POST** | `/appointments` | Creates a new appointment request. |
| **PUT** | `/appointments/:id` | Updates an entire appointment record by its ID. |
| **PATCH** | `/appointments/:id/approve` | Marks an appointment as approved (`approved: true`). |
| **DELETE** | `/appointments/:id` | Deletes an appointment by its ID. |

#### Appointment Data Model
When creating (`POST`) or updating (`PUT`) an appointment, the JSON payload should match the following model:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phoneNumber": "555-0198",
  "address": "123 Elm Street",
  "city": "Springfield",
  "state": "IL",
  "zip": "62701",
  "servicesRequested": {
    "lawnMowing": true,
    "treeTrimming": false,
    "fertilization": true
  },
  "scheduledDate": "2026-06-15T14:30:00.000Z", // Optional
  "description": "Front and back yard need mowing.", // Optional
  "approved": false // Defaults to false
}