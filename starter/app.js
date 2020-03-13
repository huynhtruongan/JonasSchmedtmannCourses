const express = require("express");
const app = express();
const tourRouter = require("./routes/tourRouter");
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

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fails",
  //   message: `Can't find url ${req.originalUrl}, please check it again!!!`
  // });
  const err = new Error(
    `Can't find url ${req.originalUrl}, please check it again!!!`
  );
  err.statusCode = 404;
  err.status = "fails";

  next(err);
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
module.exports = app;
