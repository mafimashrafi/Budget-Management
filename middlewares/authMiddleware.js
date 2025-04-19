const jwt = require('jsonwebtoken');


function verifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.userID = decoded.userId;
    next();
  } catch (err) {
    console.error('Invalid Token', err.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

module.exports = verifyUser;

