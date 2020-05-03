const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const appError = require("./utils/appError");

const globalErrorHandler = require("./controller/errorController");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const app = express();

// 1) Global middleware
// Security HTTP headers
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
// Limit requets from same API
app.use("/api", limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization again noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingQuatity",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

//Serving static files
app.use(express.static(`${__dirname}/public`));
// Test middleware
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
