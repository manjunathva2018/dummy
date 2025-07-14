const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name cannot be empty"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "User email cannot be empty"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
    trim: true,
    select: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number cannot be empty"],
  },
  oldPassword: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
  },

  employeeId: {
    type: String,
    required: false,
  },
  currentAddress: {
    type: String,
    required: false,
  },
  permanentAddress: {
    type: String,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: [true, "Role cannot be empty"],
    enum: [
      "ADMIN",
      "PROCUREMENT_HEAD",
      "PROCUREMENT_OPERATOR",
      "SALES_HEAD",
      "SALES_AGENT",
      "PRODUCTION_MANAGER",
      "PRODUCTION_OPERATOR",
    ],
  },
  login: {
    type: Date,
    required: false,
  },
  logout: {
    type: Date,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: false,
  },
  slug: { type: String, slug: "fullName", index: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});
// compile schema to model
module.exports = mongoose.model("users", userSchema, "users");
