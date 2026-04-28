# Mini CRM

MERN interview assignment implementation with authentication, dashboard aggregations, leads, companies, and tasks.

## Tech Stack

- Frontend: React, React Router, Axios, MUI
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT access token, bcrypt password hashing

## Setup

```bash
npm run install:all
cp server/.env.example server/.env
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

## Demo User

After starting the backend with MongoDB configured, seed a demo admin:

```bash
npm run seed --prefix server
```

Login:

- Email: `admin@example.com`
- Password: `password123`

## Authorization Logic

- All CRM APIs require a valid JWT access token in `Authorization: Bearer <token>`.
- `protect` middleware verifies the token and attaches the active user to `req.user`.
- Leads are soft deleted with `isDeleted: true`; normal list/detail queries filter them out.
- Task status updates are restricted to the assigned user. Admin users can update any task for operational oversight.

## Deployment Notes

- Deploy `client` to Netlify/Vercel with `VITE_API_URL` pointing to the backend URL.
- Deploy `server` to Render/Railway/Fly with `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` configured.
