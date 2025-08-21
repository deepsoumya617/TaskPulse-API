import { Router } from 'express'
import {
  loginUser,
  registerUser,
  verifyEmail,
} from '../controllers/authController'

const authRouter = Router()

// Register route
authRouter.post('/register', registerUser)

// Email verification route
authRouter.get('/verify-email', verifyEmail)

// login
authRouter.post('/login', loginUser)

export default authRouter
