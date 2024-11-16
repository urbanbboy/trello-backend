import ApiError from '../exceptions/api-error.js'
import BoardModel from '../models/board-model.js'
import ColumnModel from '../models/column-model.js'

class ColumnService {
    async getBoardColumns(boardId) {
        if(!boardId) {
            throw ApiError.BadRequest("Отсутствует ID доски")
        }

        const boardLists = await ColumnModel.find({ board: boardId })
        return boardLists
    }

    async createColumn(title, board, tasks = [], position) {
        if(!title && !board) {
            throw ApiError.BadRequest("Отсутствуют необходимые данные для создания колонки")
        }

        const newList = await ColumnModel.create({
            title,
            board,
            tasks,
            position
        })

        await BoardModel.findByIdAndUpdate(board, {
            $push: { columns: newList._id }
        })
        
        return newList
    }

    async deleteColumn(columnId) {
        const deletedColumn = await ColumnModel.findByIdAndDelete(columnId)
        if(!deletedColumn) {
            throw ApiError.BadRequest("Колонка не найдена")
        }
    }

    async updateColumn(columnId, title, board, tasks = [], position) {
        if(!columnId) {
            throw ApiError.BadRequest("Колонка не найдена")
        }

        const updatedColumn = await ColumnModel.findByIdAndUpdate(
            columnId,
            { title, board, tasks, position },
            {new: true}
        )

        return updatedColumn
    }
}

export default new ColumnService()