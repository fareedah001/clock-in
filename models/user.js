// const mongoose = require("mongoose");
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the User schema

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clockIn: { type: Date, default: null },
  clockOut: { type: Date, default: null },
});

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   // Add any additional fields you need
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// Create the User model
const User = mongoose.model("user", userSchema);

// Export the User model
export default User;
