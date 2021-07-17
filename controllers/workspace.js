import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import Workspace from '../models/workspace.js';

const workspaceSchema = Joi.object({
  name: Joi.string().max(150).required(),
});

/**
 * @desc   Fetch all workspaces
 * @route  /api/workspaces
 * @access Private
 */
export const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({}).sort('-createdAt');

  res.status(200).json(workspaces);
});

/**
 * @desc   Create new workspace
 * @route  /api/workspaces
 * @access Private
 */
export const createWorkspace = asyncHandler(async (req, res) => {
  const { name } = await workspaceSchema.validateAsync(req.body);

  const workspace = await Workspace.create({ name, user: req.user.id }).select(
    '-user'
  );

  if (!workspace) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please retry later' });
  }

  return res.status(200).json(workspace);
});

/**
 * @desc   Fetch a single workspace
 * @route  /api/workspaces/:id
 * @access Private
 */
export const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id).select('-user');

  if (!workspace) {
    return res.status(404).json({ message: 'Workspace not found' });
  }

  return res.status(200).json(workspace);
});

/**
 * @desc   Update a workspace
 * @route  /api/workspaces/:id
 * @access Private
 */
export const updateWorkspace = asyncHandler(async (req, res) => {
  const values = await workspaceSchema.validateAsync(req.body);

  const workspace = await Workspace.findByIdAndUpdate(req.params.id, values, {
    new: true,
  }).select('-user');

  if (!workspace) {
    return res.status(404).json({ message: 'Workspace not found' });
  }

  return res.status(200).json(workspace);
});

/**
 * @desc   Delete a workspace
 * @route  /api/workspaces/:id
 * @access Private
 */
export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.deleteOne({ id: req.params.id });

  if (!workspace) {
    return res.status(404).json({ message: 'Workspace not found' });
  }

  return res.status(200).json({ deleted: true });
});
