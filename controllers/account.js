import Joi from 'joi';
import asyncHandler from 'express-async-handler';

import Account from '../models/account.js';
import Token from '../models/token.js';
import sendVerifyAccountEmail from '../utils/sendVerifyAccountEmail.js';
import generateToken from '../utils/generateToken.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  rememberMe: Joi.boolean(),
});

const accountSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const accountSchemaForPatchRequests = Joi.object({
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
});

/**
 * @desc   Authenticate User
 * @route  /api/acccounts/signin
 * @access Public
 */
export const authenticateUser = asyncHandler(async (req, res) => {
  const values = await loginSchema.validateAsync(req.body);

  const { email, password, rememberMe } = values;

  const account = await Account.findOne({ email });

  if (account && (await account.matchPassword(password))) {
    return res.json({
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      isAdmin: account.isAdmin,
      emailVerified: account.emailVerified,
      token: generateToken(account.id, rememberMe),
    });
  }

  return res.status(400).json({ message: 'Invalid email or password' });
});

/**
 * @desc   Fetch all accounts
 * @route  /api/accounts
 * @access Private
 */
export const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({})
    .select('-password')
    .sort('-createdAt');

  res.status(200).json(accounts);
});

/**
 * @desc   Create a new account
 * @route  /api/accounts
 * @access Public
 */
export const createAccount = asyncHandler(async (req, res) => {
  const values = await accountSchema.validateAsync(req.body);

  const emailExists = await Account.findOne({ email: values.email });

  if (emailExists) {
    return res.status(400).json({
      message: `Sorry, this email can't be registered. Let's try another one.`,
    });
  }

  const account = await Account.create(values);

  if (!account) {
    return res
      .status(404)
      .json({ message: 'Something went wrong, please retry later' });
  }

  await sendVerifyAccountEmail({
    firstName: account.firstName,
    email: account.email,
  });

  return res.status(201).json({
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    isAdmin: account.isAdmin,
    emailVerified: account.emailVerified,
  });
});

/**
 * @desc   Fetch a single account
 * @route  /api/accounts/:id
 * @access Private
 */
export const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id).select('-password');

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  return res.status(200).json(account);
});

/**
 * @desc   Update an account
 * @route  /api/accounts/:id
 * @access Private
 */
export const updateAccount = asyncHandler(async (req, res) => {
  let values = req.body;

  if (req.method === 'PUT') {
    values = await accountSchema.validateAsync(req.body);
  } else {
    values = await accountSchemaForPatchRequests.validateAsync(req.body);
  }

  const account = await Account.findByIdAndUpdate(req.params.id, values, {
    new: true,
  }).select('-password');

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  return res.status(200).json(account);
});

/**
 * @desc   Verify email address
 * @route  /api/confirm-email
 * @access Public
 */
export const confirmEmail = asyncHandler(async (req, res) => {
  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({
      message: `We were unable to verify your email.`,
    });
  }

  const token = await Token.findOne({ token: hash });

  if (!token) {
    return res.status(400).json({
      message: `We were unable to verify your email. (exit code 1)`,
    });
  }

  if (token.expires < Date.now()) {
    return res.status(400).json({
      message: 'Link expired, please click resend email to get a new link.',
    });
  }

  const account = await Account.findByIdAndUpdate(
    { email: token.email },
    { emailVerified: true },
    { new: true }
  ).select('-password');

  if (!account) {
    return res.status(400).json({
      message: `We were unable to verify your email. (exit code 2)`,
    });
  }

  await Token.deleteOne({ token: hash });

  return res.status(200).json(account);
});
