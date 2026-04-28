const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  libraryCardNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  academicSession: { type: String }, // e.g. "2023-2027"
  expiryDate: { type: Date },       // May of the last year of session
  role: { type: String, enum: ["student", "admin"], default: "student" },
  profilePhoto: { type: String },
  profilePhotoId: { type: String },
  dues: { type: Number, default: 0 }
  }, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
