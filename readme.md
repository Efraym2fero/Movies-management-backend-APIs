# 🎬 Movies Management Backend API

A RESTful backend API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL** for managing a movie catalog and personal watchlists, with JWT authentication, Zod validation, and per-route rate limiting.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [Rate Limiting](#rate-limiting)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [Movie Routes](#movie-routes)
  - [Watchlist Routes](#watchlist-routes)
- [Authentication](#authentication)
- [Validation](#validation)
- [Error Handling](#error-handling)

---

## 📖 Overview

This API allows users to browse a movie catalog, create accounts, and manage their personal watchlists. Users can add movies to their watchlist, track watch status (`PLANNED`, `WATCHING`, `COMPLETED`, `DROPED`), leave ratings and notes, and paginate through results.

The project uses **Prisma v7** with PostgreSQL for type-safe database access, **Zod v4** for runtime request validation, **express-rate-limit** for brute-force protection, and supports both JWT Bearer token and cookie-based authentication simultaneously.

---

## ✨ Features

- 🔐 User registration, login, and logout with JWT (Bearer token + `httpOnly` cookie)
- ✅ Full request validation on all routes using Zod v4 schemas
- 🛡️ Per-route rate limiting (auth, movies, watchlist each have separate limits)
- 🎥 Browse and filter movies with pagination, sorting, and search
- 📋 Full personal watchlist CRUD (add, update, delete, list)
- 🎯 Watchlist status tracking: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPED`
- ⭐ Movie ratings (1–10) and personal notes per watchlist entry
- 📄 Pagination with `nextURL` / `prevURL` absolute URL helpers
- 🔒 Password hashing with bcryptjs (salt rounds: 10)
- 🛡️ Protected watchlist routes via JWT auth middleware
- 🌱 Database seed script with 10 Quentin Tarantino films as sample data


---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js (ES Modules) | ≥ 20.19 |
| Framework | Express.js | v5.2.1 |
| ORM | Prisma | v7.5.0 |
| Database | PostgreSQL | any recent |
| Auth | jsonwebtoken + bcryptjs | 9.0.3 / 3.0.3 |
| Validation | Zod | v4.3.6 |
| Rate Limiting | express-rate-limit | v8.3.1 |
| Dev Server | Nodemon | v3.1.14 |
| Environment | dotenv | v17.3.1 |

---

## 📁 Project Structure

```
Movies-management-backend-APIs/
│
├── prisma/
│   ├── schema.prisma                     # DB models: User, Movie, Watchlist
│   ├── prisma.config.ts                  # Prisma config (schema path, migrations path, DB URL)
│   ├── movieSeed.js                      # Seed: 10 Tarantino films
│   └── migrations/
│       ├── 20260323153053_users/         # Migration 1: User table
│       │   └── migration.sql
│       └── 20260323161155_all_tables/    # Migration 2: Movie, Watchlist, enum, constraints
│           └── migration.sql
│
├── src/
│   ├── config/
│   │   └── db.js                         # Prisma client + connectDB / disconnectDB
│   │
│   ├── controllers/
│   │   ├── authController.js             # register, login, logout
│   │   ├── movieController.js            # getMovies (filter, sort, paginate)
│   │   └── watchlistController.js        # getWatchlist, addToWatchlist, updateWL, deleteWLItem
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verify (Bearer + cookie)
│   │   ├── rateLimiting.js               # authLimiter, movieLimiter, watchlistLimiter
│   │   └── validatorsMiddleware.js       # validateReq (body) + validateQueryReq (query)
│   │
│   ├── routes/
│   │   ├── authRoutes.js                 # POST /auth/register|login|logout
│   │   ├── movieRoutes.js                # GET /movies
│   │   └── watchlistRouter.js            # CRUD /watchlist
│   │
│   ├── utils/
│   │   ├── buildURL.js                   # Builds absolute pagination URLs
│   │   └── genToken.js                   # Signs JWT + sets httpOnly cookie
│   │
│   ├── validators/
│   │   ├── userValidators.js             # addUserSchema, loginSchema
│   │   ├── movieValidators.js            # getMoviesSchema
│   │   └── watchlistValidators.js        # addTOWLSchema, updateWLSchema
│   │
│   └── server.js                         # App entry: middleware, routes, server, shutdown
│
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

---

## 🗄️ Database Schema

### User

| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary key, auto-generated |
| `email` | String | Unique |
| `name` | String | Required |
| `password` | String | bcryptjs hashed, never returned in responses |
| `createdAt` | DateTime | Auto-set on creation |

### Movie

| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary key, auto-generated |
| `title` | String | Required |
| `overview` | String? | Optional description |
| `realeseYear` | Int | Required (note: intentional typo, frozen in migrations) |
| `genre` | String[] | Array of genre tag strings |
| `runtime` | Int? | Duration in minutes, optional |
| `posterURL` | String? | Image URL, optional |
| `createdBy` | String | FK → User.id, cascade delete |
| `createdAt` | DateTime | Auto-set on creation |

### Watchlist

| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary key, auto-generated |
| `userID` | String | FK → User.id, cascade delete |
| `movieID` | String | FK → Movie.id, cascade delete |
| `status` | WatchlistStatus | Default: `PLANNED` |
| `rating` | Int? | 1–10, optional |
| `notes` | String? | Personal notes, optional |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Manually set to `new Date()` on update |

**WatchlistStatus enum:** `PLANNED` | `WATCHING` | `COMPLETED` | `DROPED`

> **Unique constraint:** `@@unique([movieID, userID])` — a user can only add each movie once.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20.19 or higher** (Prisma v7 requirement)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

---

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/Efraym2fero/Movies-management-backend-APIs.git
cd Movies-management-backend-APIs
```

**2. Install dependencies:**

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXP_IN=2d
NODE_ENV=development
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Full PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key used to sign and verify JWTs |
| `JWT_EXP_IN` | ❌ | Token expiry duration, defaults to `2d` |
| `NODE_ENV` | ❌ | Set to `production` to enable `Secure` flag on cookies |

---

### Database Setup

**Run migrations** to create all tables, enums, and constraints:

```bash
npx prisma migrate 
```

**Generate the Prisma client** (required after any schema change):

```bash
npx prisma generate
```



### Running the Server

**Development mode** (auto-restart on file changes via Nodemon):

```bash
npm run dev
```

Server starts at: **`http://localhost:3000`**

**Health check:**
```
GET http://localhost:3000/
→ { "message": "hello world" }
```

---

## 🛡️ Rate Limiting

Rate limiting is applied per route group via `express-rate-limit`. All limits use standard `RateLimit-*` response headers.

| Route Group | Window | Max Requests | Middleware |
|---|---|---|---|
| `/auth/*` | 1 minute | 5 | `authLimiter` |
| `/movies/*` | 1 hour | 1000 | `movieLimiter` |
| `/watchlist/*` | 1 hour | 500 | `watchlistLimiter` |

When a limit is exceeded, the API returns:

```json
{
  "error": "Too many requests, please try again later."
}
```

---

## 📡 API Reference

### Auth Routes

Base path: `/auth`  
Rate limit: **5 requests / minute**

| Method | Endpoint | Description | Auth | Validated |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new user | ❌ | ✅ |
| POST | `/auth/login` | Login and receive JWT | ❌ | ✅ |
| POST | `/auth/logout` | Logout and clear cookie | ❌ | ❌ |

---

#### `POST /auth/register`

**Request Body:**

```json
{
  "name": "messi",
  "email": "messi@example.com",
  "password": "pass123"
}
```

**Validation rules:**

| Field | Rule |
|---|---|
| `name` | String, minimum 3 characters |
| `email` | Valid email format |
| `password` | String, 4–15 characters |

**Success Response — `201 Created`:**

```json
{
  "status": "created",
  "data": {
    "user": {
      "id": "5ea54d27-3905-416f-bef1-f04fc52c790c",
      "name": "messi",
      "email": "messi@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> The JWT is also set as an `httpOnly` cookie named `jwt`.

---

#### `POST /auth/login`

**Request Body:**

```json
{
  "email": "messi@example.com",
  "password": "pass123"
}
```

**Success Response — `200 OK`:**

```json
{
  "data": {
    "user": {
      "id": "5ea54d27-3905-416f-bef1-f04fc52c790c",
      "name": "messi",
      "email": "messi@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error — `400 Bad Request`** (wrong credentials):

```json
{ "message": "invalid email or password" }
```

---

#### `POST /auth/logout`

No body required. Clears the `jwt` cookie by setting it to an empty string with an expired date.

**Success Response — `200 OK`:**

```json
{
  "status": "success",
  "message": "logged out successfully"
}
```

---

### Movie Routes

Base path: `/movies`  
Rate limit: **1000 requests / hour**

| Method | Endpoint | Description | Auth | Validated |
|---|---|---|---|---|
| GET | `/movies` | List movies (filterable, sortable, paginated) | ❌ | ✅ |

---

#### `GET /movies`

**Query Parameters:**

| Parameter | Type | Default | Validation | Description |
|---|---|---|---|---|
| `page` | number | `1` | ≥ 1 | Page number |
| `limit` | number | `5` | ≥ 1 | Results per page |
| `genre` | string | — | min 4 chars | Filter by genre (e.g. `Action`) |
| `year` | number | — | ≥ 1900 | Filter by exact release year |
| `search` | string | — | any string | Case-insensitive title search |
| `sortBy` | string | `realeseYear` | enum | One of: `realeseYear`, `genre`, `title`, `runtime` |
| `order` | string | `desc` | enum | `asc` or `desc` |

**Example Request:**

```
GET /movies?page=1&limit=3&genre=Crime&sortBy=realeseYear&order=asc
```

**Success Response — `200 OK`:**

```json
{
  "data": {
    "movies": [
      {
        "id": "abc-uuid",
        "title": "Reservoir Dogs",
        "overview": "After a failed heist, criminals suspect one of them is a police informant.",
        "realeseYear": 1992,
        "genre": ["Crime", "Thriller"],
        "runtime": 99,
        "posterURL": "https://example.com/reservoirdogs.jpg",
        "createdBy": "user-uuid",
        "createdAt": "2026-03-23T16:11:55.000Z"
      }
    ]
  },
  "pagination": {
    "totalMovies": 10,
    "page": 1,
    "limit": 3,
    "totalPages": 4,
    "nextURL": "http://localhost:3000/movies?page=2&limit=3",
    "prevURL": null
  }
}
```

---

### Watchlist Routes

Base path: `/watchlist`  
Rate limit: **500 requests / hour**  

> **All watchlist routes require authentication** — include a Bearer token or the `jwt` cookie.

| Method | Endpoint | Description | Auth | Validated |
|---|---|---|---|---|
| GET | `/watchlist` | Get authenticated user's watchlist | ✅ | ✅ (query) |
| POST | `/watchlist` | Add a movie to the watchlist | ✅ | ✅ (body) |
| PUT | `/watchlist/:id` | Update a watchlist entry | ✅ | ✅ (body) |
| DELETE | `/watchlist/:id` | Remove a movie from the watchlist | ✅ | ❌ |

---

#### `GET /watchlist`

**Query Parameters:**

| Parameter | Type | Default | Validation | Description |
|---|---|---|---|---|
| `page` | number | `1` | ≥ 1 | Page number |
| `limit` | number | `5` | ≥ 1 | Results per page |
| `status` | string | — | enum | Filter by `PLANNED`, `WATCHING`, `COMPLETED`, or `DROPED` |
| `rating` | number | — | 1–10 | Filter by exact rating |
| `sortBy` | string | `rating` | enum | Sort by: `rating` or `status` |
| `order` | string | `desc` | enum | `asc` or `desc` |

**Success Response — `200 OK`:**

```json
{
  "data": {
    "watchlist": [
      {
        "id": "wl-uuid",
        "userID": "user-uuid",
        "movieID": "movie-uuid",
        "status": "WATCHING",
        "rating": 9,
        "notes": "Brilliant cinematography.",
        "createdAt": "2026-03-24T10:00:00.000Z",
        "updatedAt": "2026-03-25T08:30:00.000Z",
        "movie": {
          "id": "movie-uuid",
          "title": "Pulp Fiction",
          "realeseYear": 1994,
          "genre": ["Crime", "Drama"],
          "runtime": 154,
          "posterURL": "https://example.com/pulpfiction.jpg"
        }
      }
    ]
  },
  "pagination": {
    "totalwatchlists": 7,
    "totalPages": 2,
    "page": 1,
    "limit": 5,
    "nextPage": "http://localhost:3000/watchlist?page=2&limit=5",
    "prevPage": null
  }
}
```

> Note: The watchlist response includes the full `movie` object (via Prisma `include`).

---

#### `POST /watchlist`

Adds a movie to the authenticated user's watchlist.

**Request Body:**

```json
{
  "movieID": "valid-movie-uuid",
  "status": "PLANNED",
  "rating": 8,
  "notes": "Been meaning to watch this for ages."
}
```

**Validation Rules:**

| Field | Required | Rule |
|---|---|---|
| `movieID` | ✅ | Valid UUID — must match an existing movie |
| `status` | ❌ | One of: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPED` |
| `rating` | ❌ | Integer between 1 and 10 |
| `notes` | ❌ | Any string |

**Error — `400`** if movie is already in the watchlist:

```json
{ "error": "movie already in the watchlist" }
```

**Error — `404`** if movie ID does not exist:

```json
{ "error": "movie not found" }
```

**Success Response — `200 OK`:**

```json
{
  "status": "success",
  "data": {
    "watchlist": {
      "id": "wl-uuid",
      "userID": "user-uuid",
      "movieID": "movie-uuid",
      "status": "PLANNED",
      "rating": 8,
      "notes": "Been meaning to watch this for ages.",
      "createdAt": "2026-03-26T12:00:00.000Z",
      "updatedAt": "2026-03-26T12:00:00.000Z"
    }
  }
}
```

---

#### `PUT /watchlist/:id`

Updates an existing watchlist entry. All fields are optional — only provided fields are changed. `updatedAt` is automatically set to the current timestamp.

**Request Body:**

```json
{
  "status": "COMPLETED",
  "rating": 10,
  "notes": "A masterpiece."
}
```

**Success Response — `200 OK`:**

```json
{
  "data": {
    "updatedItem": {
      "id": "wl-uuid",
      "status": "COMPLETED",
      "rating": 10,
      "notes": "A masterpiece.",
      "updatedAt": "2026-03-26T13:00:00.000Z"
    }
  }
}
```

---

#### `DELETE /watchlist/:id`

Removes a movie from the authenticated user's watchlist.

> Only the owner of the entry can delete it. If another user attempts to delete it, a `403 Forbidden` is returned.

**Success Response — `200 OK`:**

```json
{ "status": "deleted successfully" }
```

**Error — `403 Forbidden`:**

```json
{ "error": "You are not allowed to delete" }
```

**Error — `404 Not Found`:**

```json
{ "error": "movie not found in the watchlist" }
```

---

## 🔐 Authentication

The API supports **two authentication methods simultaneously**:

**1. Authorization Header (Bearer token):**
```
Authorization: Bearer <your_jwt_token>
```

**2. HTTP Cookie (automatic):**
On login or register, the token is automatically stored in a cookie named `jwt` with these attributes:
- `httpOnly: true` — not accessible via JavaScript
- `Secure: true` — only sent over HTTPS (when `NODE_ENV=production`)
- `SameSite: strict` — prevents CSRF
- `maxAge` — 2 days

On logout, the cookie is cleared by setting it to an empty value with an expired date.

**Token expiry** is set by the `JWT_EXP_IN` environment variable (default: `2d`).

The `authMiddleware` first checks the `Authorization` header, then falls back to the cookie. If neither is present, or if the token is invalid or the user no longer exists in the database, a `401` is returned.

---

## ✅ Validation

All input is validated using **Zod v4** schemas before reaching the controller. Two reusable middleware functions handle this:

| Middleware | Validates | Applied to |
|---|---|---|
| `validateReq(schema)` | `req.body` | `POST /auth/register`, `POST /auth/login`, `POST /watchlist`, `PUT /watchlist/:id` |
| `validateQueryReq(schema)` | `req.query` | `GET /movies`, `GET /watchlist` |

**Validator Schemas:**

| File | Schemas |
|---|---|
| `userValidators.js` | `addUserSchema` (name, email, password), `loginSchema` (email, password) |
| `movieValidators.js` | `getMoviesSchema` (page, limit, genre, year, search, sortBy, order) |
| `watchlistValidators.js` | `addTOWLSchema` (movieID, status, rating, notes), `updateWLSchema` (status, rating, notes) |

**Validation Failure Response — `400 Bad Request`:**

```json
{
  "message": "email: The email not correct, password: You should enter password from 4 to 15 char"
}
```

Errors from all failing fields are joined into a single human-readable string.

---

## ⚠️ Error Handling

All endpoints return structured JSON error responses:

| Status Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Resource created |
| `400` | Bad request — validation failure, duplicate entry, wrong credentials |
| `401` | Unauthorized — missing, invalid, or expired JWT |
| `403` | Forbidden — authenticated but not the resource owner |
| `404` | Resource not found |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal server error |

**Process-level error handling** in `server.js`:

```
unhandledRejection  → server.close() → disconnectDB() → process.exit(1)
uncaughtException   → disconnectDB() → process.exit(1)
SIGTERM             → server.close() → disconnectDB() → process.exit(0)
```

The `server` variable is correctly assigned via `const server = app.listen(...)` so all three shutdown handlers can call `server.close()` safely.


> Built by [Efraym2fero](https://github.com/Efraym2fero)