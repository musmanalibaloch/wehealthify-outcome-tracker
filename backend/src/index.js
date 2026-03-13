import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDb } from './db/connect.js';
import { runSeed } from './db/seed.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import outcomesRoutes from './routes/outcomes.js';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes(express.Router()));
app.use('/api/outcomes', outcomesRoutes(express.Router()));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

async function start() {
  await connectDb();
  await runSeed();
  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
