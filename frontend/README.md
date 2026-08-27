# IT Support Ticket System Frontend

React 18 frontend for the IT Support Ticket System. During local development it uses the `proxy` entry in `package.json` to send `/api` requests to `http://localhost:5001`. In production, Express serves the compiled `frontend/build` directory and API calls use the same origin.
