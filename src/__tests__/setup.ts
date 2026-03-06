import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret@617';
process.env.APP_URL_PROD = process.env.APP_URL_PROD || 'http://localhost:8080';

// create mono server and connect to it
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// clear junk
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

// close connection -> after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
