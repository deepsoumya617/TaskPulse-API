import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app';
import { Task } from '../models/taskModel';
import { User } from '../models/userModel';

async function createVerifiedUser() {
  const user = await User.create({
    name: 'Task User',
    email: `task-user-${Date.now()}-${Math.random()}@example.com`,
    password: 'Password123!',
    isVerified: true,
  });

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET as string
  );

  return { user, token };
}

describe('task routes', () => {
  it('rejects requests without auth token', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('No token');
  });

  it('creates and fetches tasks for authenticated user', async () => {
    const { token } = await createVerifiedUser();

    const createResponse = await request(app)
      .post('/tasks/create-task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Write task tests',
        description: 'integration test for tasks',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.task.title).toBe('Write task tests');

    const listResponse = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].title).toBe('Write task tests');
  });

  it('updates and deletes a task for the owner', async () => {
    const { token, user } = await createVerifiedUser();

    const task = await Task.create({
      title: 'Old title',
      description: 'Old description',
      user: user._id,
    });

    const updateResponse = await request(app)
      .put(`/tasks/${task._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New title',
        description: 'New description',
        status: 'completed',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.updatedTask.title).toBe('New title');
    expect(updateResponse.body.updatedTask.status).toBe('completed');

    const deleteResponse = await request(app)
      .delete(`/tasks/${task._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toContain('deleted');
  });
});
