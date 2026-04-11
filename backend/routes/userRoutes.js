const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const IssuedBook = require('../models/Issue');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();


// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, libraryCardNo, phone, department, semester, role } = req.body;
    
    // Server-side validation check
    if (!name || !email || !password || !libraryCardNo || !phone || !department || !semester) {
       return res.status(400).json({ error: "All fields are required" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashed, 
      libraryCardNo, 
      phone, 
      department, 
      semester, 
      role 
    });
    await user.save();
    console.log(`User registered: ${email}`);
    res.json(user);
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

 const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }   // token valid for 7 days
);
  res.json({ token, role: user.role });
});



// --- A. GET All Users ---
// GET /api/users
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        // Exclude the password field for security
        // const users = await User.find().select('-password');
        const users = await User.find()

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users: ' + err.message });
    }
});

// --- B. UPDATE User Details/Role ---
// PUT /api/users/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        
        // Prevent accidental password overwrite (handled separately via a reset route if needed)
        delete updates.password; 

        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        }).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error updating user: ' + err.message });
    }
});

// --- C. DELETE User Account ---
// DELETE /api/users/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // PRODUCTION CHECK: Prevent deletion if user has an active issued book
        const activeIssue = await IssuedBook.findOne({
            student: req.params.id, // Corrected from 'user' to 'student'
            status: 'issued'
        });

        if (activeIssue) {
            return res.status(400).json({ msg: 'Cannot delete user: they currently have an issued book.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json({ msg: 'User successfully deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user: ' + err.message });
    }
});

module.exports = router;
