import request from 'supertest';
import app from '../app';
import { User } from '../models/userModel';
import { sendEmail } from '../services/emailService';

jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn(),
}));

const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

async function waitForUser(email: string) {
  for (let i = 0; i < 10; i += 1) {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    }
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  return null;
}

describe('auth routes', () => {
  beforeEach(() => {
    mockedSendEmail.mockResolvedValue(undefined);
  });

  it('registers a new user and triggers email', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    };

    const response = await request(app).post('/auth/register').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toContain('Registered');
    expect(mockedSendEmail).toHaveBeenCalledTimes(1);

    const user = await waitForUser(payload.email);
    expect(user).not.toBeNull();
    expect(user?.isVerified).toBe(false);
  });

  it('verifies email, then allows login', async () => {
    const payload = {
      name: 'Login User',
      email: 'login@example.com',
      password: 'Password123!',
    };

    await request(app).post('/auth/register').send(payload);
    const user = await waitForUser(payload.email);

    expect(user?.verificationToken).toBeDefined();

    const verifyResponse = await request(app)
      .get('/auth/verify-email')
      .query({ token: user?.verificationToken });

    expect(verifyResponse.status).toBe(200);

    const loginResponse = await request(app).post('/auth/login').send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
  });
});
