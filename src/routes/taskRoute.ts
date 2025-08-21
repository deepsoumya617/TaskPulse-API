import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '../controllers/taskController'
import { authMiddleWare } from '../middlewares/authMiddleware'

const taskRouter = Router()

// get all tasks
taskRouter.get('/', authMiddleWare, getAllTasks)

// create task
taskRouter.post('/create-task', authMiddleWare, createTask)

// update task by id
taskRouter.put('/:id', authMiddleWare, updateTask)

// get task by id
taskRouter.get('/:id', authMiddleWare, getTaskById)

// delete task by id
taskRouter.delete('/:id', authMiddleWare, deleteTask)

export default taskRouter
