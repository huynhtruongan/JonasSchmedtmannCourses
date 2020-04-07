const express = require("express");
const tourController = require("./../controller/tourController");
const authController = require("./../controller/authController");

const router = express.Router();
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopCheap, tourController.entireTours);
router
  .route("/")
  .get(authController.protect, tourController.entireTours)
  .post(/*tourController.checkBody,*/ tourController.postTour);
// router.param('id', tourController.checkID);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
