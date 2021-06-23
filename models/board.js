import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Workspace',
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

boardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Board = mongoose.model('Board', boardSchema);

export default Board;
