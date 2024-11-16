import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error.js'
import TaskService from '../services/task-service.js'

class TaskController {
    async createTask(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { title, description, column, position, assignees } = req.body
            const newTask = await TaskService.createTask(title, description, column, position, assignees)
            return res.json(newTask)
        } catch (error) {
            next(error)
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { taskId } = req.params
            await TaskService.deleteTask(taskId)
            return res.json({ message: "Задача удалена" })
        } catch (error) {
            next(error)
        }
    }

    async getColumnTasks(req, res, next) {
        try {
            const { columnId } = req.query
            const taskList = await TaskService.getColumnTasks(columnId)
            return res.json(taskList)
        } catch (error) {
            next(error)
        }
    }

    async updateTask(req, res, next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}

export default new TaskController()