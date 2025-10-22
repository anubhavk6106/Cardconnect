const express = require('express');
const {
  addCard,
  getCards,
  getCardById,
  getMyCards,
  updateCard,
  deleteCard
} = require('../controllers/cardController');
const { protect, cardOwner } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getCards)
  .post(protect, cardOwner, addCard);

router.get('/myCards', protect, cardOwner, getMyCards);

router.route('/:id')
  .get(getCardById)
  .put(protect, cardOwner, updateCard)
  .delete(protect, cardOwner, deleteCard);

module.exports = router;
