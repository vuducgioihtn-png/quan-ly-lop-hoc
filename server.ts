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

const ROOT_DB_FILE = path.join(process.cwd(), 'database.json');
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_DB_FILE = path.join(DATA_DIR, 'db.json');

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

  // Try loading from database.json at root first (primary for GitHub sync)
  const candidateFiles = [ROOT_DB_FILE, DATA_DB_FILE];
  for (const file of candidateFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.users)) {
          dbState = parsed;
          // Ensure all initial teachers are in dbState.users
          const initialTeachers = INITIAL_USERS.filter((u) => u.role === 'teacher');
          for (const t of initialTeachers) {
            if (!dbState.users.some((u: any) => u.id === t.id || u.email === t.email)) {
              dbState.users.push(t);
            }
          }
          break;
        }
      } catch (e) {
        console.error(`Failed to parse ${file}, trying next candidate...`, e);
      }
    }
  }

  if (!dbState) {
    dbState = getInitialDbState();
  }

  // Ensure both files exist and are populated
  try {
    const formatted = JSON.stringify(dbState, null, 2);
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_DB_FILE, formatted, 'utf-8');
    fs.writeFileSync(ROOT_DB_FILE, formatted, 'utf-8');
  } catch (e) {
    console.error('Failed to sync initial database files', e);
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

  const formatted = JSON.stringify(dbState, null, 2);

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_DB_FILE, formatted, 'utf-8');
    fs.writeFileSync(ROOT_DB_FILE, formatted, 'utf-8');
  } catch (e) {
    console.error('Failed to persist database files', e);
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

// Direct download of database.json for GitHub commit or offline backup
app.get('/api/database.json', (_req, res) => {
  const state = loadDb();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="database.json"');
  res.send(JSON.stringify(state, null, 2));
});

app.get('/api/data/download', (_req, res) => {
  const state = loadDb();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="database.json"');
  res.send(JSON.stringify(state, null, 2));
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
  const formatted = JSON.stringify(dbState, null, 2);
  try {
    fs.writeFileSync(DATA_DB_FILE, formatted, 'utf-8');
    fs.writeFileSync(ROOT_DB_FILE, formatted, 'utf-8');
  } catch (e) {
    console.error('Failed to reset database files', e);
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
