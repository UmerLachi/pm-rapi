import express from 'express';
import checkObjectId from '../middlewares/checkObjectId.js';
import {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/board.js';

const router = express.Router();

router.route('/').get(getBoards).post(createBoard);

router
  .route('/:id')
  .get(checkObjectId('id'), getBoard)
  .put(checkObjectId('id'), updateBoard)
  .delete(checkObjectId('id'), deleteBoard);

export default router;
