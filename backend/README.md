# Medora Backend — Phase 0

Lightweight Express.js foundation for **Medora — AI Powered Healthcare & Recovery Platform**.

This phase contains only the backend skeleton: server bootstrap, middleware, env config, and folder structure ready for future modules.

---

## Stack

- Node.js + Express.js
- ES Modules (`"type": "module"`)
- dotenv, cors
- nodemon (dev)

No database. Local JSON storage and `uploads/` folder will be used later.

---

## Structure

```
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── data/         # local JSON storage (later)
│   ├── uploads/      # local file uploads (later)
│   ├── config/
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## Installation

```bash
cd backend
npm install
```

## Run

Development (auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on: **http://localhost:5000**

---

## Environment Variables (`.env`)

```
PORT=5000
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Test Routes

| Method | Route     | Response                  |
| ------ | --------- | ------------------------- |
| GET    | `/`       | `Medora Backend Running`  |
| GET    | `/health` | `{ "status": "ok" }`      |

---

## Next

Phase 1 will introduce routes, controllers, services, JSON storage utilities, and feature modules.
