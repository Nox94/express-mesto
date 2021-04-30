const mongoose = require('mongoose');

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
});
// модель на основе схемы
module.exports = mongoose.model('user', userSchema);
// два аргумента: имя модели и схема, которая описывает будущие документы
