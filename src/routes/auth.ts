import { Router } from 'express'
import { registerUser, verifyEmail } from '../controllers/authController'

const authRouter = Router()

// Register route
authRouter.post('/register', registerUser)

// Email verification route
authRouter.get('/verify-email', verifyEmail)

export default authRouter
