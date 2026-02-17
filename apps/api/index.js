const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

// Simple CORS setup to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

let nextId = 1;
const homeworks = [];

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/homework', (req, res) => {
  const { search } = req.query;
  if (search) {
    const term = search.toLowerCase();
    const filtered = homeworks.filter(
      (hw) =>
        hw.title.toLowerCase().includes(term) ||
        hw.description.toLowerCase().includes(term),
    );
    return res.json(filtered);
  }
  res.json(homeworks);
});

app.get('/api/homework/:id', (req, res) => {
  const hw = homeworks.find((h) => h.id === Number(req.params.id));
  if (!hw) {
    return res.status(404).json({ error: 'Homework not found' });
  }
  res.json(hw);
});

app.post('/api/homework', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  const hw = { id: nextId++, title, description, completed: false, createdAt: new Date().toISOString() };
  homeworks.push(hw);
  res.status(201).json(hw);
});

app.put('/api/homework/:id', (req, res) => {
  const idx = homeworks.findIndex((h) => h.id === Number(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ error: 'Homework not found' });
  }
  const { title, description, completed } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  homeworks[idx] = {
    ...homeworks[idx],
    title,
    description,
    completed: typeof completed === 'boolean' ? completed : homeworks[idx].completed,
  };
  res.json(homeworks[idx]);
});

app.delete('/api/homework/:id', (req, res) => {
  const idx = homeworks.findIndex((h) => h.id === Number(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ error: 'Homework not found' });
  }
  const [removed] = homeworks.splice(idx, 1);
  res.json(removed);
});

// Export app and state for testing
module.exports = { app, homeworks, resetId() { nextId = 1; } };

// Only start the server when run directly (not when imported by tests)
if (require.main === module) {
  const server = http.createServer(app);
  const io = new Server(server, {
    path: '/socket.io'
  });

  io.on('connection', socket => {
    // placeholder for socket events
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}
