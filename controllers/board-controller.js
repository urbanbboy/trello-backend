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

    async getBoardMembers(req, res, next) {
        try {
            const { boardId } = req.query
            const boardMembers = await BoardService.getBoardMembers(boardId)
            return res.json(boardMembers)
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

    async updateBoardImage(req, res, next) {
        try {
            const { boardId, image } = req.body
            const updatedBoard = await BoardService.updateBoardImage(boardId, image)
            return res.json(updatedBoard)
        } catch (error) {
            next(error)
        }
    }

    async updateBoardName(req, res, next) {
        try {
            const { name, boardId } = req.body
            const updatedBoard = await BoardService.updateBoardName(boardId, name)
            return res.json(updatedBoard)
        } catch (error) {
            next(error)
        }
    }

    async inviteUser(req, res, next) {
        try {
            const { email, boardId } = req.body
            const resMessage = await BoardService.inviteUser(boardId, email)
            return res.json(resMessage)
        } catch (error) {
            next(error)
        }
    }
}

export default new BoardController();