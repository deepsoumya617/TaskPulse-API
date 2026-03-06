import request from 'supertest';
import app from '../app';

describe('app routes', () => {
  it('GET / returns welcome message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to TaskPulse API!' });
  });

  it('GET /health returns status payload', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.uptime).toBe('number');
  });
});
