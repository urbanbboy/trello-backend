import UserService from '../services/user-service.js'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error.js'

class TaskController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { title, description, } = req.body
            const userData = await UserService.register(email, username, password)
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async get() {

    }
}

export default new TaskController()