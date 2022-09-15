const authMiddleware = (req, res, next) => {
  if (!req.user) {
    if (!req.session.messages) {
      req.session.messages = [];
    }
    req.session.messages.push("You can't access the page before login");
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = authMiddleware;
