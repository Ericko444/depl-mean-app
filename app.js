const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

mongoose
  .connect(config.database)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    throw ("Connection exception ", err);
  });

const app = express();

const users = require("./routes/users");
const reparations = require("./routes/reparation");

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/reparations", reparations);

app.get("/", (req, res) => {
  res.send("Invaild endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called");
  console.log("Path: ", req.path);
  console.error("Error: ", error);

  if (error.type == "redirect") res.redirect("/error");
  else if (error.type == "time-out")
    res.status(408).send(error);
  else if(error.type === "success")
    res.status(200).send(error);
  else if(error.type === "error")
    res.status(400).send(error);
  else res.status(500).send(error);
});

app.listen(port, () => {
  console.log("Server running on " + port);
});
