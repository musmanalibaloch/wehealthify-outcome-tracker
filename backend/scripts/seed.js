/**
 * Standalone seed script. Run: npm run seed or yarn run seed (from backend directory).
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runSeed } from '../src/db/seed.js';
import { getTestCredentials } from '../src/db/seedData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wehealthify';

async function main() {
  await mongoose.connect(MONGODB_URI);
  await runSeed();
  console.log('\nTest credentials (2 clinics):');
  for (const { clinicName, users } of getTestCredentials()) {
    console.log(`--- ${clinicName} ---`);
    users.forEach((u) => console.log(`  username: ${u.username}   password: ${u.password}`));
  }
  console.log('');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
