import ColumnService from '../services/column-service.js'

class ColumnController {
    async getBoardColumns(req, res, next) {
        try {
            const { boardId } = req.query
            const boardColumns = await ColumnService.getBoardColumns(boardId)
            return res.json(boardColumns)

        } catch (error) {
            next(error)
        }
    }

    async createColumn(req, res, next) {
        try {
            const { title, board, tasks, position } = req.body
            const newList = await ColumnService.createColumn(title, board, tasks, position)
            return res.json(newList)
        } catch (error) {
            next(error)
        }
    }

    async deleteColumn() {
        try {

        } catch (error) {
            next(error)
        }
    }

    async changePosition() {
        try {

        } catch (error) {
            next(error)
        }
    }
}

export default new ColumnController();