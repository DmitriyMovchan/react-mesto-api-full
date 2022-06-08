const Card = require('../models/card');

const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { Forbidden } = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
      // res.status(500).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ message: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Неправильный запрос'));
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      next(err);
      // res.status(500).send({ message: 'Server error' });
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные');
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        // return;
      }
      if (card.owner._id.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена1' });
          });
      } else {
        return next(new Forbidden('Вы пытались удалить чужую карточку'));
        // res.status(403).send({ message: 'Чужие карточки удалять нельзя' });
      }
    })
  // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Неправильный запрос'));
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      next(err);
      // res.status(500).send({ message: 'некорректный id карточки.' });
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Переданы некорректные данные'));
        // return res.status(404).send({ message: 'некорректный id карточки.' });
      }
      res.status(200).send({ message: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильный запрос'));
        // res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные');
        // return res.status(404).send({ message: 'некорректный id карточки' });
      }
      res.status(200).send({ message: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильный запрос'));
        // res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
