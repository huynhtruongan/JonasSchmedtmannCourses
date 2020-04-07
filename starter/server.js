const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections);
    console.log("DB connection successful!");
  });

// const testTour = new Tour({
// 	name: 'The Park Camper',
// 	price: 997
// });

// testTour
// 	.save()
// 	.then((doc) => {
// 		console.log(doc);
// 	})
// 	.catch((err) => {
// 		console.log('ERROR ⚠', err);
// 	});
// console.log(process.env);
const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log(" UNHANDLE REJECTION 💣 shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log(" UNCAUGHT EXCEPTION 💣 shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
