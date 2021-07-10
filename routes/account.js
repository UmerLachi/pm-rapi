import express from 'express';
import {
  createAccount,
  getAccounts,
  updateAccount,
  getAccount,
} from '../controllers/account.js';
import checkObjectId from '../middlewares/checkObjectId.js';

const router = express.Router();

router.route('/').get(getAccounts).post(createAccount);

router
  .route('/:id')
  .get(checkObjectId('id'), getAccount)
  .put(checkObjectId('id'), updateAccount)
  .patch(checkObjectId('id'), updateAccount);

router.post('/signin', (req, res) => {
  res.json(req.body);
});

router.post('/confirm-email', (req, res) => {
  res.send('<h1>Confirm your email</h1>');
});

export default router;
