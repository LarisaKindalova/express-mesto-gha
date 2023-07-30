const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const rateLimit = require('express-rate-limit'); // Для защиты от DoS-атак //https://www.npmjs.com/package/express-rate-limit
const helmet = require('helmet'); // https://expressjs.com/ru/advanced/best-practice-security.html
const errorResponse = require('./middlewares/errorResponse');

const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => { console.log('БД подключена'); })
  .catch(() => { console.log('Не удалось подключится к БД'); });

app.use(errorResponse); // Централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
