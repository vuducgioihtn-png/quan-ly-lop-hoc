import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
  INITIAL_MATERIALS,
  INITIAL_NOTIFICATIONS
} from './src/data/mockData';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function getInitialDbState() {
  return {
    users: INITIAL_USERS,
    classes: INITIAL_CLASSES,
    attendance: INITIAL_ATTENDANCE,
    homework: INITIAL_HOMEWORK,
    submissions: INITIAL_SUBMISSIONS,
    materials: INITIAL_MATERIALS,
    notifications: INITIAL_NOTIFICATIONS,
    lastUpdated: new Date().toISOString()
  };
}

let dbState: any = null;

function loadDb() {
  if (dbState) return dbState;

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(content);
      // Ensure all initial teachers are in dbState.users
      if (Array.isArray(dbState.users)) {
        const initialTeachers = INITIAL_USERS.filter((u) => u.role === 'teacher');
        for (const t of initialTeachers) {
          if (!dbState.users.some((u: any) => u.id === t.id || u.email === t.email)) {
            dbState.users.push(t);
          }
        }
      }
      return dbState;
    } catch (e) {
      console.error('Failed to parse db.json, falling back to initial data', e);
    }
  }

  dbState = getInitialDbState();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial db.json', e);
  }
  return dbState;
}

function persistDb(data: any) {
  const current = loadDb();
  dbState = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString()
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist db.json', e);
  }

  return dbState;
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/data', (_req, res) => {
  const state = loadDb();
  res.json(state);
});

app.post('/api/data', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const updated = persistDb(incoming);
  res.json({ success: true, lastUpdated: updated.lastUpdated, state: updated });
});

app.post('/api/data/reset', (_req, res) => {
  dbState = getInitialDbState();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to reset db.json', e);
  }
  res.json({ success: true, lastUpdated: dbState.lastUpdated, state: dbState });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
