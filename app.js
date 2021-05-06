require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookieparser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '608a668b730817901c9829dc', // _id созданного в предыдущем пункте по-ля
  };

  next();
});
app.use(cookieParser());
app.use('/users', users);
app.use('/cards', cards);
app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(404).send({
    message: 'Страница не найдена.',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
