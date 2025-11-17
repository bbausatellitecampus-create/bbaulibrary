const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  // isbn: { type: String, unique: true },
  // isbn: { type: String },
  // category: String,
  department: String,
  copiesAvailable: { type: Number, default: function() { return this.totalCopies; }},
  totalCopies: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
