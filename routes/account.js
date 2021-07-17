import express from 'express';
import {
  createAccount,
  getAccounts,
  updateAccount,
  getAccount,
  confirmEmail,
  authenticateUser,
} from '../controllers/account.js';
import checkObjectId from '../middlewares/checkObjectId.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, getAccounts).post(createAccount);

router
  .route('/:id')
  .get(checkObjectId('id'), protect, getAccount)
  .put(checkObjectId('id'), protect, updateAccount)
  .patch(checkObjectId('id'), protect, updateAccount);

router.post('/signin', authenticateUser);

router.post('/confirm-email', confirmEmail);

export default router;
