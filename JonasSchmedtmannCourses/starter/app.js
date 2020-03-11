const express = require('express');
const app = express();
const tourRouter = require('./routes/tourRouter');
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
app.use('/api/v1/tours', tourRouter);

module.exports = app;
