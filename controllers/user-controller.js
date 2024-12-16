import UserService from '../services/user-service.js'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error.js'

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { email, username, password } = req.body
            const userData = await UserService.register(email, username, password)
            const { refreshToken, ...data } = userData
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await UserService.login(email, password)
            const { refreshToken, ...data } = userData
            res.cookie(
                'refreshToken',
                refreshToken,
                { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }
            )
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json({ message: "Вы вышли из аккаунта" })
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)
            const { refreshToken: newRefreshToken, ...data } = userData
            if (!refreshToken) {
                return next(ApiError.Unauthorized("Токен отсутствует"));
            }
            res.cookie('refreshToken', newRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error)
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id, username, email, image } = req.body
            const updatedUser = await UserService.updateUser(id, username, email, image)
            return res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController()