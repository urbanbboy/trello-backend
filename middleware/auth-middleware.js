import ApiError from '../exceptions/api-error.js';
import tokenService from '../services/token-service.js';

export default function (req, res, next) {
    try {
        const authToken = req.headers.authorization?.split(' ')[1]
        if (!authToken) {
            throw next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(authToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}