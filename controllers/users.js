const User = require('../models/user');
const { OK } = require('../utils/constants');
const { CREATE } = require('../utils/constants');
const { BAD_REQUEST } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорретные даные при создании пользователя', err: err.message, stack: err.stack });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные', err: err.message, stack: err.stack });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренная ошибка сервера', err: err.message, stack: err.stack });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданны некорретные даные при обновлении данных пользователя', err: err.message, stack: err.stack });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданны некорретные даные при обновлении аватара', err: err.message, stack: err.stack });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
    });
};
