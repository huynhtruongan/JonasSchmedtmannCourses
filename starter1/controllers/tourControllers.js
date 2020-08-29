const express = require('express');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const { query } = require('express');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fails',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };
exports.checkBody = (req, res, next) => {
	console.log('work');
	if (!req.body.name || !req.body.price) {
		return res.status(404).json({
			status: 'fails',
			message: 'Invalid data'
		});
	}
	next();
};
exports.getAllTours = async (req, res) => {
	try {
		// BUILD QUERY
		// 1) Filtering
		const queryObj = { ...req.query };
		const excludeFields = [ 'page', 'sort', 'limit', 'fields' ];
		excludeFields.forEach((el) => delete queryObj[el]);
		// 2) Advandce Filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		console.log(JSON.parse(queryStr));

		const query = Tour.find(JSON.parse(queryStr));

		const tours = await query;

		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours }
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: 'Error: ' + err
		});
	}
};
exports.creatTour = async (req, res) => {
	// const newId = tours[tours.length - 1].id + 1;
	// const newTour = Object.assign({ id: newId }, req.body);

	// tours.push(newTour);

	// fs.writeFile(
	//   '__dirname/dev-data/data/tours-simple.json',
	//   JSON.stringify(tours),
	//   (err) => {
	//     res.status(201).json({
	//       status: 'success',
	//       tour: newTour,
	//     });
	//   }
	// );
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { tour: newTour }
		});
	} catch (error) {
		res.status(400).json({
			status: 'fails',
			message: 'Error' + error
		});
	}
};
exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			tour
		});
	} catch (err) {
		res.status(400).json({
			status: 'fails',
			message: 'Error' + error
		});
	}
};
exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fails',
			message: 'Error' + error
		});
	}
};
exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null
		});
	} catch (err) {
		res.status(400).json({
			status: 'fails',
			message: 'Error' + error
		});
	}
};
