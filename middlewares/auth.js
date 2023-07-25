const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
require('dotenv').config();

exports.auth = (req, res, next) => {
  const berearToken =
    req.body.token ||
    req.query.token ||
    req.headers[('x-access-token', 'authorization')];

  if (!berearToken) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  try {
    let temp = berearToken.split(' ');
    const payload = jwt.verify(temp[1], process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload;
    next();
  } catch (e) {
    return next(new AppError(e.message, 400));
  }
};
