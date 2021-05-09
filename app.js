require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NoFoundError = require('./errors/NoIdFoundError');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cookieParser());
app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), login);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера.' : message,
  });
});

app.use((req, res, next) => {
  next(new NoFoundError('Страница не найдена.'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
