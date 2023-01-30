const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

getUserByUsername = function (username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

exports.login = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User introuvable" });
      }

      comparePassword(password, user.password, async (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign({ data: user }, config.secret, {
            expiresIn: 604800, // 1 semaine
          });
          await User.findByIdAndUpdate(user._id, { token });
          res.json({
            success: true,
            token: "JWT " + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              role: user.role,
            },
            expiresIn: 604800,
          });
        } else {
          return res.json({ success: false, msg: "Erreur d'authentification" });
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.inscription = function (req, res, next) {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    accessToken: "",
  });

  addUser(newUser, (err, user) => {
    if (err) {
      console.log("ERROR", err);
      res.json({ success: false, msg: "Failed to register user" });
    } else {
      res.json({ success: true, msg: "User registered" });
    }
  });
};

exports.decode = function (req, res, next) {
  res.json({ success: true, msg: "Mety eh LOL" });
};

exports.getAteliers = function (req, res, next) {
  User.find({ role: "atelier"}, (err, data) => {
    if (err) {
      res.json({
        success: false,
        err: `Fetch error: ${err}`,
      });
      throw new Error(err);
    } else {
      res.json({
        success: true,
        msg: "Liste des utilisateurs",
        data: data,
      });
    }
  });
};
