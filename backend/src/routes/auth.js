import { body } from 'express-validator';
import { login } from '../controllers/authController.js';
import { getTestCredentials } from '../db/seedData.js';

const validators = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export default function authRoutes(router) {
  router.post('/login', validators, login);
  router.get('/test-credentials', (req, res) => res.json(getTestCredentials()));
  return router;
}
