const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'A tours must have a name' ],
			unique: true,
			trim: true,
			maxlength: [ 40, 'A tour name must have less or equal then 40 characters' ],
			minlength: [ 10, 'A tour name must have more or equal then 10 characters' ]
		},
		slug: String,
		duration: {
			type: Number,
			required: [ true, 'A tours must have a duration' ]
		},
		maxGroupSize: {
			type: Number,
			required: [ true, 'A tour must have a group size' ]
		},
		difficulty: {
			type: String,
			required: [ true, 'A tour must have a difficulty' ],
			enum: {
				values: [ 'easy', 'medium', 'difficult' ],
				message: 'Difficulty is either: easy, medium, difficult'
			}
		},
		ratingsAverage: {
			type: Number,
			max: [ 5, 'Rating must be below 5' ],
			min: [ 1, 'Rating must be abow 1' ],
			default: 4.5
		},
		ratingQuatity: {
			type: Number,
			default: 0
		},
		price: {
			type: Number,
			required: [ true, 'A tour must have a price' ]
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function(val) {
					//this only points to current doc on NEW document creation
					return val < this.price;
				},
				message: 'Discount price({VALUE}) should be below regular price'
			}
		},
		summary: {
			type: String,
			trim: true,
			required: [ true, 'A tour must have a summery' ]
		},
		description: {
			type: String,
			trim: true
		},
		imageCover: {
			type: String,
			required: [ true, 'A tour must have a cover image' ]
		},
		images: [ String ],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false
		},
		secretTour: {
			type: Boolean,
			default: false
		},
		startDates: [ Date ]
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);
tourSchema.virtual('durationWeeks').get(function() {
	return this.duration / 7;
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function() {
	this.slug = slugify(this.name, { lower: true });
	next();
});
// tourSchema.pre('save', function(next) {
// 	console.log('will save document');
// 	next();
// });
// tourSchema.post('save', function(doc, next) {
// 	console.log(doc);
// 	next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});
tourSchema.post(/^find/, function(docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	// console.log(docs);
	next();
});
// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
	// console.log('pipeline', this.pipeline());
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
