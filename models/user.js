const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return validator.isURL(url, {
          require_protocol: true,
        });
      },
      message: 'Введите корректные данные ссылки.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Введены некорректные данные.'],
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
