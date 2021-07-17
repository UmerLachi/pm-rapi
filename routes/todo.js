import express from 'express';
import checkObjectId from '../middlewares/checkObjectId.js';
import {
  getTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.js';

const router = express.Router();

router.route('/').get(getTodos).post(createTodo);

router
  .route('/:id')
  .get(checkObjectId('id'), getTodo)
  .put(checkObjectId('id'), updateTodo)
  .delete(checkObjectId('id'), deleteTodo);

export default router;
