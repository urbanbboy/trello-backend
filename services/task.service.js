import UserModel from '../models/user-model.js'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import TokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exceptions/api-error.js'

class TaskService {
    async create(taskData) {

    }

    async get(taskId) {
        
    }
}

export default new TaskService()