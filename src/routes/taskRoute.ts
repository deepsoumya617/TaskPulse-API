import { Router } from 'express'
import { createTask } from '../controllers/taskController'
import { authMiddleWare } from '../middlewares/authMiddleware'

const taskRouter = Router()

// create task
taskRouter.post('/create-task', authMiddleWare, createTask)

export default taskRouter
