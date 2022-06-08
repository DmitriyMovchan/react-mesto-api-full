const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [isURL],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    user: 'userSchema',
    required: true,
  },
  likes: {
    type: Array,
    user: 'userSchema',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);
