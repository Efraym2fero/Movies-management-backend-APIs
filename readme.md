# 🎬 Movies Management Backend API

A RESTful backend API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL** for managing movies and personal watchlists with JWT-based authentication.

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
  - [Seeding the Database](#seeding-the-database)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [Movie Routes](#movie-routes)
  - [Watchlist Routes](#watchlist-routes)
- [Authentication](#authentication)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

This API allows users to browse a movie catalog, register accounts, and manage personal watchlists. Each user can add movies to their watchlist, track their watch status, leave ratings and notes, and paginate through results. The project uses Prisma ORM with PostgreSQL for type-safe database access and supports both JWT cookie and Bearer token authentication.

---

## Features

-  User registration, login, and logout with JWT (cookie + Bearer token support)
-  Browse and filter movies with pagination
-  Personal watchlist management (add, update, delete, list)
-  Watchlist status tracking: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPPED`
-  Movie rating (1–10) and personal notes per watchlist entry
-  Movie filtering by genre, release year, and search term
-  Pagination with `nextURL` / `prevURL` helpers
-  Request validation using Zod schemas
- 🔒 Password hashing with bcryptjs
-  Protected routes via JWT auth middleware
-  Database seed script for sample movie data

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| ORM | Prisma v7 |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod v4 |
| Dev Tools | Nodemon |
| Environment | dotenv |

---

## 📁 Project Structure

```
Movies-management-backend-APIs/
│
├── prisma/
│   ├── schema.prisma             # Database models (User, Movie, Watchlist)
│   ├── prisma.config.ts          # Prisma configuration
│   ├── movieSeed.js              # Seed script with 10 sample movies
│   └── migrations/               # SQL migration history
│       ├── 20260323153053_users/
│       └── 20260323161155_all_tables/
│
├── src/
│   ├── config/
│   │   └── db.js                 # Prisma client setup & connect/disconnect helpers
│   │
│   ├── controllers/
│   │   ├── authController.js     # register, login, logout
│   │   ├── movieController.js    # getMovies (with filtering & pagination)
│   │   └── watchlistController.js # CRUD for watchlist items
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (cookie + Bearer)
│   │   └── validatorsMiddleware.js # Zod body & query validators
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # /auth/*
│   │   ├── movieRoutes.js        # /movies/*
│   │   └── watchlistRouter.js    # /watchlist/* (all protected)
│   │
│   ├── utils/
│   │   ├── buildURL.js           # Pagination URL builder
│   │   └── genToken.js           # JWT sign + set cookie
│   │
│   ├── validators/
│   │   └── watchlistValidators.js # Zod schemas for watchlist add/update
│   │
│   └── server.js                 # App entry point
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key, auto-generated |
| email | String | Unique |
| name | String | Required |
| password | String | Hashed with bcryptjs |
| createdAt | DateTime | Auto-set on creation |

### Movie
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key, auto-generated |
| title | String | Required |
| overview | String? | Optional description |
| realeseYear | Int | Required |
| genre | String[] | Array of genre tags |
| runtime | Int? | Duration in minutes |
| posterURL | String? | Optional image URL |
| createdBy | String | FK → User.id (cascades on delete) |
| createdAt | DateTime | Auto-set on creation |

### Watchlist
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key, auto-generated |
| userID | String | FK → User.id (cascade delete) |
| movieID | String | FK → Movie.id (cascade delete) |
| status | WatchlistStatus | Default: `PLANNED` |
| rating | Int? | 1–10, optional |
| notes | String? | Personal notes, optional |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Updated on change |

**WatchlistStatus enum:** `PLANNED` | `WATCHING` | `COMPLETED` | `DROPED`

> **Unique constraint:** `(movieID, userID)` — each user can only add a movie once.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.19 or higher (required by Prisma v7)
- [PostgreSQL](https://www.postgresql.org/) 
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

---

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Efraym2fero/Movies-management-backend-APIs.git
cd Movies-management-backend-APIs
```

2. **Install dependencies:**

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_super_secret_jwt_key
JWT_EXP_IN=2d
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWTs |
| `JWT_EXP_IN` | Token expiry duration (default: `2d`) |
| `NODE_ENV` | Set to `production` to enable `Secure` flag on cookies |

---

### Database Setup

Apply the Prisma migrations to create the tables:

```bash
npx prisma migrate 
```

To generate the Prisma client after schema changes:

```bash
npx prisma generate
```

---

### Seeding the Database

The project includes a seed script that inserts 10 Christopher Nolan films as sample data.

> **Note:** Before seeding, update the `creatorID` constant in `prisma/movieSeed.js` to a valid existing user's UUID in your database.

```bash
npm run seed:movie
```

---

### Running the Server

**Development mode** (with auto-restart via Nodemon):

```bash
npm run dev
```

The server starts at: `http://localhost:3000`

Health check:
```
GET http://localhost:3000/
→ { "message": "hello world" }
```

---

## 📡 API Reference

### Auth Routes

Base path: `/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | ❌ |
| POST | `/auth/login` | Login and receive JWT | ❌ |
| POST | `/auth/logout` | Logout (clears JWT cookie) | ❌ |

**Register — Request Body:**
```json
{
  "name": "messi",
  "email": "messi@example.com",
  "password": "Password123"
}
```

**Register / Login — Success Response:**
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

> The JWT is also set automatically as an `httpOnly` cookie named `jwt`. You can use either the cookie or the Bearer token for protected routes.

**Logout — Response:**
```json
{
  "status": "success",
  "message": "logged out successfully"
}
```

---

### Movie Routes

Base path: `/movies`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/movies` | Get all movies (paginated, filterable) | ❌ |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `5` | Results per page |
| `genre` | string | — | Filter by a single genre (e.g. `Action`) |
| `year` | number | — | Filter by exact release year |
| `search` | string | — | Case-insensitive title search |
| `sortBy` | string | `realeseYear` | Sort field: `realeseYear`, `title`, `runtime`, or `genre` |
| `order` | string | `desc` | Sort direction: `asc` or `desc` |

**Example:**
```
GET /movies?page=1&limit=5&genre=Action&sortBy=realeseYear&order=desc
```

**Response:**
```json
{
  "data": {
    "movies": [
      {
        "id": "uuid",
        "title": "Inception",
        "overview": "A skilled thief leads a team into people's dreams...",
        "realeseYear": 2010,
        "genre": ["Sci-Fi", "Action", "Thriller"],
        "runtime": 148,
        "posterURL": null,
        "createdBy": "user-uuid",
        "createdAt": "2026-03-23T16:11:55.000Z"
      }
    ]
  },
  "pagination": {
    "totalMovies": 10,
    "page": 1,
    "limit": 5,
    "totalPages": 2,
    "nextURL": "http://localhost:3000/movies?page=2&limit=5",
    "prevURL": null
  }
}
```

---

### Watchlist Routes

Base path: `/watchlist`

> **All watchlist routes require authentication** via Bearer token or `jwt` cookie.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/watchlist` | Get the authenticated user's watchlist |
| POST | `/watchlist` | Add a movie to the watchlist |
| PUT | `/watchlist/:id` | Update a watchlist entry |
| DELETE | `/watchlist/:id` | Remove a movie from the watchlist |

**Query Parameters for `GET /watchlist`:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `5` | Results per page |
| `status` | string | — | Filter: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPED` |
| `rating` | number | — | Filter by exact rating (1–10) |
| `sortBy` | string | `rating` | Sort by: `rating` or `status` |
| `order` | string | `desc` | `asc` or `desc` |

**Add to Watchlist — Request Body:**
```json
{
  "movieID": "valid-movie-uuid",
  "status": "PLANNED",
  "rating": 8,
  "notes": "Looking forward to this one!"
}
```

| Field | Required | Validation |
|---|---|---|
| `movieID` | ✅ | Must be a valid UUID of an existing movie |
| `status` | ❌ | One of: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPED` |
| `rating` | ❌ | Integer between 1 and 10 |
| `notes` | ❌ | Any string |

**Update Watchlist Item — Request Body:**
```json
{
  "status": "COMPLETED",
  "rating": 9,
  "notes": "One of the best films I've ever seen."
}
```

All fields are optional — only provided fields are updated. `updatedAt` is set automatically.

**Delete Response:**
```json
{
  "status": "deleted successfully"
}
```

> Only the owner of a watchlist entry can delete it. Attempts by other users return `403 Forbidden`.

---

## 🔐 Authentication

Two methods are supported simultaneously:

**1. Authorization Header:**
```
Authorization: Bearer <your_jwt_token>
```

**2. HTTP Cookie:**
The token is automatically stored in an `httpOnly` cookie named `jwt` on login/register and cleared on logout. This works natively in browsers.

Token expiry is controlled by the `JWT_EXP_IN` environment variable (default: `2d`). In production, cookies are marked `Secure` and `SameSite: Strict`.

---

## ✅ Validation

All request bodies and query strings are validated using **Zod v4** schemas, applied through two reusable middlewares:

- `validateReq(schema)` — validates `req.body`
- `validateQueryReq(schema)` — validates `req.query`

On validation failure:
```json
{
  "message": "movieID: Invalid uuid, rating: Enter num between 1 to 10"
}
```

---

## ⚠️ Error Handling

All endpoints return structured JSON errors:

| Status Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / duplicate entry / validation error |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — resource belongs to another user |
| 404 | Resource not found |
| 500 | Internal server error |

The server handles process-level errors gracefully:

```
unhandledRejection  → closes server, disconnects DB, exits
uncaughtException   → disconnects DB, exits
SIGTERM             → graceful shutdown
```

---



> Built by [Efraym2fero](https://github.com/Efraym2fero)