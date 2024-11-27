import ApiError from '../exceptions/api-error.js'
import ColumnModel from '../models/column-model.js'
import TaskModel from '../models/task-model.js'

class TaskService {
    async createTask(title, description, columnId, boardId, order, assignees = []) {
        if (!title && !description && !columnId && !boardId) {
            throw ApiError("Поля title и desecription обязательны")
        }
        const newTask = await TaskModel.create({
            title,
            description,
            columnId,
            boardId,
            order,
            assignees
        })

        await ColumnModel.findByIdAndUpdate(columnId, {
            $push: { tasks: newTask._id }
        })

        return newTask
    }

    async deleteTask(taskId) {
        const deletedTask = await TaskModel.findByIdAndDelete(taskId)
        if (!deletedTask) {
            throw ApiError.BadRequest("Задача не найдена")
        }
    }

    async getBoardTasks(boardId) {
        if (!boardId) {
            throw ApiError.BadRequest("Колонка не найдена")
        }

        const columnTasks = await TaskModel.find({ boardId })
        return columnTasks
    }

    async updateTask() {

    }
}

export default new TaskService()