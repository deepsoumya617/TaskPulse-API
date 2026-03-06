import express, { Express, Request, Response } from 'express';
import authRouter from './routes/authRoute';
import taskRouter from './routes/taskRoute';
import { uptime } from 'process';

const app: Express = express();

app.use(express.json()); // parse JSON bodies

app.use('/auth', authRouter); // use auth routes
app.use('/tasks', taskRouter); // use task routes

// a simple GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to TaskPulse API!' });
});

// health route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Api is running fine!',
    uptime,
  });
});

// export app
export default app;
