# Amend Landscaping Web Application

Code base for Amend Landscaping LLC web app.

## Frontend Documentation

The frontend is a Single Page Application (SPA) built with **React**, **Vite**, and styled with **Tailwind CSS**.

### Key Features & Structure
- **Landing Page** (`/frontend/src/pages/landing`): Public-facing marketing site.
- **Booking Flow** (`/frontend/src/pages/booking`): User-facing interface to submit service requests. 
- **Admin Modals**: Custom UIs triggered to manage appointments (approving, denying, and cancelling requests), complete with custom messaging boxes that hook into the API's email services.

---

## API Documentation

The backend is built with **Express.js**, uses **Sequelize ORM** to interact with a **PostgreSQL** database, and utilizes **Nodemailer** for automated transactional emails based on appointment state.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/appointments` | Retrieves a list of all appointments. |
| **GET** | `/appointments/:id` | Retrieves a single appointment by its ID. |
| **POST** | `/appointments` | Creates a new appointment request. (Triggers Admin & User Confirm emails) |
| **PUT** | `/appointments/:id` | Updates an entire appointment record by its ID. |
| **PATCH** | `/appointments/:id/approve` | Marks an appointment as approved and sends an approval email to the customer. |
| **PATCH** | `/appointments/:id/deny` | Denies an appointment request, removes it from the database, and sends a denial email. |
| **PATCH** | `/appointments/:id/cancel` | Cancels an existing appointment, removes it from the database, and sends a cancellation email. |

*(Note: The `approve`, `deny`, and `cancel` endpoints all accept an optional `{ "message": "Your custom text here" }` in the JSON body to dynamically insert custom notes into the HTML emails.)*

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