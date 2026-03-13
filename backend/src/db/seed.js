/**
 * Runs the full seed: 2 clinics, users per clinic, sample outcomes.
 */
import bcrypt from 'bcryptjs';
import Clinic from '../models/Clinic.js';
import User from '../models/User.js';
import Outcome from '../models/Outcome.js';
import { clinics, usersByClinic, getOutcomeDocs } from './seedData.js';

export async function runSeed() {
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
}
