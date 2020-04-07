const express = require("express");
const app = express();
const globalErrorHandler = require("./controller/errorController");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const appError = require("./utils/appError");
//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
// app.use((req, res, next) => {
// 	console.log(`Hello! i'm middleware`);
// 	next();
// });
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fails",
  //   message: `Can't find url ${req.originalUrl}, please check it again!!!`
  // });
  // const err = new Error(
  //   `Can't find url ${req.originalUrl}, please check it again!!!`
  // );
  // err.statusCode = 404;
  // err.status = "fails";

  next(
    new appError(
      `Can't find url ${req.originalUrl}, please check it again!!!`,
      404
    )
  );
});
app.use(globalErrorHandler);
module.exports = app;
