class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	filter() {
		//1) Filtering
		// const queryObj = { ...req.query };
		const queryObj = { ...this.queryString };

		const excludedFields = [ 'page', 'sort', 'limit', 'fields' ];
		excludedFields.forEach((el) => delete queryObj[el]);
		//1B) Advanced filtering
		// const query = Tour.find(queryObj);
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		console.log(JSON.parse(queryStr));
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}
	sort() {
		//2) Sorting

		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-creatAt');
		}

		return this;
	}
	field() {
		//3) Field limmitng
		// console.log(req.query.fields);

		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}
	paginate() {
		//4) Pagination
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;
		if (this.queryString.page || this.queryString.limit) {
			this.query = this.query.skip(skip).limit(limit);

			// const numTours = await Tour.countDocuments();
			// console.log('count Document!!!!', numTours);

			// if (skip >= numTours) throw new Error('This page does not exist');
		}
		return this;
	}
}
module.exports = APIFeatures;
