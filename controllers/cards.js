const Card = require('../models/card');
const { OK } = require('../utils/constants');
const { CREATE } = require('../utils/constants');
const { BAD_REQUEST } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорретные даные при создании пользователя', err: err.message, stack: err.stack });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка  с указаным id не найдена', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренная ошибка сервера', err: err.message, stack: err.stack });
    });
};

module.exports.putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log('не нашли');
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные', err: err.message, stack: err.stack });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указаным id не найдена', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренная ошибка сервера', err: err.message, stack: err.stack });
    });
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка  с указаным id не найдена', err: err.message, stack: err.stack });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренная ошибка сервера', err: err.message, stack: err.stack });
    });
};
