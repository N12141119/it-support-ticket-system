# IT Support Ticket System

A full-stack web application for managing internal IT support requests through a clear ticket lifecycle.

The system allows Employees to create and track support tickets while IT Support Agents can review, assign, update, resolve, and close support requests. It also includes persistent in-app notifications, role-based access control, dashboards, search and filtering, and deployment to AWS EC2.

## Project Overview

The IT Support Ticket System was developed for IFN636 Software Life Cycle Management.

The project replaces informal support requests sent through email, messages, or verbal communication with a structured web-based workflow.

### User Roles

**Employee**
- Register and log in
- View and update profile
- Create support tickets
- View own tickets
- Edit eligible open tickets
- View ticket progress
- Receive in-app notifications
- Close resolved tickets

**IT Support Agent**
- Log in using a preconfigured Agent account
- View the support ticket queue
- Search and filter tickets
- Assign tickets
- Update ticket priority
- Update ticket status
- Add resolution notes
- Resolve tickets
- View Agent dashboard and notifications

Public registration creates Employee accounts only. Agent accounts are created separately.

## Main Workflow

```text
Employee logs in
      |
Creates support ticket
      |
Frontend and backend validation
      |
Ticket stored in MongoDB
      |
Agent views ticket queue
      |
Agent assigns ticket
      |
Employee receives notification
      |
Agent changes status to In Progress
      |
Employee receives status notification
      |
Agent enters resolution notes
      |
Agent resolves ticket
      |
Employee receives resolution notification
      |
Employee opens resolved ticket
      |
Employee closes ticket
```

## Ticket Lifecycle

```text
Open ‚ Assigned ‚ In Progress ‚ Resolved ‚ Closed
```

### Ticket Categories

- Hardware
- Software
- Network
- Account / Access
- Email
- Other

### Ticket Priorities

- Low
- Medium
- High
- Critical

## Technology Stack

### Frontend
- React
- React Router
- Axios
- CSS
- Local Storage for authenticated user session

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token authentication
- bcrypt password hashing
- CORS
- dotenv

### Deployment
- AWS EC2
- Nginx
- MongoDB Atlas

## Project Structure

```text
it-support-ticket-system/
│
├── package.json
│
├── README.md
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Notification.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── notificationController.js
│   │   └── dashboardController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── scripts/
│   │   └── seedAgent.js
│   │
│   └── .env
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── axiosConfig.jsx
        │
        ├── context/
        │   └── AuthContext.js
        │
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── AppHeader.jsx
        │   ├── BottomNav.jsx
        │   ├── TicketCard.jsx
        │   ├── StatusBadge.jsx
        │   ├── PriorityBadge.jsx
        │   ├── NotificationBell.jsx
        │   ├── Alert.jsx
        │   ├── EmptyState.jsx
        │   └── Loading.jsx
        │
        └── pages/
            ├── Onboarding.jsx
            ├── Register.jsx
            ├── Login.jsx
            ├── EmployeeDashboard.jsx
            ├── CreateTicket.jsx
            ├── MyTickets.jsx
            ├── TicketDetails.jsx
            ├── EditTicket.jsx
            ├── Notifications.jsx
            ├── AgentDashboard.jsx
            ├── AgentQueue.jsx
            ├── Profile.jsx
            └── NotFound.jsx
```

## Prerequisites

Install:
- Node.js
- npm
- Git
- MongoDB Atlas account

Check:

```bash
node --version
npm --version
git --version
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/N12141119/it-support-ticket-system.git
cd it-support-ticket-system
```

### 2. Install dependencies

From the project root:

```bash
npm run install-all
```

If needed:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment variables

Create:

```text
backend/.env
```

Example:

```env
MONGO_URI=mongoDB url string
JWT_SECRET=secure_jwt_secret
PORT=5001

AGENT_NAME=IT Support Agent
AGENT_EMAIL=agent@example.com
AGENT_PASSWORD=ChangeMe123!
```

Do not commit the real `.env` file.

### 4. Create the Agent account

From the project root:

```bash
npm run seed:agent
```

If the root script is unavailable:

```bash
cd backend
npm run seed:agent
```

### 5. Start the application

From the project root:

```bash
npm run dev
```

Local services normally run on:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5001
```

### 6. Check backend health

```text
http://localhost:5001/api/health
```

## Authentication

The application uses JWT authentication.

After login, authenticated user information and the token are stored in browser local storage.

Protected frontend routes and backend middleware restrict access according to the logged-in user's role. The backend also checks ticket ownership so an Employee cannot access another Employee's ticket.

JWT sessions expire. When the backend returns a `401 Unauthorized` response for an expired session, the frontend clears the stored session and redirects the user to the login page.

## Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Employee Tickets

```text
POST  /api/tickets
GET   /api/tickets/mine
GET   /api/tickets/:id
PUT   /api/tickets/:id
PATCH /api/tickets/:id/close
```

### Agent Ticket Processing

```text
GET   /api/tickets/agent/queue
PATCH /api/tickets/:id/assign
PATCH /api/tickets/:id/priority
PATCH /api/tickets/:id/status
PATCH /api/tickets/:id/resolve
```

### Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
```

### Dashboards

```text
GET /api/dashboard/employee
GET /api/dashboard/agent
```

### Health Check

```text
GET /api/health
```

## Notifications

Notifications are stored in MongoDB and are specific to the recipient.

The application creates notifications for:
- New ticket submitted
- Ticket assigned
- Ticket status changed
- Ticket resolved

Notifications can be viewed in the notification centre and marked as read.

The current version uses persistent in-app notifications rather than actual email, SMS, push notifications.

## Validation

Validation is applied in both the frontend and backend.

### Registration
- Name is required
- Valid email is required
- Email must be unique
- Password must contain at least 8 characters
- Password and confirmation must match

### Ticket Creation
- Title is required
- Description is required
- Category must be supported
- Priority must be supported

### Resolution
- Only an IT Support Agent can resolve a ticket
- Resolution notes are required before a ticket can be resolved

## EC2 Deployment

The application is deployed manually to an AWS EC2 instance.

### Runtime Ports

```text
React frontend: 3000
Express backend: 5001
Public entry point: Nginx on port 80
```

### Nginx Routing

The deployment uses Nginx so the EC2 public IP does not need to be hard-coded inside the frontend.

Example:

```nginx
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Frontend API requests therefore use relative paths such as:

```javascript
axiosInstance.post('/api/auth/login', data);
```

and do not hard-code the EC2 public IP.

### Verify Deployment

On EC2:

```bash
curl http://localhost:5001/api/health
```

Then through Nginx:

```bash
curl http://localhost/api/health
```

Finally test in a browser:

```text
http://<CURRENT_EC2_PUBLIC_IP>
```

## Security Practices

The project uses:
- bcrypt password hashing
- JWT authentication
- Backend role checks
- Ticket ownership checks
- Environment variables for database and JWT secrets
- `.env` exclusion from Git
- Private key exclusion from Git
- Nginx routing instead of a hard-coded EC2 API address

The repository should not contain:

```text
.env
node_modules/
*.pem
*.ppk
```

## Git Workflow

Development was organised using feature branches and pull requests.

Main feature branches:

```text
feature/authentication-and-roles
feature/ticket-management
feature/agent-workflow-notifications
```

The submitted release should be tagged:

```text
v1.0.0
```

## Testing the Complete Workflow

1. Register a new Employee account
2. Log in as the Employee
3. Create a support ticket
4. Confirm the ticket appears in My Tickets
5. Log out
6. Log in as the seeded IT Support Agent
7. Open the Agent Ticket Queue
8. Assign the ticket
9. Change the ticket status to In Progress
10. Add resolution notes
11. Resolve the ticket
12. Log back in as the Employee
13. Check the notification centre
14. Open the resolved ticket
15. Close the ticket

## Known Limitations

The current version intentionally does not include:
- Email notifications
- SMS notifications
- Push notifications
- Real-time WebSocket notifications
- File attachments
- Live chat
- AI chatbot
- Knowledge base
- Asset management
- SLA automation or escalation
- Single sign-on
- Multi-factor authentication
- Native mobile application
- Third-party integrations
- Required CI/CD pipeline

The project is limited to two operational roles:

```text
Employee
IT Support Agent
```

## Project Artefacts


```text
Jira:       https://connect-team-w1kcibn8.atlassian.net/jira/software/projects/ITS/summary
Figma:      https://www.figma.com/design/UAQtCRPTQb6iOa8JHRbSUY/IT-Support-Ticket-System---High-Fidelity-Prototype?node-id=7-6&p=f&t=biBdcgAZJchFuidB-0
Draw.io:    https://drive.google.com/file/d/1iTIPYiv_VWBrwbDBZX3jdxDNqOgJfksO/view?usp=sharing
GitHub:     https://github.com/N12141119/it-support-ticket-system.git
EC2 URL:    http://13.55.117.49:3000/
```

## Context

This project was created for:

**IFN636 Software Life Cycle Management**

The submitted system demonstrates requirements analysis, project planning, SysML design, UI/UX prototyping, Git version control practice, full-stack implementation, and manual AWS EC2 deployment.

## Author

```text
Name:       Abhay Tyagi
Student ID: 12141119
```

