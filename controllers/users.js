const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getOneUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NoIdFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при запросе пользователя.',
        });
      } else if (err.message === 'NoIdFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.updateUsersProfileById = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NoIdFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else if (err.message === 'NoIdFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.updateUsersAvatarById = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NoIdFound'))
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else if (err.message === 'NoIdFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка.' });
      }
    });
};
