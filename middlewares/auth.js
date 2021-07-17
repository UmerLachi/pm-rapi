import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export const protect = async (req, res, next) => {
  const errorMessage = {
    message: 'Authentication credentials were not provided',
  };

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // eslint-disable-next-line no-unused-vars
      const [_, token] = req.headers.authorization.split(' ');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Account.findById(decoded.userId).select('-password');

      next();
    } catch (err) {
      res.status(401).json(errorMessage);
    }
  } else {
    res.status(401).json(errorMessage);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
