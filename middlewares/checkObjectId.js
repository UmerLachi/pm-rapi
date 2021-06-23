import mongoose from 'mongoose';

const isObjectValid = (key) => (req, res, next) => {
  if (req.params[key] && !mongoose.Types.ObjectId.isValid(req.params[key])) {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  next();
};

export default isObjectValid;
