const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ошибка. Старница не найдена' });
});

module.exports = router;
