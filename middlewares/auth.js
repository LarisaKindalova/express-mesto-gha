const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET_KEY');
    console.log(payload);
  } catch (err) {
    console.log('УПС');
    return next(new Unauthorized('Пользователь не авторизирован'));
  }
  req.user = payload;
  return next();
};
