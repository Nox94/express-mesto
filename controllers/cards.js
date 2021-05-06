const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(404).send({ message: 'Запрашиваемые ресурсы не найдены' }));
};
module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные  при создании карточки.',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner._id !== userId) {
        return Promise.reject(new Error('Вы можете удалить только свою карточку.', 400));
      }
      Card.findByIdAndRemove(cardId)
        .orFail(new Error('NotFound'))
        // eslint-disable-next-line no-shadow
        .then((card) => res.send({ card }))
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({
              message: 'Переданы некорректные данные для удаления карточки.',
            });
          } else if (err.message === 'NotFound') {
            res.status(404).send({
              message: 'Карточка с указанным _id не найдена.',
            });
          } else {
            res.status(500).send({ message: 'Ошибка сервера.' });
          }
        });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new Error('NotFound'))
    .populate(['likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постанови лайка.',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};
