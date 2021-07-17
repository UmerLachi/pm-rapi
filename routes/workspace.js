import express from 'express';
import checkObjectId from '../middlewares/checkObjectId.js';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/workspace.js';

const router = express.Router();

router.route('/').get(getWorkspaces).post(createWorkspace);

router
  .route('/:id')
  .get(checkObjectId('id'), getWorkspace)
  .put(checkObjectId('id'), updateWorkspace)
  .delete(checkObjectId('id'), deleteWorkspace);

export default router;
