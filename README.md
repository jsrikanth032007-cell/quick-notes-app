# 📝 Quick Notes - Full-Stack Learning Application with Environment Variables

A beginner-friendly full-stack application built to clearly demonstrate **how a frontend web page communicates with a backend REST API using HTTP requests, JSON, and environment configuration (`.env`)**.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | **Node.js** & **Express.js** | Listens on port `5000` (loaded via `.env`), manages an in-memory list of notes, and exposes REST endpoints (`GET` and `POST`). |
| **Backend Config** | **dotenv** | Loads environment variables from `backend/.env` into `process.env`. |
| **Middleware** | **cors** & **express.json()** | Handles Cross-Origin Resource Sharing (CORS) and parses incoming JSON request bodies into `req.body`. |
| **Frontend** | **HTML5**, **CSS3**, **Vanilla JS** | Modern UI with input and note display using the Fetch API (`async/await`). |
| **Frontend Config** | **config.js** & **frontend/.env** | Provides environment-driven API URLs (`API_BASE_URL`) with fallback support. |

---

## 📁 Project Directory Structure

```text
d:\IDE\
├── backend/
│   ├── .env            # Backend environment variables (PORT=5000)
│   ├── .env.example    # Template for backend settings
│   ├── package.json    # Backend dependencies (express, cors, dotenv)
│   └── server.js       # Express server listening on process.env.PORT
│
├── frontend/
│   ├── .env            # Frontend environment variables (API_BASE_URL)
│   ├── .env.example    # Template for frontend settings
│   ├── config.js       # Client-side configuration bridge (window.__ENV__)
│   ├── index.html      # User interface
│   ├── style.css       # Clean styling & responsive layout
│   └── app.js          # Fetch API calls reading from config.js / .env
│
├── .env                # Root environment configuration
├── .gitignore          # Ignores sensitive .env and node_modules from Git
├── package.json        # Root scripts to run the full application
└── README.md           # Documentation
```

---

## 🔐 Environment Variables Explained (.env)

### 1. Backend: Server-side with `dotenv`
On the backend (Node.js), environment variables are stored in [**`backend/.env`**](file:///d:/IDE/backend/.env):
```env
PORT=5000
NODE_ENV=development
```
At the top of [**`backend/server.js`**](file:///d:/IDE/backend/server.js), `require('dotenv').config()` loads these values into `process.env.PORT`.

### 2. Frontend: Client-side with `config.js`
In the browser, JavaScript runs in a secure sandbox without access to `process.env` or local files.
* [**`frontend/.env`**](file:///d:/IDE/frontend/.env) holds the configuration:
  ```env
  API_BASE_URL=http://localhost:5000/api/notes
  ```
* [**`frontend/config.js`**](file:///d:/IDE/frontend/config.js) acts as the bridge for vanilla HTML/JS by defining:
  ```javascript
  window.__ENV__ = {
    API_BASE_URL: 'http://localhost:5000/api/notes'
  };
  ```
* [**`frontend/app.js`**](file:///d:/IDE/frontend/app.js) reads `window.__ENV__.API_BASE_URL` with a reliable fallback!

---

## 🚀 How to Run the Application

### 1. Start the Backend Server
```powershell
npm start
```
*(Or navigate to `backend/` and run `npm start`)*

Console Output:
```text
====================================================
🚀 Quick Notes Backend running in [development] mode
📡 URL:                 http://localhost:5000
⚙️  Loaded from:        .env (PORT=5000)
📡 GET  API Endpoint:  http://localhost:5000/api/notes
📡 POST API Endpoint:  http://localhost:5000/api/notes
====================================================
```

### 2. Open the Frontend
* **Direct via Backend:** Navigate to **`http://localhost:5000`** in your browser.
* **Direct file or Live Server:** Open [**`frontend/index.html`**](file:///d:/IDE/frontend/index.html) directly or via Live Server.
