import { Request, Response } from 'express'
import { Task } from '../models/taskModel'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createTaskSchema } from '../validators/taskSchema'

// create task
export async function createTask(req: AuthRequest, res: Response) {
  const { title, description } = createTaskSchema.parse(req.body)

  // validate user
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    // save task
    const newTask = new Task({
      title,
      description,
      user: userId,
    })
    await newTask.save()

    // Return the created task
    res.status(201).json({
      task: {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        user: newTask.user,
      },
      message: 'Task created successfully',
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
