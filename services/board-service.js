import {v4 as uuidv4} from 'uuid'
import ApiError from '../exceptions/api-error.js'
import BoardModel from '../models/board-model.js'
import ColumnModel from '../models/column-model.js'
import UserModel from '../models/user-model.js'
import MailService from './mail-service.js'
import TokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'


class BoardService {
    async createBoard(name, owner, members, image) {
        if (!name || !owner) {
            throw ApiError.BadRequest("Название доски не может быть пустым")
        }

        if (!image) {
            throw ApiError.BadRequest("Отсутствует изображение. Не удалось создать доску")
        }

        const [
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        ] = image.split("|")

        if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
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
        if (!boardId) {
            throw ApiError.BadRequest("Отсутствует id доски")
        }

        const board = await BoardModel.findOne({ _id: boardId });
        if (!board) {
            throw ApiError.BadRequest("Некорректный id доски")
        }

        return board;
    }

    async getBoardMembers(boardId) {
        if (!boardId) {
            throw ApiError.BadRequest("Отсутствует id доски");
        }

        const board = await BoardModel.findById(boardId).populate({
            path: 'members',
            select: 'email _id isActivated username', 
        });
    
        if (!board) {
            throw ApiError.BadRequest("Доска не найдена");
        }
 
        const membersDto = board.members.map((member) => new UserDto(member));
    
        return membersDto;
    }
    

    async deleteBoard(boardId) {
        const deletedBoard = await BoardModel.findByIdAndDelete(boardId)

        if (!deletedBoard) {
            throw new ApiError.BadRequest("Доска не найдена")
        }

        await ColumnModel.deleteMany({ boardId })
    }

    async updateBoardName(boardId, name) {
        if (!boardId) {
            throw ApiError.BadRequest.BadRequest("Доска не найдена")
        }

        if (!name || name.trim() === "") {
            throw ApiError.BadRequest("Название доски не может быть пустым");
        }

        const updatedBoard = await BoardModel.findByIdAndUpdate(
            boardId,
            {
                name,
            },
            { new: true }
        )

        if (!updatedBoard) {
            throw ApiError.BadRequest("Доска с таким ID не найдена");
        }

        return updatedBoard
    }

    async updateBoardImage(boardId, image) {
        if (!boardId) {
            throw ApiError.BadRequest("Доска не найдена")
        }

        const [
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        ] = image.split("|")

        if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
            throw ApiError.BadRequest("Отсутствует изображение. Не удалось создать доску")
        }

        const updatedBoard = await BoardModel.findByIdAndUpdate(
            boardId,
            {
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            },
            { new: true }
        )

        if (!updatedBoard) {
            throw ApiError.BadRequest("Доска с таким ID не найдена");
        }

        return updatedBoard
    }

    async inviteUser(boardId, email) {
        const board = await BoardModel.findById(boardId)

        if (!board) {
            throw ApiError.NotFoundRequest("Доска не найдена")
        }

        let user = await UserModel.findOne({ email })

        if (user) {
            if (!board.members.includes(user._id)) {
                board.members.push(user._id)
                await board.save();
            }

            return { message: "Пользователь добавлен на доску." }
        }


        const inviteToken = TokenService.generateInviteToken({ boardId, email })
        await TokenService.saveInviteToken(email, boardId, inviteToken)
        await MailService.sendInviteMail(email, `${process.env.CLIENT_URL}/register?token=${inviteToken}`)

        return { message: "Приглашение отправлено на почту" }
    }
}

export default new BoardService()