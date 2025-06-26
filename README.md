# Task Manager API

A simple Node.js/Express REST API for user and task management, built with Prisma and PostgreSQL.

## Features

- User registration and authentication (JWT)
- User roles: Employer & Employee
- CRUD operations for tasks
- Secure password hashing
- PostgreSQL with Prisma ORM

---

## Getting Started

### 1. Clone the Project

```bash
git clone https://github.com/yourname/task-manager-api.git
cd task-manager-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskdb
JWT_SECRET=super-secret-jwt
PORT=3000
```
Adjust `DATABASE_URL` as per your PostgreSQL setup.

### 4. Database Setup

#### Create the Database (if needed)

```bash
createdb -U postgres taskdb
```

#### Run Prisma Migrations & Generate Client

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

#### Seed Example Data

```bash
npm run prisma:seed
```

---

### 5. Start the Server

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

---

## API Reference

### Authentication

#### 1. Register

`POST /api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "EMPLOYEE"  
}
```

#### 2. Login

`POST /api/auth/login`

**Body:**
```json
{
  "email": "employer@example.com",
  "password": "employer123"
}
```
**Returns:** `{ "token": "..." }` (Use this token in the Authorization header: `Bearer <token>`)

---

### User

#### 3. Get Profile

`GET /api/users/me`

Headers: `Authorization: Bearer <token>`

---

### Tasks

#### 4. Get All Tasks

`GET /api/tasks`

Headers: `Authorization: Bearer <token>`

#### 5. Create Task

`POST /api/tasks`

Headers: `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "New Task",
  "description": "My new task",
  "dueDate": "2024-07-31T23:59:59.000Z",
  "assigneeId": 2
}
```

#### 6. Update Task

`PUT /api/tasks/:id`

Headers: `Authorization: Bearer <token>`

**Body:** (fields to update)

#### 7. Delete Task

`DELETE /api/tasks/:id`

Headers: `Authorization: Bearer <token>`

---

## Testing with Postman

1. Use the Register or Login endpoint to obtain a JWT token.
2. Add the token as a Bearer token in `Authorization` header for protected routes.
3. Test creating, updating, deleting, and viewing tasks.

---

## Scripts

| Command                 | Description                                  |
|-------------------------|----------------------------------------------|
| `npm run dev`           | Start in dev mode with Nodemon               |
| `npm start`             | Start in production                          |
| `npm run prisma:migrate`| Run Prisma migrations                        |
| `npm run prisma:generate`| Generate Prisma client                      |
| `npm run prisma:seed`   | Seed example data to database                |
| `npm run prisma:studio` | Open Prisma Studio database GUI              |

---

## License

ISC

---

Let me know if you need expanded endpoint docs, example Postman collection exports, or more advanced README formatting!