const mongoose = require("mongoose");
// schema
const termsAndConditionsSchema = new mongoose.Schema({
  _id: Number,
  content: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});
// compile schema to model
module.exports = mongoose.model(
  "termsAndConditions",
  termsAndConditionsSchema,
  "termsAndConditions"
);
