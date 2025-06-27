# Task Manager API

A simple Node.js/Express REST API for user and task management, built with Prisma, EJS, and PostgreSQL.

## Features

- User registration and authentication (JWT)
- User roles: Employer & Employee
- Employers: Create, assign, and manage tasks
- Employees: View and update only their assigned tasks
- Filtering and sorting of tasks (API & UI)
- Web UI (EJS) for Employers to view/filter/sort tasks
- PostgreSQL with Prisma ORM
- Secure password hashing

---

## Getting Started

### 1. Clone the Project

```bash
git clone https://github.com/tuantran1295/task-manager-api.git
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

### Tasks

#### 3. Get All Tasks (Employers Only, with Filtering and Sorting)

`GET /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Optional Query Parameters:**

| Parameter   | Description                                               | Example      |
|-------------|-----------------------------------------------------------|--------------|
| `assigneeId`| Filter by employee assigned to task                       | 2            |
| `status`    | Filter by task status (PENDING, IN_PROGRESS, COMPLETED)   | COMPLETED    |
| `sortBy`    | Sort by `createdAt`, `dueDate`, or `status`               | dueDate      |
| `order`     | Sort order (`asc` or `desc`)                              | asc          |

**Example:**  
`/api/tasks?assigneeId=2&status=COMPLETED&sortBy=dueDate&order=asc`

#### 4. Create Task (Employers Only)

`POST /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "New Task",
  "description": "My new task",
  "dueDate": "2024-07-31T23:59:59.000Z",
  "assigneeId": 2
}
```

#### 5. Get Your Tasks (Employees Only)

`GET /api/tasks/my`

**Headers:** `Authorization: Bearer <token>`

#### 6. Update Task Status (Employees Only)

`PATCH /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```
Status can be `"IN_PROGRESS"` or `"COMPLETED"`

#### 7. Get Employee Summary (Employers Only)

`GET /api/employees/summary`

**Headers:** `Authorization: Bearer <token>`

**Returns:**
```json
[
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "totalTasks": 3,
    "completedTasks": 2
  }
]
```

---

Sure! Here is an updated **Web UI** section for your README.md that explains how the EJS-based Web UI interacts with your backend API, how to use it, and the supported role-based flows:

---

## Web UI

This project includes a simple EJS-powered Web frontend that communicates with the backend REST API through AJAX (using fetch). All authentication happens via JWT tokens stored in the browser's localStorage after login.

### Usage

1. **Start the server:**

   ```
   npm start
   ```

2. **Access the app in your browser:**

   ```
   http://localhost:3000
   ```

3. **Pages**

    - **Login:** `/login`
    - **Register:** `/register`
    - **Employee Dashboard:** `/employee-tasks`
    - **Employer Task Dashboard:** `/tasks`
    - **Create Task (Employer only):** `/tasks-create`
    - **Employee Summary (Employer only):** `/employee-summary`

### How it works

- **Authentication:**  
  Users log in or register; the JWT token received is stored in `localStorage`. All subsequent API calls from the Web UI use this token in the `Authorization` header.

- **Role-based Redirection:**  
  After login, the frontend fetches the current user info and redirects:
    - *Employee* → `/employee-tasks`
    - *Employer* → `/tasks`

- **Employee**
    - Sees a table of assigned tasks.
    - Can update the status of each task (In Progress or Completed) directly from the table.

- **Employer**
    - Can view a table of all tasks with filtering (by assignee, status) and sorting.
    - Can create and assign new tasks to employees.
    - Can view a summary of each employee, including total and completed tasks.

- **Logout:**  
  Use the "Logout" link in the navigation bar, which clears localStorage and redirects to `/login`.

### Technical Notes

- The frontend has **no session**: all security is via JWTs (matching the API).
- All web pages render in EJS (located in `src/views/`), but all business logic is performed via fetch/AJAX to `/api/*` endpoints.
- If the JWT is invalid or missing, users are automatically redirected to `/login`.

---

## Testing with Postman

1. Use the Register or Login endpoint to obtain a JWT token.
2. Add the token as a Bearer token in `Authorization` header for protected routes.
3. Test creating, updating, deleting, and viewing tasks.
4. Use `/api/tasks?status=IN_PROGRESS&sortBy=dueDate&order=asc` to test filtering/sorting.

**Example cURL:**
```sh
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/tasks?status=COMPLETED&sortBy=dueDate&order=asc"
```

---

## Scripts

| Command                   | Description                                  |
|---------------------------|----------------------------------------------|
| `npm run dev`             | Start in dev mode with Nodemon               |
| `npm start`               | Start in production                          |
| `npm run prisma:migrate`  | Run Prisma migrations                        |
| `npm run prisma:generate` | Generate Prisma client                       |
| `npm run prisma:seed`     | Seed example data to database                |
| `npm run prisma:studio`   | Open Prisma Studio database GUI              |

---
