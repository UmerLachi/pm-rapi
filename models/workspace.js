import mongoose, { mongo } from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
  },
  { timestamps: true }
);

workspaceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
