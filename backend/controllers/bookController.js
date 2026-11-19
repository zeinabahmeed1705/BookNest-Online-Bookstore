
const Book = require("../models/BookModel");

// 1. CREATE a new book
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      price,
      stock,
      image,
    } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      category,
      price,
      stock,
      image,
    });

    res.status(201).json({
      message: "Book created successfully.",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// 2. READ all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);

    res.status(500).json({
      message: "Failed to retrieve books.",
    });
  }
};

// 3. READ one book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(400).json({
      message: "Invalid book ID.",
    });
  }
};

// 4. UPDATE a book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json({
      message: "Book updated successfully.",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// 5. DELETE a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid book ID.",
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
