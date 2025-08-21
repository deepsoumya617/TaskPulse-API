import mongoose, { Schema, Document } from 'mongoose'

type taskType = Document & {
  title: string
  description?: string
  status: string
  user: mongoose.Schema.Types.ObjectId
}

const taskSchema = new Schema<taskType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const Task = mongoose.model<taskType>('Task', taskSchema)
