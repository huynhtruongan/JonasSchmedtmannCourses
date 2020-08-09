const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Hello world!!!');
  res.status(200).json({ message: 'Hello guy', app: 'Natours' });
});

app.use('/api/v1/tours', tourRouter);

// app.route('/api/v1/users').get(getAllUsers).post(creatUser);
// app.route('/api/v1/users/:id').get(getUser).patch(editUser).delete(deleteUser);
module.exports = app;
