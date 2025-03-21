var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
let { CreateErrorRes } = require("./utils/responseHandler");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

mongoose.connect("mongodb://localhost:27017/S5");
mongoose.connection.on("connected", () => {
  console.log("connected");
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// app.use("/user", usersRouter);
app.use("/users", require("./routes/users"));
app.use("/role", require("./routes/role"));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  CreateErrorRes(res, err.message, err.status || 500);
});

module.exports = app;
