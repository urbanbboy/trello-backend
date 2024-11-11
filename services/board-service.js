import ApiError from '../exceptions/api-error.js'
import BoardModel from '../models/board-model.js'


class BoardService {
    async createBoard(name, owner, members) {
        if (!name && !owner) {
            throw ApiError.BadRequest("Название и создатель доски требуется заполнить")
        }

        const newBoard = await BoardModel.create({ name, owner, members: members || [] })
        return newBoard
    }

    async getBoards(userId) {
        if (!userId) {
            throw ApiError.BadRequest("Отсутствует id пользователяя")
        }

        const boardList = await BoardModel.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        })
            .populate('owner', 'username')
            .populate('members', 'username');

        return boardList
    }

    async getBoardById(boardId) {
        if(!boardId) {
            throw ApiError.BadRequest("Отсутствует id доски")
        }

        const board = await BoardModel.findOne({ _id: boardId });
        console.log(board)
        if(!board) {
            throw ApiError.BadRequest("Некорректный id доски")
        }

        return board;
    }

    async deleteBoard(boardId) {
        const deletedBoard = await BoardModel.findByIdAndDelete(boardId)
        if(!deletedBoard) {
            throw new ApiError.BadRequest("Доска не найдена")
        }
    }
}

export default new BoardService()