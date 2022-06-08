const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const { isAuthorized } = require('./middlewares/auth');
const { NotFoundError } = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

app.use(requestLogger);

app.post('/signin', userRouter);
app.post('/signup', userRouter);

app.use(isAuthorized);
app.use('/', userRouter);
app.use('/cards', cardRouter);
// eslint-disable-next-line no-shadow
app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
});
