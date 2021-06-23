import express from 'express';
import checkObjectId from '../middlewares/checkObjectId.js';

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res.json([]);
  })
  .post((req, res) => {
    res.json(req.body);
  });

router
  .route('/:id')
  .get(checkObjectId('id'), (req, res) => {
    res.json({ name: 'workspace name' });
  })
  .put(checkObjectId('id'), (req, res) => {
    res.json(req.body);
  });

export default router;
