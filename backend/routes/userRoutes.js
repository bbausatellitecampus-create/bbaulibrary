const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const IssuedBook = require('../models/Issue');
const { protect, authorize } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, libraryCardNo, phone, department, semester, academicSession, role, profilePhoto } = req.body;
    
    // Server-side validation check
    if (!name || !email || !password || !libraryCardNo || !phone || !department || !semester || !academicSession) {
       return res.status(400).json({ error: "All fields are required" });
    }

    // Validate Academic Session format (xxxx-xxxx)
    const sessionRegex = /^\d{4}-\d{4}$/;
    if (!sessionRegex.test(academicSession)) {
        return res.status(400).json({ error: "Academic Session must follow the format YYYY-YYYY (e.g., 2023-2027)" });
    }

    // Calculate Expiry Date from Academic Session (e.g., "2023-2027")
    let expiryDate = null;
    if (academicSession && academicSession.includes("-")) {
      const years = academicSession.split("-");
      const endYear = parseInt(years[1]);
      if (!isNaN(endYear)) {
        // Default to May 31st of the end year
        expiryDate = new Date(endYear, 4, 31); // Month is 0-indexed, so 4 is May
      }
    }

    let profilePhotoUrl = "";
    let profilePhotoId = "";
    if (profilePhoto) {
      try {
        const uploadRes = await cloudinary.uploader.upload(profilePhoto, {
          folder: 'bbau_library_profiles',
        });
        profilePhotoUrl = uploadRes.secure_url;
        profilePhotoId = uploadRes.public_id;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res.status(500).json({ error: "Failed to upload profile photo" });
      }
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
      academicSession,
      expiryDate,
      role,
      profilePhoto: profilePhotoUrl,
      profilePhotoId // Storing this for easier deletion
    });
    await user.save();
    console.log(`User registered: ${email}`);
    res.json(user);
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Login (same as before)
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

// --- A. GET Current User Profile ---
// GET /api/users/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching profile: ' + err.message });
    }
});

// --- B. GET All Users ---
// GET /api/users
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users: ' + err.message });
    }
});

// --- B. UPDATE User Details/Role ---
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        
        delete updates.password; 

        if (updates.profilePhoto && updates.profilePhoto.startsWith('data:image')) {
            try {
                // Get old user to delete old photo
                const oldUser = await User.findById(userId);
                if (oldUser && oldUser.profilePhotoId) {
                  await cloudinary.uploader.destroy(oldUser.profilePhotoId);
                }

                const uploadRes = await cloudinary.uploader.upload(updates.profilePhoto, {
                    folder: 'bbau_library_profiles',
                });
                updates.profilePhoto = uploadRes.secure_url;
                updates.profilePhotoId = uploadRes.public_id;
            } catch (uploadErr) {
                console.error("Cloudinary Update Error:", uploadErr);
                return res.status(500).json({ error: "Failed to upload new profile photo" });
            }
        }

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
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found.' });

        // 1. Check for active issues
        const activeIssue = await IssuedBook.findOne({
            student: req.params.id,
            status: { $in: ['issued', 'pending'] }
        });

        if (activeIssue) {
            return res.status(400).json({ msg: 'Cannot delete user: they have active book issues or pending requests.' });
        }

        // 2. Check for dues
        if (user.dues > 0) {
          return res.status(400).json({ msg: `Cannot delete user: they have pending dues of ₹${user.dues}.` });
        }

        // 3. Delete Cloudinary Image
        if (user.profilePhotoId) {
          try {
            await cloudinary.uploader.destroy(user.profilePhotoId);
          } catch (cloudErr) {
            console.error("Cloudinary Deletion Error:", cloudErr);
          }
        }

        // 4. Delete user record
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User and all associated data successfully deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user: ' + err.message });
    }
});

module.exports = router;
