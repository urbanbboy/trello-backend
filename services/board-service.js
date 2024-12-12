import ApiError from '../exceptions/api-error.js'
import BoardModel from '../models/board-model.js'
import ColumnModel from '../models/column-model.js'


class BoardService {
    async createBoard(name, owner, members, image) {
        if (!name && !owner) {
            throw ApiError.BadRequest("Название доски не может быть пустым")
        }

        if(!image) {
            throw ApiError.BadRequest("Отсутствует изображение. Не удалось создать доску")
        }

        const [
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        ] = image.split("|")

        if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
            throw ApiError.BadRequest("Отсутствует изображение. Не удалось создать доску")
        }

        const newBoard = await BoardModel.create({ 
            name, 
            owner, 
            members: members || [],
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        })
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

        await ColumnModel.deleteMany({ boardId })
    }

    async updateBoard(boardId, name) {
        if(!boardId) {
            throw ApiError.BadRequest("Доска не найдена")
        }

        if (!name || name.trim() === "") {
            throw ApiError.BadRequest("Название доски не может быть пустым");
        }
        
        const updatedBoard = await BoardModel.findByIdAndUpdate(
            boardId,
            { name },
            { new: true }
        )

        if (!updatedBoard) {
            throw ApiError.BadRequest("Доска с таким ID не найдена");
        }

        return updatedBoard
    }
}

export default new BoardService()