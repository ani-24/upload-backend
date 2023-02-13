const auth = (req, res, next) => {
  const cookie = req.cookies["admin"];
  if (cookie) {
    next();
  } else {
    res.status(400).send("Admin not logged in");
  }
};

module.exports = auth;
