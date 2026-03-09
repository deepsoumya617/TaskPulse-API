import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const port = parseInt(process.env.PORT || '8080', 10);
// const mongoUri = process.env.MONGO_LOCAL_URI!
const mongoCloudUri = process.env.MONGO_CLOUD_URI!;

// Connect to MongoDB
mongoose
  .connect(mongoCloudUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// run the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
