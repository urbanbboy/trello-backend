import BoardService from '../services/board-service.js';


class BoardController {
    async createBoard(req, res, next) {
        try {
            const { name, owner, members } = req.body
            const boardData = await BoardService.createBoard(name, owner, members)
            return res.json(boardData)
        } catch (error) {
            next(error)
        }
    }

    async getBoards(req, res, next) {
        try {
            const { userId } = req.query
            const boardList = await BoardService.getBoards(userId)
            return res.json(boardList)
        } catch (error) {
            next(error)
        }
    }

    async getBoardById(req, res, next) {
        try {
            const { boardId } = req.query
            const board = await BoardService.getBoardById(boardId)
            return res.json(board)
        } catch (error) {
            next(error)
        }
    }

    async deleteBoard(req, res, next) {
        try {
            const { boardId } = req.params
            await BoardService.deleteBoard(boardId)
            return res.json({ message: "Доска удалена" })
        } catch (error) {
            next(error)
        }
    }

    async updateBoard(req, res, next) {
        try {
            const { name } = req.body
            const { boardId } = req.params
            const updatedBoard = await BoardService.updateBoard(boardId, name)
            return res.json(updatedBoard)
        } catch (error) {
            next(error)
        }
    }

    async updateBoard() {
        
    }
}

export default new BoardController();