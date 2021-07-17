import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import JoiOID from 'joi-objectid';

import Board from '../models/board.js';

Joi.objectId = JoiOID(Joi, 'Invalid id format');

const boardSchema = Joi.object({
  workspaceId: Joi.objectId(),
  name: Joi.string().max(200).required(),
});

/**
 * @desc   Fetch all boards
 * @route  /api/boards
 * @access Private
 */
export const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({}).sort('-createdAt');

  res.status(200).json(boards);
});

/**
 * @desc   Create a board
 * @route  /api/boards
 * @access Private
 */
export const createBoard = asyncHandler(async (req, res) => {
  const values = await boardSchema.validateAsync(req.body);

  const board = await Board.create(values);

  if (!board) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please retry later' });
  }

  return res.status(201).json(board);
});

/**
 * @desc   Fetch a single board
 * @route  /api/boards/:id
 * @access Private
 */
export const getBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.status(200).json(board);
});

/**
 * @desc   Update a board
 * @route  /api/boards/:id
 * @access Private
 */
export const updateBoard = asyncHandler(async (req, res) => {
  const values = await boardSchema.validateAsync(req.body);

  const board = await Board.findByIdAndUpdate(req.params.id, values, {
    new: true,
  });

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.status(200).json(board);
});

/**
 * @desc   Delete a board
 * @route  /api/boards/:id
 * @access Private
 */
export const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.deleteOne({ id: req.params.id });

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.status(200).json({ deleted: true });
});
