const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const router = require('./routes');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64b5f19cf46cf55b62a9fe47',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => { console.log('БД подключена'); })
  .catch(() => { console.log('Не удалось подключится к БД'); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
