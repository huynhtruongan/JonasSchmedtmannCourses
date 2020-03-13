// const fs = require('fs');
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
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
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
exports.entireTours = async (req, res) => {
  // console.log(req.requestTime);
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  // 	status: 'success',
  // 	results: tours.length,
  // 	data: {
  // 		tours: tour
  // 	}
  // });
};
exports.postTour = async (req, res) => {
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
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tours: newTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
exports.updateTour = async (req, res) => {
  // res.status(200).json({
  // 	status: 'success',
  // 	data: {
  // 		tours: ' updated tours...'
  // 	}
  // });
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
