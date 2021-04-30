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
      if (err.message === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные  при создании карточки.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('invalidId'))
    .then((card) => res.send({ card }))
    .catch(() => res.status(404).send({
      message: 'Карточка с указанным _id не найдена.',
    }));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new Error('castError'))
    .populate(['likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'castError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('castError'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'castError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
