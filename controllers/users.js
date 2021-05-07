const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getOneUser = (req, res, next) => User
  .findOne({ _id: req.params.userId })
  .then((user) => {
    if (!user) {
      throw new Error('Необходима авторизация.', 401);
    }
    res.send(user);
  })
  .catch(next);

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
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // хеш записан в базу
    }))
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

module.exports.login = (req, res) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
          expires: new Date(Date.now() + 604800),
        })
        .res.send({ _id: user._id });
    })
    .catch(() => {
      res.status(401).send({
        message: 'Ошибка авторизации: введены неверные учетные данные.',
      });
    });
};
