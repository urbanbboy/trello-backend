import UserModel from '../models/user-model.js'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import MailService from '../services/mail-service.js'
import TokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exceptions/api-error.js'
import InviteTokenModel from '../models/invite-token-model.js'
import BoardModel from '../models/board-model.js'
class UserService {
    async register(email, username, password) {
        const candidateEmail = await UserModel.findOne({ email })
        const candidateUsername = await UserModel.findOne({ username })
        if(candidateEmail || candidateUsername) {
            throw ApiError.BadRequest("Пользователь с таким именем или почтой уже существует")
        }

        const hashedPassword = await bcrypt.hash(password, 3)
        const activationLink = uuidv4()

        const user = await UserModel.create({ email, username, password: hashedPassword, activationLink })
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async inviteRegister(email, username, password, token) {
        const userData = await TokenService.validateInviteToken(token)
        const tokenFromDb = await InviteTokenModel.findOne({ inviteToken: token })
        
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const candidateEmail = await UserModel.findOne({ email })
        const candidateUsername = await UserModel.findOne({ username })
        if(candidateEmail || candidateUsername) {
            throw ApiError.BadRequest("Пользователь с таким именем или почтой уже существует")
        }

        const hashedPassword = await bcrypt.hash(password, 3)

        const user = await UserModel.create({ email, username, password: hashedPassword, isActivated: true })
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
        
        const board = await BoardModel.findById(userData.boardId)
        if(board) {
            board.members.push(user._id)
            await board.save()
        } else {
            throw ApiError.BadRequest("Доска не найдена");
        }
        
        await InviteTokenModel.findOneAndUpdate(
            { inviteToken: token },
            { used: true }
        )


        return {
            ...tokens,
            user: userDto,
            boardId: userData.boardId
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if(!user) {
            throw ApiError.BadRequest("Некорректная ссылка активации")
        }

        user.isActivated = true
        user.activationLink = null
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if(!user) {
            throw ApiError.BadRequest("Пользователь не найден")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            throw ApiError.BadRequest("Неверный пароль")
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
    
        return {...tokens, user: userDto}
    }

    async updateUser(id, username, email, image) {
        const user = await UserModel.findById(id)
        if(!user) {
            throw ApiError.BadRequest("Пользователь не найден")
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                username, email, image
            },
            { new: true }
        )

        const userDto = new UserDto(updatedUser)
        return {...userDto};
    }
}

export default new UserService()