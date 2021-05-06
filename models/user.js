const mongoose = require('mongoose');
const validator = require('validator/lib/isEmail');

// const validateEmail = function(email) {
//     var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return emailRegex.test(email);
// };

const userSchema = new mongoose.Schema({
  // схема
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
    minlength: 8,
    select: false,
  },
});
// модель на основе схемы
module.exports = mongoose.model('user', userSchema);
// два аргумента: имя модели и схема, которая описывает будущие документы
