const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const User = require("../model/user");
const userController = require('../controller/userController');
const { authorize } = require("../middlewares/authorize");

const Roles = {
  CLIENT: "client",
  ATELIER: "atelier",
  FINANCE: "finance",
}

router.post("/inscription", userController.inscription);

router.post("/login", userController.login);
router.get("/atelier", userController.getAteliers);

router.get("/decode",authorize([Roles.FINANCE]), userController.decode);
router.get("/decode/finance",authorize([Roles.FINANCE]), userController.decode);
router.get("/decode/atelier",authorize([Roles.ATELIER]), userController.decode);

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });
  
module.exports = router;
