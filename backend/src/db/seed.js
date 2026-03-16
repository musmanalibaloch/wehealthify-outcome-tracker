/**
 * Runs the full seed: 2 clinics, users per clinic, sample outcomes.
 */
import bcrypt from 'bcryptjs';
import Clinic from '../models/Clinic.js';
import User from '../models/User.js';
import Outcome from '../models/Outcome.js';
import { clinics, usersByClinic, getOutcomeDocs } from './seedData.js';

export async function runSeed() {
  try {
    // In case there is a legacy unique index on `email` (from another project),
    // drop it so that inserting users without an `email` field does not fail.
    // Ignore errors if the index does not exist.
    if (User.collection) {
      try {
        await User.collection.dropIndex('email_1');
      } catch (err) {
        // Safe to ignore: index might not exist.
      }
    }

    await Outcome.deleteMany({});
    await User.deleteMany({});
    await Clinic.deleteMany({});

    const createdClinics = {};
    for (const c of clinics) {
      const clinic = await Clinic.create(c);
      createdClinics[c.slug] = clinic;
    }

    for (const [slug, userList] of Object.entries(usersByClinic)) {
      const clinic = createdClinics[slug];
      for (const u of userList) {
        const hash = await bcrypt.hash(u.password, 10);
        await User.create({
          username: u.username,
          password: hash,
          clinicId: clinic._id,
        });
      }
    }

    const outcomeDocs = getOutcomeDocs(createdClinics);
    await Outcome.insertMany(outcomeDocs);

    console.log('Seed completed: 2 clinics, sample users and outcomes.');
  } catch (err) {
    // Seeding should never crash the app; log and continue.
    console.error('Seed failed, continuing without seed data:', err);
  }
}
