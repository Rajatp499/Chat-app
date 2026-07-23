# Chat App Project

This repository contains a full-stack chat application with a React frontend, an Express backend, Socket.IO for real-time messaging, and MongoDB for persistence.

## Project Structure

The workspace is split into two main apps:

- `front-end/` - React + Vite client
- `backend/` - Express API, Socket.IO server, and MongoDB models
- `docker-compose.yml` - local container stack for frontend, backend, and MongoDB

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Tailwind CSS, Socket.IO client
- Backend: Node.js, Express, Socket.IO, Mongoose, JWT, Multer, Nodemailer
- Database: MongoDB

## Prerequisites

Before running the project locally, make sure you have:

- Docker and Docker Compose installed, if you want to use containers
- Node.js and npm installed, if you want to run the apps without Docker

## Run With Docker

The easiest way to start the full stack is through Docker Compose.

1. Open a terminal in the project root.
2. Start all services:

```bash
docker compose up --build
```

3. Open the apps in your browser:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

To stop the containers, run:

```bash
docker compose down
```

If you also want to remove the MongoDB volume and clear stored data, run:

```bash
docker compose down -v
```

## Run Locally Without Docker

You can also run the frontend and backend separately.

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on `PORT` from the environment file or defaults to `3000`.

### Frontend

```bash
cd front-end
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Environment Variables

The backend expects the following environment variables:

- `PORT` - backend port, usually `3000`
- `MONGOURL` - MongoDB connection string
- `SECRET` - JWT secret
- `APP_PASSWORD` - email/app password used by Nodemailer

The frontend expects:

- `VITE_API_URL` - backend base URL used by the client

Example values used in the Docker Compose setup:

```env
PORT=3000
MONGOURL=mongodb://mongodb:27017/mydb
SECRET=secret_key
APP_PASSWORD=jsjcoartudhvbtvc
VITE_API_URL=http://localhost:3000
```

For local development without Docker, you may need to update `MONGOURL` to point to a local MongoDB instance.

## Main Features

- User registration and login
- Authentication-protected chat routes
- Real-time messaging with Socket.IO
- User and message APIs
- File upload support for profile and shared files

## API Notes

The backend exposes these route groups:

- `/auth`
- `/user`
- `/message`

## Useful Commands

Frontend:

```bash
cd front-end
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd backend
npm run dev
```

## Notes

- The frontend Vite server is configured to listen on `0.0.0.0` inside Docker.
- The backend serves uploaded files from `/uploads`.
- The compose file currently uses local development values for secrets and database settings, so replace them before production use.