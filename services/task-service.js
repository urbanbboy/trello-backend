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

        const columnTasks = await TaskModel.find({ boardId }).sort({ order: 1 })
        return columnTasks
    }

    async updateTask(id, title, description, assignee) {
        if(!id) {
            throw ApiError.BadRequest("Произошла ошибка. Повторите попытку");
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { title, description, assignee },
            { new: true }
        )

        return updatedTask
    }   

    async updateTaskOrder(tasks, boardId) {
        if(!boardId || !tasks) {
            throw ApiError.BadRequest("Отсутствуют необходимые данные для обновления порядка колонок");
        }

        const updatedTasks = Promise.all(
            tasks.map(async (task, index) => {
                return await TaskModel.findByIdAndUpdate(
                    task._id,
                    {
                        order: index, 
                        columnId: task.columnId,
                    },
                    { new: true }
                )
            })
        )

        return updatedTasks
    }
}

export default new TaskService()