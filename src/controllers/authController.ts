import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { sendEmail } from '../services/emailService'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenSchema,
} from '../validators/authSchema'

// Register a new user
export async function registerUser(req: Request, res: Response) {
  // validate request body
  const { name, email, password } = registerSchema.parse(req.body)

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
    const verificationUrl = `${process.env.APP_URL_PROD}/auth/verify-email?token=${verificationToken}`
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
  // validate token
  const { token } = tokenSchema.parse(req.query)
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

// login user
export async function loginUser(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)

  try {
    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User doesnt exist!' })
    }

    // user exists, check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    // check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          'Email not verified. Please check your email for verification link.',
      })
    }

    // generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// forgot password
export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotPasswordSchema.parse(req.body)

  try {
    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist!' })
    }

    // generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '10m',
    })

    // send reset email
    const resetUrl = `${process.env.APP_URL_PROD}/auth/reset-password?token=${resetToken}`
    await sendEmail(
      email,
      'Reset Password - TaskPulse',
      `To reset your password, please click on the following link: ${resetUrl}`
    )

    // send response
    res.status(200).json({
      message: 'Reset password email sent successfully',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// reset password
export async function resetPassword(req: Request, res: Response) {
  const { token } = tokenSchema.parse(req.query)
  const { newPassword } = resetPasswordSchema.parse(req.body)

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }

    // find user by id
    const user = await User.findById(decodedToken.userId)
    if (!user) {
      return res.status(400).json({
        message: 'User doesnt exist!',
      })
    }

    // update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    // send response
    res.status(201).json({
      message: 'Password updated successfully!',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
