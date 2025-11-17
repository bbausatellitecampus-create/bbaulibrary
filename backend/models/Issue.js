const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, enum: ["pending", "issued", "returned"], default: "pending" },
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  paidAmount: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
