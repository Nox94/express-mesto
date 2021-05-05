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
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
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
  },
});
// модель на основе схемы
module.exports = mongoose.model('user', userSchema);
// два аргумента: имя модели и схема, которая описывает будущие документы
