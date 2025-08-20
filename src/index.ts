import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from './routes/auth'

// Load environment variables from .env file
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080
const mongoUri = process.env.MONGO_LOCAL_URI!

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use(express.json()) // parse JSON bodies

app.use('/auth', authRouter) // use auth routes

// a simple GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to TaskPulse API!' })
})

// run the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
