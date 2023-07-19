const cardRouter = require('express').Router();
const {
  createCard, getCards, deleteCard, putCardLike, deleteCardLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', putCardLike);
cardRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardRouter;
