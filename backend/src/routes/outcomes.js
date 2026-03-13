import { body } from 'express-validator';
import { listOutcomes, createOutcome } from '../controllers/outcomesController.js';
import { authenticate } from '../middleware/auth.js';

const createValidators = [
  body('patientIdentifier').trim().notEmpty().withMessage('Patient identifier is required'),
  body('painScore')
    .isInt({ min: 1, max: 10 })
    .withMessage('Pain score must be between 1 and 10'),
  body('mobilityScore')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mobility score must be between 1 and 10'),
  body('dateRecorded')
    .optional()
    .isISO8601()
    .withMessage('dateRecorded must be a valid ISO date'),
];

export default function outcomesRoutes(router) {
  router.use(authenticate);
  router.get('/', listOutcomes);
  router.post('/', createValidators, createOutcome);
  return router;
}
