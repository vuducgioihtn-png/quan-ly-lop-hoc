import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database.json:', err);
  }
  return null;
}

function writeDatabase(data: any) {
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database.json:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  
  // In development container with nginx, app must listen on 3000.
  // In production (Cloud Run deployment), the app is standalone and must listen on process.env.PORT (typically 8080).
  const isDevContainer = process.env.NODE_ENV === 'development' && Boolean(process.env.CONTROL_PLANE_PORT);
  const PORT = isDevContainer ? 3000 : (Number(process.env.PORT) || 3000);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get current complete database
  app.get('/api/data', (req, res) => {
    const db = readDatabase();
    if (db) {
      res.json({ success: true, data: db });
    } else {
      res.status(404).json({ success: false, message: 'Database not found on server' });
    }
  });

  // Save / Sync database
  app.post('/api/data', (req, res) => {
    try {
      const current = readDatabase() || {};
      const updated = {
        ...current,
        ...req.body,
        lastUpdated: new Date().toISOString()
      };
      const ok = writeDatabase(updated);
      if (ok) {
        res.json({ success: true, message: 'Data saved successfully to database.json', lastUpdated: updated.lastUpdated });
      } else {
        res.status(500).json({ success: false, message: 'Failed to write to database.json' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // Download raw database.json for GitHub commit or offline backup
  app.get('/api/download-db', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="starkids_database.json"');
      fs.createReadStream(DB_FILE).pipe(res);
    } else {
      res.status(404).json({ error: 'Database file not found' });
    }
  });

  // Restore database from uploaded JSON
  app.post('/api/restore-db', (req, res) => {
    try {
      const incoming = req.body;
      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid database payload' });
      }
      writeDatabase(incoming);
      res.json({ success: true, message: 'Database restored successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Restore failed' });
    }
  });

  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || (!isDevContainer && hasDist);

  // Vite middleware for development, static files for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StarKids server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
