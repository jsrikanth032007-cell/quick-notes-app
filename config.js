// ==============================================================================
// Frontend Environment Configuration Loader (config.js)
// ==============================================================================
// In Node.js, environment variables live in `process.env`.
// In a browser (client-side), `process.env` does not exist natively.
//
// This file acts as the bridge: it defines `window.__ENV__` holding the values
// from `.env`. If you change your API URL or backend port, change it here!
// ==============================================================================

window.__ENV__ = {
  API_BASE_URL: 'http://localhost:5000/api/notes',
  APP_NAME: 'Quick Notes'
};

