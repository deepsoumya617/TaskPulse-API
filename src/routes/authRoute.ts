import { Router } from 'express'
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from '../controllers/authController'

const authRouter = Router()

// Register route
authRouter.post('/register', registerUser)

// Email verification route
authRouter.get('/verify-email', verifyEmail)

// login
authRouter.post('/login', loginUser)

// Forgot password route
authRouter.post('/forgot-password', forgotPassword)

// reset password
authRouter.post('/reset-password', resetPassword)

export default authRouter
