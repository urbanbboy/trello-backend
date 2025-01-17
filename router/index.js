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
router.post('/register/invite', UserController.inviteRegister)
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.post('/refresh', UserController.refresh);
router.put("/user", authMiddleware, UserController.updateUser)

//board
router.post('/boards', authMiddleware, BoardController.createBoard)
router.get('/boards', authMiddleware, BoardController.getBoards)
router.get('/board', authMiddleware, BoardController.getBoardById)
router.get('/members', authMiddleware, BoardController.getBoardMembers)
router.put('/boards/update/image', authMiddleware, BoardController.updateBoardImage)
router.put('/boards/update/name', authMiddleware, BoardController.updateBoardName)
router.delete('/boards/:boardId', authMiddleware, BoardController.deleteBoard)
router.post('/boards/invite', authMiddleware, BoardController.inviteUser)

//column
router.get('/boards/:boardId/columns', authMiddleware, ColumnController.getBoardColumns)
router.post('/columns', authMiddleware, ColumnController.createColumn)
router.put('/columns/updateorder', authMiddleware, ColumnController.updateColumnOrder)
router.put('/columns/:columnId', authMiddleware, ColumnController.updateColumn)
router.delete('/columns/:columnId', authMiddleware, ColumnController.deleteColumn)

//task
router.get('/boards/:boardId/tasks', authMiddleware, TaskController.getBoardTasks)
router.post('/tasks', authMiddleware, TaskController.createTask)
router.delete('/tasks/:taskId', authMiddleware, TaskController.deleteTask)
router.put('/tasks/updateorder', authMiddleware, TaskController.updateTaskOrder)
router.put('/tasks/:id', authMiddleware, TaskController.updateTask)
// router.patch('/tasks/:taskId/assign', authMiddleware, TaskController.assignUser)