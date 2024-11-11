import ApiError from '../exceptions/api-error.js'
import BoardModel from '../models/board-model.js'
import ColumnModel from '../models/column-model.js'

class ColumnService {
    async getBoardColumns(boardId) {
        if(!boardId) {
            throw ApiError.BadRequest("Отсутствует ID доски")
        }

        const boardLists = await ColumnModel.find({ board: boardId })
        console.log(boardLists)
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

        console.log(newList)

        await BoardModel.findByIdAndUpdate(board, {
            $push: { lists: newList._id }
        })
        
        return newList
    }
}

export default new ColumnService()