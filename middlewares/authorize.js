const jwt = require("jsonwebtoken");
const config = require("../config/database");

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.secret, (err, user) => {
      if (!!err) {
        console.log("ERR", err);
      }

      if (err) return res.sendStatus(403);

      req.user = user;

      if (roles.length && !roles.includes(req.user.data.role)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      next();
    });
  };
};
