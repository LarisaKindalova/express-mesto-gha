const userRouter = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validate');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', validateUpdateUser, updateUserInfo);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
