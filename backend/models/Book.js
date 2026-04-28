const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: String,
  // isbn: { type: String, unique: true },
  // isbn: { type: String },
  // category: String,
  department: { type: String, index: true },
  copiesAvailable: { type: Number, default: function() { return this.totalCopies; }},
  totalCopies: { type: Number, required: true, default: 1 }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model("Book", bookSchema);
