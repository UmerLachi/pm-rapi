import mongoose from 'mongoose';

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

accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
