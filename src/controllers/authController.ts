import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { sendEmail } from '../services/emailService'

// Register a new user
export async function registerUser(req: Request, res: Response) {
  const { name, email, password } = req.body

  // validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  try {
    // check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    })

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    })
    user.save()

    // send verification email
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`
    await sendEmail(
      email,
      'Verify Email - TaskPulse',
      `Please verify your email by clicking on the following link: ${verificationUrl}`
    )

    // send response
    // res.status(201).json({ message: 'Registered, click email to verify!' })
    res.status(201).json({
      message: 'Registered, click email to verify!',
      user: {
        name: user.name,
        email: user.email,
        password: user.password, // remove later
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Verify user email
export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.query
  // validate token
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Invalid verification token' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string
    }

    // find user by email and verification token
    const user = await User.findOne({
      email: decodedToken.email,
      verificationToken: token,
    })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired verification token' })
    }

    // update user to mark email as verified
    user.isVerified = true
    user.verificationToken = undefined // clear the token
    await user.save()

    res.status(200).json({
      message: 'Email verified successfully',
      user: {
        name: user.name,
        email: user.email,
        password: user.password, // remove later
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
