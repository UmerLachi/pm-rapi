import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  res.json(req.body);
});

router.post('/signin', (req, res) => {
  res.json(req.body);
});

router.post('/confirm-email', (req, res) => {
  res.send('<h1>Confirm your email</h1>');
});

export default router;
