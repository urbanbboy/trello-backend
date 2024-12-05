import ColumnService from '../services/column-service.js'

class ColumnController {
    async getBoardColumns(req, res, next) {
        try {
            const { boardId } = req.params
            const boardColumns = await ColumnService.getBoardColumns(boardId)
            return res.json(boardColumns)

        } catch (error) {
            next(error)
        }
    }

    async createColumn(req, res, next) {
        try {
            const { title, boardId, tasks, order } = req.body
            const newList = await ColumnService.createColumn(title, boardId, tasks, order)
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
            const { title, boardId, tasks, order } = req.body
            const { columnId } = req.params
            const editedColumn = await ColumnService.updateColumn(columnId, title, boardId, tasks, order)
            return res.json(editedColumn)
        } catch (error) {
            next(error)
        }
    }

    async updateColumnOrder(req, res, next) {
        try {
            const { columns, boardId } = req.body;
            console.log(boardId)
            const updatedColumns = await ColumnService.updateColumnOrder(boardId, columns);
            return res.json(updatedColumns);
        } catch (error) {
            next(error);
        }
    }
}

export default new ColumnController();