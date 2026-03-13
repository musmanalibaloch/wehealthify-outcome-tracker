import Outcome from '../models/Outcome.js';
import { validationResult } from 'express-validator';

export async function listOutcomes(req, res, next) {
  try {
    const outcomes = await Outcome.find({ clinicId: req.user.clinicId })
      .sort({ dateRecorded: -1 })
      .lean();
    res.json(outcomes);
  } catch (err) {
    next(err);
  }
}

export async function createOutcome(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { patientIdentifier, painScore, mobilityScore, dateRecorded } = req.body;
    const outcome = await Outcome.create({
      clinicId: req.user.clinicId,
      patientIdentifier,
      painScore: Number(painScore),
      mobilityScore: Number(mobilityScore),
      dateRecorded: dateRecorded ? new Date(dateRecorded) : new Date(),
    });

    res.status(201).json(outcome);
  } catch (err) {
    next(err);
  }
}
