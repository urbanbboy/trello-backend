import ApiError from '../exceptions/api-error.js'
import ColumnModel from '../models/column-model.js'
import TaskModel from '../models/task-model.js'

class ColumnService {
    async getBoardColumns(boardId) {
        if(!boardId) {
            throw ApiError.BadRequest("Отсутствует ID доски")
        }

        const boardLists = await ColumnModel.find({ boardId })
        return boardLists
    }

    async createColumn(title, boardId, tasks = [], order) {
        if(!title && !boardId) {
            throw ApiError.BadRequest("Отсутствуют необходимые данные для создания колонки")
        }

        const newList = await ColumnModel.create({
            title,
            boardId,
            tasks,
            order
        })

        return newList
    }

    async deleteColumn(columnId) {
        const deletedColumn = await ColumnModel.findByIdAndDelete(columnId)
        if(!deletedColumn) {
            throw ApiError.BadRequest("Колонка не найдена")
        }

        await TaskModel.deleteMany({ columnId })
    }

    async updateColumn(columnId, title, boardId, tasks = [], order) {
        if(!columnId) {
            throw ApiError.BadRequest("Колонка не найдена")
        }

        const updatedColumn = await ColumnModel.findByIdAndUpdate(
            columnId,
            { title, boardId, tasks, order },
            {new: true}
        )

        return updatedColumn
    }
}

export default new ColumnService()