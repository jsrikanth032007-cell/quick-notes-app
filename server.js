// ==============================================================================
// Quick Notes Learning App - Backend Server (Express.js)
// ==============================================================================
// 1. Load environment variables from .env using 'dotenv'
// ==============================================================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 2. Initialize Express application
const app = express();

// 3. Port configuration from environment variables (PORT is set automatically by Render/Railway)
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==============================================================================
// MIDDLEWARE CONFIGURATION
// ==============================================================================
app.use(cors());
app.use(express.json());

// ==============================================================================
// CONNECT FRONTEND TO BACKEND (STATIC SERVING)
// ==============================================================================
// Serves frontend static files (HTML, CSS, JS) directly from Express
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(__dirname));

// Explicit fallback to serve the main user interface on '/'
app.get('/', (req, res) => {
  const frontendPath = path.join(__dirname, 'frontend', 'index.html');
  if (fs.existsSync(frontendPath)) {
    return res.sendFile(frontendPath);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==============================================================================
// IN-MEMORY DATA STORE
// ==============================================================================
let notes = [
  { id: 1, text: "Welcome to Quick Notes! This is your first note." },
  { id: 2, text: "Try typing a new note above and clicking 'Add Note'." }
];

// ==============================================================================
// API ROUTES
// ==============================================================================

/**
 * ROUTE 1: GET /api/notes
 */
app.get('/api/notes', (req, res) => {
  console.log(`[GET /api/notes] Client requested notes. Sending ${notes.length} note(s).`);
  res.status(200).json(notes);
});

/**
 * ROUTE 2: POST /api/notes
 */
app.post('/api/notes', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.warn('[POST /api/notes] Rejected: Note text was empty.');
    return res.status(400).json({ error: 'Note text cannot be empty.' });
  }

  const newNote = {
    id: Date.now(),
    text: text.trim()
  };

  notes.push(newNote);
  console.log(`[POST /api/notes] Added note ID ${newNote.id}: "${newNote.text}". Total notes: ${notes.length}`);

  res.status(201).json(notes);
});

// ==============================================================================
// START THE SERVER
// ==============================================================================
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Quick Notes Backend running in [${NODE_ENV}] mode`);
  console.log(`📡 URL:                 http://localhost:${PORT}`);
  console.log(`⚙️  Loaded from:        .env (PORT=${PORT})`);
  console.log(`📡 GET  API Endpoint:  http://localhost:${PORT}/api/notes`);
  console.log(`📡 POST API Endpoint:  http://localhost:${PORT}/api/notes`);
  console.log('====================================================');
});
