import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const accountSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 3,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      required: true,
    },
  },
  { timestamps: true }
);

accountSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
