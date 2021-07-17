import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import JoiOID from 'joi-objectid';

import Todo from '../models/todo.js';

Joi.objectId = JoiOID(Joi, 'Invalid id format');

const todoSchema = Joi.object({
  boardId: Joi.objectId(),
  name: Joi.string().max(200).required(),
  position: Joi.number().required(),
  description: Joi.string().max(2500),
});

/**
 * @desc   Fetch all todos
 * @route  /api/todos
 * @access Private
 */
export const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({}).sort('-createdAt');

  res.status(200).json(todos);
});

/**
 * @desc   Create a todo
 * @route  /api/todos
 * @access Private
 */
export const createTodo = asyncHandler(async (req, res) => {
  const values = await todoSchema.validateAsync(req.body);

  const todo = await Todo.create(values);

  if (!todo) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please retry later' });
  }

  return res.status(201).json(todo);
});

/**
 * @desc   Fetch a single todo
 * @route  /api/todos/:id
 * @access Private
 */
export const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
});

/**
 * @desc   Update a todo
 * @route  /api/todos/:id
 * @access Private
 */
export const updateTodo = asyncHandler(async (req, res) => {
  const values = await todoSchema.validateAsync(req.body);

  const todo = await Todo.findByIdAndUpdate(req.params.id, values, {
    new: true,
  });

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
});

/**
 * @desc   Delete a todo
 * @route  /api/todos/:id
 * @access Private
 */
export const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.deleteOne({ id: req.params.id });

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json({ deleted: true });
});
