# IT Support Ticket System

A MERN web application based on the supplied IFN636 Task Manager project structure. It provides two clearly separated roles: **Employee** and **IT Support Agent**.

## Core workflow
Employee logs in → creates and validates a support ticket → ticket persists in MongoDB → Agent receives an in-app notification → Agent assigns, prioritises and progresses the ticket → Agent resolves it with resolution notes → Employee receives notifications and can view/close the resolved ticket.

## Technology stack
- React 18 + React Router + Axios
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- bcrypt password hashing
- Mocha + Chai tests
- AWS EC2 deployment compatible

## Project structure
```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  test/
frontend/
  public/
  src/
    components/
    context/
    pages/
```

## Local setup
1. Install Node.js and Git.
2. Run `npm run install-all` from the project root.
3. Copy `backend/.env.example` to `backend/.env` and set the real MongoDB URI and JWT secret.
4. Seed an IT Support Agent with `npm run seed:agent`.
5. Start development with `npm run dev`.
6. Open `http://localhost:3000`.

## Environment variables
`backend/.env`:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
AGENT_NAME=IT Support Agent
AGENT_EMAIL=agent@example.com
AGENT_PASSWORD=ChangeMe123!
```
Never commit the `.env` file.

## Main API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PUT /api/auth/profile`
- `POST /api/tickets`
- `GET /api/tickets/mine`
- `GET /api/tickets/agent/queue`
- `GET /api/tickets/:id`
- `PUT /api/tickets/:id`
- `PATCH /api/tickets/:id/assign`
- `PATCH /api/tickets/:id/priority`
- `PATCH /api/tickets/:id/status`
- `PATCH /api/tickets/:id/resolve`
- `PATCH /api/tickets/:id/close`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/dashboard/employee`
- `GET /api/dashboard/agent`

## Production build
Run:
```bash
npm run build
NODE_ENV=production npm start
```
The Express backend serves `frontend/build` when `NODE_ENV=production`.

## Security notes
- Public signup always creates an Employee; it never accepts an Agent role.
- Passwords are bcrypt hashed.
- Agent-only API routes are protected by role middleware.
- Employees may access only their own ticket details.
- `.env`, `.pem`, and `.ppk` are ignored by Git.

## Suggested Git/Jira workflow
Do not commit this whole completed reference as one feature if your assessment requires chronology. Implement/copy it incrementally on Jira-linked feature branches, for example:
`feature/ITS-XX-employee-registration` → PR → merge → next story.
