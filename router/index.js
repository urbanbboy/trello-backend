import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user-controller.js'
import TaskController from '../controllers/task-controller.js'
import BoardController from '../controllers/board-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';
import ColumnController from '../controllers/column-controller.js';

export const router = new Router();

// user
router.post('/login',
    body('email').isEmail(), 
    body('password').isLength({ min: 3, max: 32 }),
    UserController.login
);
router.post('/register', UserController.register);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.post('/refresh', UserController.refresh);

//board
router.post('/boards', authMiddleware, BoardController.createBoard)
router.get('/boards', authMiddleware, BoardController.getBoards)
router.get('/board', authMiddleware, BoardController.getBoardById)
router.delete('/boards/:boardId', authMiddleware, BoardController.deleteBoard)

//column
router.post('/columns', authMiddleware, ColumnController.createColumn)
router.get('/columns', authMiddleware, ColumnController.getBoardColumns)
router.delete('/columns/:columnId', authMiddleware, ColumnController.deleteColumn)

//task
router.post('/task', TaskController.create)
router.get('/task/:id', TaskController.get)