import ApiError from '../exceptions/api-error.js'
import ColumnModel from '../models/column-model.js'
import TaskModel from '../models/task-model.js'

class TaskService {
    async createTask(title, description, column, position, assignees) {
        if(!title && !description && !column) {
            throw ApiError("Поля title и desecription обязательны")
        }
        const newTask = await TaskModel.create({ title, description, column, position, assignees: assignees || [] })

        await ColumnModel.findByIdAndUpdate(column, {
            $push: { tasks: newTask._id }
        })

        return newTask
    }

    async deleteTask(taskId) {
        const deletedTask = await TaskModel.findByIdAndDelete(taskId)
        if(!deletedTask) {
            throw ApiError.BadRequest("Задача не найдена")
        }
    }

    async getColumnTasks(columnId) {
        if(!columnId) {
            throw ApiError.BadRequest("Колонка не найдена")
        }

        const columnTasks = await TaskModel.find({ column: columnId })
        return columnTasks
    }

    async updateTask() {
        
    }
}

export default new TaskService()