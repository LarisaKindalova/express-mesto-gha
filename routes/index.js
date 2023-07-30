const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const { NotFound } = require('../errors/not_found');
const { createUser, login } = require('../controllers/users');
const { validateCreateUser } = require('../middlewares/validate');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', login);

router.use(auth); // для всех запросов ниже будет срабатывать мидлвара

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Ошибка. Старница не найдена'));
});

module.exports = router;
