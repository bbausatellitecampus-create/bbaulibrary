const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
  status: { type: String, enum: ["pending", "issued", "returned"], default: "pending", index: true },
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  paidAmount: { type: Number, default: 0 }

}, { timestamps: true });

issueSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Issue", issueSchema);
