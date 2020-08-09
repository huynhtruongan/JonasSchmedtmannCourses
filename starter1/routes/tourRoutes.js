const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const route = express.Router();

route
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.creatTour);
route
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.editTour)
  .delete(tourControllers.deleteTour);

module.exports = route;
