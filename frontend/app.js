// ==============================================================================
// Quick Notes Learning App - Frontend JavaScript (Fetch API)
// ==============================================================================
// This file runs in the user's browser.
// It connects seamlessly to the backend both locally and in production.
// ==============================================================================

// 1. Dynamic Backend Endpoint Resolution:
// - If window.__ENV__.API_BASE_URL is set (e.g. for decoupled deployments), use it.
// - If running on a web server (http:// or https://), use relative path '/api/notes'.
//   This ensures the app works automatically on localhost:5000 AND on any live deployed domain!
// - If opened directly as a file (file:///), fall back to 'http://localhost:5000/api/notes'.
const API_URL = (window.__ENV__ && window.__ENV__.API_BASE_URL)
  || (window.location.protocol.startsWith('http') ? '/api/notes' : 'http://localhost:5000/api/notes');

console.log(`[Frontend] Initialized API endpoint: ${API_URL}`);

// 2. DOM Elements Selection
const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesList = document.getElementById('notes-list');
const noteCount = document.getElementById('note-count');
const emptyState = document.getElementById('empty-state');
const statusMessage = document.getElementById('status-message');

/**
 * Helper: Display a user-friendly feedback message
 */
function showStatus(message, type = 'error') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove('hidden');

  if (type === 'success') {
    setTimeout(() => {
      statusMessage.classList.add('hidden');
    }, 3000);
  }
}

function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message hidden';
}

/**
 * ==============================================================================
 * FUNCTION 1: fetchNotes()
 * ==============================================================================
 * Retrieves all notes from the backend API.
 */
async function fetchNotes() {
  clearStatus();

  try {
    console.log(`[Frontend] Sending GET request to ${API_URL}...`);

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status} (${response.statusText})`);
    }

    const notes = await response.json();
    console.log('[Frontend] Successfully received notes from backend:', notes);
    renderNotes(notes);

  } catch (error) {
    console.error('[Frontend] Failed to fetch notes:', error);
    showStatus(
      '⚠️ Unable to connect to backend API. Ensure the server is running ("npm start").',
      'error'
    );
  }
}

/**
 * ==============================================================================
 * FUNCTION 2: addNote(text)
 * ==============================================================================
 * Sends a new note to the backend API via HTTP POST.
 */
async function addNote(text) {
  clearStatus();
  setLoading(true);

  try {
    console.log(`[Frontend] Sending POST request to ${API_URL} with:`, { text });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const updatedNotes = await response.json();
    console.log('[Frontend] Note added! Updated notes:', updatedNotes);

    renderNotes(updatedNotes);
    showStatus('Note added successfully!', 'success');

    noteInput.value = '';
    noteInput.focus();

  } catch (error) {
    console.error('[Frontend] Failed to add note:', error);
    showStatus(`⚠️ Error saving note: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
}

/**
 * Helper: Toggle loading spinner on submit button
 */
function setLoading(isLoading) {
  if (isLoading) {
    addBtn.disabled = true;
    addBtn.classList.add('loading');
  } else {
    addBtn.disabled = false;
    addBtn.classList.remove('loading');
  }
}

/**
 * ==============================================================================
 * FUNCTION 3: renderNotes(notes)
 * ==============================================================================
 * Renders notes into the DOM.
 */
function renderNotes(notes) {
  notesList.innerHTML = '';
  noteCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;

  if (!notes || notes.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  notes.forEach((note) => {
    const li = document.createElement('li');
    li.className = 'note-item';

    const idBadge = document.createElement('span');
    idBadge.className = 'note-id';
    idBadge.textContent = `#${note.id.toString().slice(-4)}`;
    idBadge.title = `Full ID: ${note.id}`;

    const textSpan = document.createElement('span');
    textSpan.className = 'note-text';
    textSpan.textContent = note.text;

    li.appendChild(idBadge);
    li.appendChild(textSpan);
    notesList.appendChild(li);
  });
}

// ==============================================================================
// EVENT LISTENERS
// ==============================================================================
noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (!text) {
    showStatus('Please enter some text before adding a note.', 'error');
    return;
  }
  addNote(text);
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('[Frontend] Page loaded. Connecting to backend...');
  fetchNotes();
});
