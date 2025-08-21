import mongoose, { Schema, Document } from 'mongoose'

type taskType = Document & {
  title: string
  description?: string
  completed: boolean
  user: mongoose.Schema.Types.ObjectId
  createdAt: Date
  updateAt: Date
}

const taskSchema = new Schema<taskType>({
  title: {
    type: String,
    required: true,
  },
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export const Task = mongoose.model<taskType>('Task', taskSchema)
