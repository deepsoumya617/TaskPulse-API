import { Request, Response } from 'express'
import { Task } from '../models/taskModel'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createTaskSchema, updateTaskSchema } from '../validators/taskSchema'

// create task
export async function createTask(req: AuthRequest, res: Response) {
  const { title, description } = createTaskSchema.parse(req.body)

  try {
    // save task
    const newTask = new Task({
      title,
      description,
      user: req.user!.userId,
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

// Get all task for a user
export async function getAllTasks(req: AuthRequest, res: Response) {
  try {
    // find all tasks based on the user id
    const allTasks = await Task.find({ user: req.user!.userId })

    res.status(200).json(allTasks)
  } catch (error) {
    console.error('Error getting all tasks:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// update task
export async function updateTask(req: AuthRequest, res: Response) {
  const { title, description, status } = updateTaskSchema.parse(req.body)
  const { id } = req.params
  const userId = req.user!.userId

  try {
    // find task by id and update
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { title, description, status },
      { new: true, runValidators: true }
    )

    // unautorized or wrong id or task deleted
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.status(200).json({
      message: 'Task updated successfully!',
      updatedTask,
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// get task by id
export async function getTaskById(req: AuthRequest, res: Response) {
  const { id } = req.params
  const userId = req.user!.userId

  try {
    const task = await Task.findOne({ _id: id, user: userId })

    // unautorized or wrong id or task deleted
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.status(200).json(task)
  } catch (error) {
    console.error('Error getting task by id:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// delete task
export async function deleteTask(req: AuthRequest, res: Response) {
  const { id } = req.params
  const userId = req.user!.userId

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId })

    // unautorized or wrong id or task deleted
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.status(200).json({
      message: 'Task deleted successfully!',
      deletedTask,
    })
  } catch (error) {
    console.error('Error deleting task by id:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
