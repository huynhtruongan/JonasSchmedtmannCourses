const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name!"],
    maxlength: [40, "User name must have less or equal then 40 characters"],
    minlength: [10, "User name must have more or equal then 10 characters"]
  },
  email: {
    type: String,
    required: [true, "Please tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE !!!
      validator: function(el) {
        return el === this.password;
      },
      message: "password are not the same!"
    }
  },
  passwordChangedAt: Date
});
userSchema.pre("save", async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function(
  camdicatePassword,
  userPassword
) {
  return await bcrypt.compare(camdicatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
};
const User = mongoose.model("User", userSchema);

module.exports = User;
