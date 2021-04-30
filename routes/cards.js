const router = require('express').Router();
const express = require('express');
const {
  getAllCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', express.json(), createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.delete('/:cardId', deleteCardById);

module.exports = router;
