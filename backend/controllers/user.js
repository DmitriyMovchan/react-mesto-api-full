const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { ConflictError } = require('../errors/ConflictError');

const MONGO_DUPLICATE_KEY_CODE = 11000;
const saltRounds = 10;

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
        // return res.status(404).send({ message: 'пользователь не найден.' });
      }
      console.log(user);
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest('Неправильный запрос'));
        // return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      next(err);
      // return res.status(500).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!password || !email) {
    throw new NotFoundError('Переданы некорректные данные');
    // return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        // eslint-disable-next-line no-shadow
        const {
          // eslint-disable-next-line no-shadow
          name, about, avatar, email, _id,
        } = user;
        res.status(201).send({
          name, about, avatar, email, _id,
        });
      }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(new ConflictError('Пользователь с таким емейлом уже есть.'));
        // return res.status(409).send({ message: 'Пользователь с таким емейлом уже есть.' });
      }
      next(err);
      // res.status(500).send({ message: err.name });
    });
};

// НЕ РАБОТАЕТ ВАЛИДАЦИЯ ПО ПАРОЛЮ! (сделал)
// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line consistent-return
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new NotFoundError('Переданы некорректные данные');
    // return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest('Переданы некорректные данные'));
        // return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      next(err);
      // return res.status(500).send({ message: 'Server error' });
    });
};

const getMe = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Переданы некорректные данные'));
        // return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
      // res.status(500).send(err);
    });
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getMe,
};
