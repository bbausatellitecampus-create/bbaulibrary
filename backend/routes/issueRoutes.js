// const express = require("express");
// const Issue = require("../models/Issue");
// const Book = require("../models/Book");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // Student requests a book
// router.post("/request/:bookId", auth(["student"]), async (req, res) => {
//   try {
//     const issue = new Issue({
//       student: req.user.id,
//       book: req.params.bookId
//     });
//     await issue.save();
//     res.json(issue);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Admin approves request
// router.put("/approve/:id", auth(["admin"]), async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id).populate("book");
//     if (!issue) return res.status(404).json({ msg: "Issue not found" });

//     issue.status = "issued";
//     issue.issueDate = new Date();
//     issue.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
//     await issue.save();

//     // update book copies
//     issue.book.copiesAvailable -= 1;
//     await issue.book.save();

//     res.json(issue);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Return book
// router.put("/return/:id", auth(["student", "admin"]), async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id).populate("book");
//     if (!issue) return res.status(404).json({ msg: "Issue not found" });

//     issue.status = "returned";
//     issue.returnDate = new Date();

//     // Fine calculation
//     if (issue.returnDate > issue.dueDate) {
//       const daysLate = Math.ceil((issue.returnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
//       issue.fine = daysLate * 10;
//     }

//     await issue.save();

//     // update book copies
//     issue.book.copiesAvailable += 1;
//     await issue.book.save();

//     res.json(issue);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get student issued books
// router.get("/myissues", auth(["student"]), async (req, res) => {
//   const issues = await Issue.find({ student: req.user.id }).populate("book");
//   res.json(issues);
// });

// // Admin - all issues
// router.get("/", auth(["admin"]), async (req, res) => {
//   const issues = await Issue.find().populate("book student");
//   res.json(issues);
// });

// module.exports = router;

















// const express = require("express");
// const Issue = require("../models/Issue");
// const Book = require("../models/Book");
// const { protect, authorize } = require('../middleware/auth'); 

// const router = express.Router();

// // Student requests a book
// router.post("/request/:bookId", protect, async (req, res) => {
//   try {
//     const issue = new Issue({
//       student: req.user.id,
//       book: req.params.bookId
//     });
//     await issue.save();
//     res.json(issue);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Admin approves request
// router.put("/approve/:id", protect, authorize("admin"), async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id).populate("book");
//     if (!issue) return res.status(404).json({ msg: "Issue not found" });

//     issue.status = "issued";
//     issue.issueDate = new Date();
//     issue.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
//     await issue.save();

//     // update book copies
//     issue.book.copiesAvailable -= 1;
//     await issue.book.save();

//     res.json(issue);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Return book
// // router.put("/return/:id", protect, authorize(["student", "admin"]), async (req, res) => {
// // router.put("/return/:id", protect, authorize("admin"), async (req, res) => {
// //   try {
// //     const issue = await Issue.findById(req.params.id).populate("book");
// //     if (!issue) return res.status(404).json({ msg: "Issue not found" });

// //     issue.status = "returned";
// //     issue.returnDate = new Date();

// //     // Fine calculation
// //     if (issue.returnDate > issue.dueDate) {
// //       const daysLate = Math.ceil((issue.returnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
// //       issue.fine = daysLate * 10;
// //     }

// //     await issue.save();

// //     // update book copies
// //     issue.book.copiesAvailable += 1;
// //     await issue.book.save();

// //     res.json(issue);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // router.put("/return/:id", protect, authorize("admin"), async (req, res) => {
// //   try {
// //     const issueId = req.params.id;
// //     const { fineCleared } = req.body; // from frontend when admin confirms fine paid

// //     const issue = await IssuedBook.findById(issueId)
// //       .populate("book")
// //       .populate("student");

// //     if (!issue) {
// //       return res.status(404).json({ msg: "Issue record not found." });
// //     }

// //     if (issue.status !== "issued") {
// //       return res.status(400).json({ msg: "Book is not currently issued." });
// //     }

// //     // ✅ If fine was cleared by admin, reset it to zero
// //     if (fineCleared && issue.fine > 0) {
// //       issue.fine = 0;
// //       issue.isFinePaid = true; // optional field, add if not exist
// //     }

// //     // ✅ Update status to returned
// //     issue.status = "returned";
// //     issue.returnDate = new Date();

// //     await issue.save();

// //     return res.json({
// //       msg: "Book return approved successfully!",
// //       issue,
// //     });
// //   } catch (err) {
// //     console.error("Return Error:", err);
// //     return res.status(500).json({ msg: "Error processing return: " + err.message });
// //   }
// // });


// // Get student issued books
// router.get("/myissues", protect, async (req, res) => {
//   const issues = await Issue.find({ student: req.user.id }).populate("book");
//   res.json(issues);
// });

// // Admin - all issues
// router.get("/", protect, authorize("admin"), async (req, res) => {
//   const issues = await Issue.find().populate("book student");
//   res.json(issues);
// });

// // --- PROTECTED ROUTE: Fine Payment/Waiver (Librarian Only) ---
// // PUT /api/issue/fine/:id
// // This route is for recording that a fine was paid or waived by the admin.
// // router.put("/fine/:id", protect, authorize("admin"), async (req, res) => {
// //     try {
// //         const issueId = req.params.id;
// //         const { amountPaid } = req.body;
        
// //         const issue = await IssuedBook.findById(issueId);
// //         if (!issue) return res.status(404).json({ msg: "Issue record not found" });
        
// //         if (issue.status !== 'returned') {
// //              return res.status(400).json({ msg: "Fine can only be managed on returned books." });
// //         }

// //         if (issue.fine <= 0) {
// //              return res.status(400).json({ msg: "No fine is due on this record." });
// //         }

// //         // Production-level logic: Simply set fine to zero upon payment/waiver
// //         // In a complex system, you would track payment history, but for 100% core backend, a reset is sufficient.
// //         issue.fine = 0; 
// //         issue.isFinePaid = true; // Optional: Add this field to your IssuedBook Model for clarity, but fine=0 implies paid.

// //         await issue.save();
        
// //         res.json({ msg: "Fine successfully settled (paid or waived).", issue });
// //     } catch (err) {
// //         res.status(500).json({ error: 'Error processing fine: ' + err.message });
// //     }
// // });

// // PUT /api/issues/fine/:id
// router.put("/fine/:id", protect, authorize("admin"), async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id);
//     if (!issue) return res.status(404).json({ msg: "Issue not found" });
//     issue.paidAmount = issue.fine; // Assuming full payment for simplicity
//     issue.fine = 0;
//     issue.isFinePaid = true;
//     issue.finePaid = true;

//     await issue.save();

//     res.json({ msg: "Fine cleared successfully.", issue });
//   } catch (err) {
//     res.status(500).json({ msg: "Error processing fine: " + err.message });
//   }
// });

// // PUT /api/issues/return/:id
// router.put("/return/:id", protect, authorize("admin"), async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id).populate("book");
//     if (!issue) return res.status(404).json({ msg: "Issue not found" });

//     issue.status = "returned";
//     issue.returnDate = new Date();

//     issue.book.copiesAvailable += 1;
//     await issue.book.save();
//     await issue.save();

//     res.json({ msg: "Book returned successfully.", issue });
//   } catch (err) {
//     res.status(400).json({ msg: err.message });
//   }
// });


// module.exports = router;







const express = require("express");
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// --------------------
// Student requests a book
// --------------------
router.post("/request/:bookId", protect, async (req, res) => {
  try {
    const issue = new Issue({
      student: req.user.id,
      book: req.params.bookId,
    });
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------
// Admin approves request
// --------------------
router.put("/approve/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("book");
    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    issue.status = "issued";
    issue.issueDate = new Date();
    issue.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
    await issue.save();

    issue.book.copiesAvailable -= 1;
    await issue.book.save();

    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------
// Admin approves return with automatic fine
// --------------------
router.put("/return/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("book");
    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    if (issue.status !== "issued") {
      return res.status(400).json({ msg: "Book is not currently issued." });
    }

    const today = new Date();
    let fine = 0;

    if (today > issue.dueDate) {
      const daysLate = Math.ceil((today - issue.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 10; // ₹10 per late day
    }

    issue.status = "returned";
    issue.returnDate = today;
    issue.fine = fine;
    issue.finePaid = fine === 0; // mark paid if no fine

    issue.book.copiesAvailable += 1;
    await issue.book.save();
    await issue.save();

    res.json({ msg: "Book returned successfully.", issue });
  } catch (err) {
    console.error("Return Error:", err);
    res.status(500).json({ msg: "Error processing return: " + err.message });
  }
});

// --------------------
// Admin records fine payment/waiver
// --------------------
router.put("/fine/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    issue.paidAmount = issue.fine; // full payment
    issue.fine = 0;
    issue.finePaid = true;

    await issue.save();
    res.json({ msg: "Fine cleared successfully.", issue });
  } catch (err) {
    res.status(500).json({ msg: "Error processing fine: " + err.message });
  }
});

// --------------------
// Student: get own issued books
// --------------------
router.get("/myissues", protect, async (req, res) => {
  const issues = await Issue.find({ student: req.user.id }).populate("book");
  res.json(issues);
});

// --------------------
// Admin: get all issues with search & filter
// --------------------
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { search, status } = req.query;

    // Start with status filter
    const filter = {};
    if (status) {
      const statusArray = status.split(",");
      filter.status = { $in: statusArray };
    }

    // Fetch issues with populated student and book
    let issues = await Issue.find(filter).populate("book student");

    // If search query exists, filter in JS
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      issues = issues.filter(
        (issue) =>
          (issue.book?.title && regex.test(issue.book.title)) ||
          (issue.book?.isbn && regex.test(issue.book.isbn)) ||
          (issue.student?.name && regex.test(issue.student.name))
      );
    }

    res.json(issues);
  } catch (err) {
    console.error("Admin fetch issues error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
