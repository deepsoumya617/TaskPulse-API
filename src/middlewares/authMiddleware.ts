import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'

type AuthRequest = Request & { user?: { userId: string } }

export const authMiddleWare = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }

    // check if user exists
    const user = await User.findById(decoded.userId)
    if (!user || !user.isVerified) {
      return res.status(403).json({ message: 'User not verified or invalid' })
    }

    // Attach the user’s ID to the request and proceed
    req.user = { userId: decoded.userId }
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}
