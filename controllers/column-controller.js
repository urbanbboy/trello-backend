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

    async deleteColumn(req, res, next) {
        try {
            const { columnId } = req.params
            await ColumnService.deleteColumn(columnId)
            return res.json({ message: "Колонка удалена" })
        } catch (error) {
            next(error)
        }
    }

    async updateColumn(req, res, next) {
        try {
            const { title, board, tasks, position } = req.body
            const { columnId } = req.params
            const editedColumn = await ColumnService.updateColumn(columnId, title, board, tasks, position)
            return res.json(editedColumn)
        } catch (error) {
            next(error)
        }
    }
}

export default new ColumnController();