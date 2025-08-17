import mongoose, { Schema, Document } from 'mongoose'

type UserType = Document & {
  email: string
  password: string
  name: string
  isVerified: boolean
  verificationToken?: string
  createdAt: Date
}

const userSchema = new Schema<UserType>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  name: {
    type: String,
    required: true,
  },
  isVerified: { 
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const User = mongoose.model<UserType>('User', userSchema)
