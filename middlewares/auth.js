const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.auth = (req, res, next) => {
  const berearToken =
    req.body.token ||
    req.query.token ||
    req.headers[('x-access-token', 'authorization')];

  console.log(berearToken);

  if (!berearToken) {
    return res.json({
      status: 0,
      message: 'access denied no token provided ',
    });
  }
  try {
    let temp = berearToken.split(' ');
    const payload = jwt.verify(temp[1], process.env.JWT_SECRET_KEY);
    req.user = payload;
    next();
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
