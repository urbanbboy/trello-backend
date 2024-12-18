import BoardService from '../services/board-service.js';


class BoardController {
    async createBoard(req, res, next) {
        try {
            const { name, owner, members, image } = req.body
            const boardData = await BoardService.createBoard(name, owner, members, image)
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
            const { name, boardId, image } = req.body
            console.log(name, boardId)
            const updatedBoard = await BoardService.updateBoard(boardId, name, image)
            return res.json(updatedBoard)
        } catch (error) {
            next(error)
        }
    }

    async inviteUser(req, res, next) {
        try {
            const { boardId } = req.params
            const { email } = req.body

            const newMember = await BoardService.inviteUser(boardId, email)
            return res.json(newMember)
        } catch (error) {
            next(error)
        }
    }
}

export default new BoardController();