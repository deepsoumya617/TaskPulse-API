import { Router } from 'express'
import {
  createTask,
  getAllTasks,
  updateTask,
} from '../controllers/taskController'
import { authMiddleWare } from '../middlewares/authMiddleware'

const taskRouter = Router()

// get all tasks
taskRouter.get('/', authMiddleWare, getAllTasks)

// create task
taskRouter.post('/create-task', authMiddleWare, createTask)

// update task by id
taskRouter.post('/:id', authMiddleWare, updateTask)

export default taskRouter
