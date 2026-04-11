// // const express = require("express");
// // const Book = require("../models/Book");
// // const auth = require("../middleware/auth");

// // const router = express.Router();

// // // Add book (Admin only)
// // router.post("/", auth(["admin"]), async (req, res) => {
// //   try {
// //     const book = new Book(req.body);
// //     await book.save();
// //     res.json(book);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Get all books
// // router.get("/", async (req, res) => {
// //   const books = await Book.find();
// //   res.json(books);
// // });

// // module.exports = router;






// const express = require('express');
// const Book = require('../models/Book');
// // IMPORT the middleware functions
// const { protect, authorize } = require('../middleware/auth'); 

// const router = express.Router();

// // GET all books (accessible by anyone)
// router.get('/', async (req, res) => {
//     const q = req.query.q || '';
//     const books = await Book.find({ title: { $regex: q, $options: 'i' } });
//     res.json(books);
// });

// // POST a new book (PROTECTED: only accessible by 'librarian')
// // 1. The 'protect' middleware ensures the user is logged in.
// // 2. The 'authorize('librarian')' middleware ensures the user's role is 'librarian'.
// router.post('/', protect, authorize('librarian'), async (req, res) => {
//     const data = req.body;
    
//     // Add validation here for title, author, quantity (production quality)
//     if (!data.title || !data.author || !data.quantity) {
//         return res.status(400).json({ msg: 'Please include title, author, and quantity.' });
//     }

//     try {
//         const book = new Book(data);
//         await book.save();
//         res.status(201).json(book);
//     } catch (err) {
//         if (err.code === 11000) { // MongoDB duplicate key error (for unique ISBN)
//              return res.status(409).json({ msg: 'A book with this ISBN already exists.' });
//         }
//         res.status(500).json({ error: 'Error adding book: ' + err.message });
//     }
// });



// module.exports = router;









const express = require('express');
const Book = require('../models/Book');
const IssuedBook = require('../models/Issue');
const { protect, authorize } = require('../middleware/auth'); 

const router = express.Router();

// --- PUBLIC ROUTE: GET all books (Search/List) ---
// GET /api/books
// router.get('/', async (req, res) => {
//     // Simple search by title (case-insensitive regex)
//     const q = req.query.q || '';
//     try {
//         const books = await Book.find({ title: { $regex: q, $options: 'i' } });
//         res.json(books);
//     } catch (err) {
//         res.status(500).json({ error: 'Error fetching books: ' + err.message });
//     }
// });

// --- PUBLIC ROUTE: GET all books (Search/List/Pagination) ---
// GET /api/books?q=search&department=dept&page=1&limit=25
router.get("/", async (req, res) => {
  try {
    console.log("🔍 GET /api/books Query:", req.query); // Debug Log

    const { q, department } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const pipeline = [];

    // Helper to escape regex special characters
    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // 1. Build Match Stage
    const matchStage = {};

    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      matchStage.$or = [
        { title: regex },
        { author: regex },
        // { isbn: regex } // Uncomment if needed
      ];
    }

    if (department && department !== "all") {
      matchStage.department = department;
    }

    // Log the match filter to see what's being queried
    if (Object.keys(matchStage).length > 0) {
      console.log("🔎 Match Stage:", JSON.stringify(matchStage, null, 2));
      pipeline.push({ $match: matchStage });
    } else {
      console.log("🔎 Match Stage: (Empty - Fetching All)");
    }

    // 2. Facet Stage for Pagination & Count
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const results = await Book.aggregate(pipeline);

    // Debug the raw result from MongoDB
    // console.log("📊 Aggregation Result Metadata:", results[0]?.metadata);
    // console.log("📚 Books Found in Page:", results[0]?.data?.length);

    const total = results[0].metadata[0]?.total || 0;
    const books = results[0].data;
    const hasMore = total > skip + books.length;

    res.json({ books, total, page, hasMore });
  } catch (err) {
    console.error("Fetch books error:", err);
    res.status(500).json({ error: "Error fetching books: " + err.message });
  }
});



// --- PROTECTED ROUTE: ADD a single book (Admin Only) ---
// POST /api/books
router.post('/', protect, authorize('admin'), async (req, res) => {
    const data = req.body;
    
    // Production-level validation for essential fields
    if (!data.title || !data.author || !data.totalCopies || data.totalCopies < 1) {
        return res.status(400).json({ msg: 'Please include title, author, and a valid totalCopies count.' });
    }

    try {
        const book = new Book(data);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error (for unique ISBN)
             return res.status(409).json({ msg: 'A book with this ISBN already exists.' });
        }
        res.status(500).json({ error: 'Error adding book: ' + err.message });
    }
});

// --- PROTECTED ROUTE: BULK UPLOAD books (Librarian Only) ---
// POST /api/books/bulk
// router.post('/bulk', protect, authorize('admin'), async (req, res) => {
//     const booksArray = req.body;

//     if (!Array.isArray(booksArray) || booksArray.length === 0) {
//         return res.status(400).json({ msg: 'Request body must be a non-empty array of books.' });
//     }

//     try {
//         // Use Mongoose's insertMany for high-performance bulk insertion.
//         // { ordered: false } allows valid documents to be inserted even if some fail (e.g., duplicates).
//         const result = await Book.insertMany(booksArray, { ordered: false }); 
        
//         res.status(201).json({
//             msg: `Successfully inserted ${result.length} books.`,
//             insertedCount: result.length
//         });

//     } catch (err) {
//         // --- Production-Level Error Handling for Bulk Operations ---
//         if (err.writeErrors) { 
//              const failedCount = err.writeErrors.length;
//              const successCount = booksArray.length - failedCount;
             
//              // 207 Multi-Status indicates partial success/failure
//              return res.status(207).json({ 
//                 msg: `Bulk upload completed with errors. ${successCount} successful, ${failedCount} failed.`,
//                 successCount,
//                 failedCount,
//                 failures: err.writeErrors.map(e => ({
//                     index: e.index,
//                     message: e.errmsg || 'Unknown error',
//                     book: booksArray[e.index]?.title || 'Unknown Title'
//                 })),
//             });
//         }
        
//         res.status(500).json({ error: 'Critical error during bulk insertion: ' + err.message });
//     }
// });

router.post('/bulk', protect, authorize('admin'), async (req, res) => {
  const booksArray = req.body;

  if (!Array.isArray(booksArray) || booksArray.length === 0) {
    return res.status(400).json({ msg: 'Request body must be a non-empty array of books.' });
  }

  try {
    const result = await Book.insertMany(booksArray, { ordered: false });

    res.status(201).json({
      msg: `Successfully inserted ${result.length} books.`,
      insertedCount: result.length
    });
  } catch (err) {
    if (err.writeErrors) {
      const failedCount = err.writeErrors.length;
      const successCount = booksArray.length - failedCount;

      return res.status(207).json({
        msg: `Bulk upload completed with errors. ${successCount} successful, ${failedCount} failed.`,
        successCount,
        failedCount,
        failures: err.writeErrors.map(e => ({
          index: e.index,
          message:
            e.err?.message ||
            e.errmsg ||
            e.err?.errmsg ||
            JSON.stringify(e.err) ||
            'Unknown error',
          book: booksArray[e.index]?.title || 'Unknown Title'
        })),
      });
    }

    console.error('Critical error during bulk insertion:', err);
    res.status(500).json({ error: 'Critical error during bulk insertion: ' + err.message });
  }
});



// --- PROTECTED ROUTE: UPDATE a single book (Librarian Only) ---
// PUT /api/books/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Enforce schema validation
        });

        if (!book) {
            return res.status(404).json({ msg: 'Book not found.' });
        }

        res.json(book);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ msg: 'A book with this ISBN already exists.' });
        }
        res.status(500).json({ error: 'Error updating book: ' + err.message });
    }
});


// Get unique categories
router.get("/categories", async (req, res) => {
  const categories = await Book.distinct("category");
  res.json(categories);
});

// Get unique departments
router.get("/departments", async (req, res) => {
  const departments = await Book.distinct("department");
  res.json(departments);
});



// --- PROTECTED ROUTE: DELETE a book (Librarian Only) ---
// DELETE /api/books/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // PRODUCTION CHECK: Prevent deletion if book is currently issued
        const activeIssue = await IssuedBook.findOne({
            book: req.params.id,
            status: 'issued' // Assuming 'issued' status means it's currently checked out
        });

        if (activeIssue) {
            return res.status(400).json({ msg: 'Cannot delete book: it is currently issued to a user.' });
        }

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found.' });
        }

        res.json({ msg: 'Book successfully deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting book: ' + err.message });
    }
});

module.exports = router;