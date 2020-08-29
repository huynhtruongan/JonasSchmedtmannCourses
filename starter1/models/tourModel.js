const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have durations'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuatity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trime: true,
    required: [true, 'A tour must have a sumary'],
  },
  description: {
    type: String,
    trime: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
