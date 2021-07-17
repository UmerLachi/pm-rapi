import mongoose from 'mongoose';
import argon2 from 'argon2';

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
  return argon2.verify(this.password, password);
};

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await argon2.hash(this.password);
});

accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
