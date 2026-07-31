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
- AI open source model: gpt-oss:120b-cloud (switchable)

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
- Ollama model: http://localhost:11434

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

### Ollama model

inside the docker chat-ollama container:

```bash
Ollama pull gpt-oss:120b-cloud
```

set API key on first run:

```bash
export OLLAMA_API_KEY=your_actual_api_key_here
```

The model runs on `http://localhost:11434`. (for testing)

## Environment Variables

The backend expects the following environment variables:

- `PORT` - backend port, usually `3000`
- `MONGOURL` - MongoDB connection string
- `SECRET` - JWT secret
- `APP_PASSWORD` - email/app password used by Nodemailer
- `AI_USER_PASSWORD` - password for AI user that is created automatically
# Chat App Project

This repository contains a full-stack chat application with a React frontend, an Express backend, Socket.IO for real-time messaging, and MongoDB for persistence.

## Project structure

The workspace is split into two main apps:

- front-end/ — React + Vite client
- backend/ — Express API, Socket.IO server, and MongoDB models
- docker-compose.yml — local container stack for frontend, backend, and MongoDB

## Tech stack

- Frontend: React, Vite, Redux Toolkit, React Router, Tailwind CSS, Socket.IO client
- Backend: Node.js, Express, Socket.IO, Mongoose, JWT, Multer, Nodemailer
- Database: MongoDB
- AI model (optional): gpt-oss:120b-cloud (switchable)

## Prerequisites

Install the tools you plan to use:

- Docker and Docker Compose, if using containers
- Node.js and npm/yarn, if running apps locally

## Run with Docker

Start all services from the project root:

```bash
docker compose up --build
```

Open the apps in your browser:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB (connection): mongodb://localhost:27017
- Ollama model (optional): http://localhost:11434

Stop the containers:

```bash
docker compose down
```

To also remove volumes (clears MongoDB data):

```bash
docker compose down -v
```

## Run locally (without Docker)

You can run frontend and backend separately.

Backend:

```bash
cd backend
npm install
npm run dev
```

The backend listens on the PORT environment variable (default: 3000).

Frontend:

```bash
cd front-end
npm install
npm run dev
```

## Ollama model (optional)

To pull the model inside an Ollama container:

```bash
ollama pull gpt-oss:120b-cloud
```

Set the API key (example):

```bash
export OLLAMA_API_KEY=your_actual_api_key_here
```

The model API (when running) is typically at http://localhost:11434.

## Environment variables

Backend environment variables:

- PORT — backend port (default: 3000)
- MONGOURL — MongoDB connection string
- SECRET — JWT secret
- APP_PASSWORD — email/app password used by Nodemailer
- AI_USER_PASSWORD — password for the AI user created automatically
- AI_API_URL — AI API URL (e.g. http://ollama:11434 for Docker)
- AI_API_KEY — Ollama API key

Frontend environment variables:

- VITE_API_URL — backend base URL used by the client

Example .env values used in Docker Compose:

```env
PORT=3000
MONGOURL=mongodb://mongodb:27017/mydb
SECRET=secret_key
APP_PASSWORD=jsjcoartudhvbtvc
VITE_API_URL=http://localhost:3000
AI_USER_PASSWORD=any-long-string
AI_API_URL=http://ollama:11434
AI_API_KEY=Ollama-api-key
```

For local development, update MONGOURL and AI_API_URL to match your local services.

## Main features

- User registration and login
- Authentication-protected chat routes
- Real-time messaging with Socket.IO
- User and message APIs
- File upload support for profile and shared files
- AI chat integration (optional)

## API routes

The backend exposes these route groups:

- /auth
- /user
- /message

## Useful commands

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

- The frontend Vite server is configured to listen on 0.0.0.0 inside Docker.
- The backend serves uploaded files from /uploads.
- Replace default secrets and production configuration before deploying.
