// const fs = require('fs');
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
// 	console.log(`iD:${val}`);

// 	if (req.params.id > tours.length - 1) {
// 		return res.status(404).json({
// 			status: 'fail',
// 			message: 'Invalid ID'
// 		});
// 	}
// 	next();
// };
// exports.checkBody = (req, res, next) => {
// 	if (!req.body.name || !req.body.price) {
// 		return res.status(400).json({
// 			status: 'Bad request',
// 			message: 'Missed name or price!!'
// 		});
// 	}
// 	next();
// };
exports.aliasTopCheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,difficulty,summary";
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // { $match: { _id: { $ne: 'EASY' } } }
  ]);
  res.status(200).json({
    status: "success",
    data: stats
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: { month: "$_id" }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { month: 1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: "success",
    data: plan
  });
});
exports.entireTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);

  //BUID query

  // EXECUTE query
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .field()
    .paginate();
  const tour = await features.query;
  // const tour = await Tour.find({'price[$gte]': '500' });
  //query data

  // const tour = await Tour.find({
  // 	duration: 5,
  // 	difficulty: 'easy'
  // });

  // const tour = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
  // console.log(req.query);
  //SEND response
  res.status(200).json({
    status: "success",
    results: tour.length,
    data: {
      tour
    }
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour found with that`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });

  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  // 	status: 'success',
  // 	results: tours.length,
  // 	data: {
  // 		tours: tour
  // 	}
  // });
});

exports.postTour = catchAsync(async (req, res, next) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
  // 	res.status(201).json({
  // 		status: 'success',
  // 		data: {
  // 			tours: newTour
  // 		}
  // 	});
  // });
  // try {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tours: newTour
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err
  //   });
  // }
});
exports.updateTour = catchAsync(async (req, res, next) => {
  // res.status(200).json({
  // 	status: 'success',
  // 	data: {
  // 		tours: ' updated tours...'
  // 	}
  // });

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError(`No tour found with that`, 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      tour
    }
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour found with that`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});
