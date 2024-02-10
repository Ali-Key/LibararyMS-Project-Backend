import bookModel from "../models/book.model.js";
import userModel from "../models/user.model.js";

// Get book and search filter - GET
export const getBooks = async (req, res) => {
  try {
    const search = req.query;

    const books = await bookModel
      .find(search)
      .sort({ createdAt: -1 })
      .populate("admin", "name email avatar");

    if (books.length === 0) {
      return res.status(404).json({ status: 404, message: "Books not found" });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create book - POST only  admin creat book and check if can have a permission
export const createBook = async (req, res) => {
  try {
    const adminId = req.user.id;
    const role = req.user.role;

    if (role === "admin") {
      res.status(403).json({
        status: 403,
        message: "You don't have permission",
      });
    }

    const admin = await userModel.findById({ _id: adminId });

    if (!admin) {
      return res
        .status(404)
        .json({ status: 404, message: "The admin not found" });
    }
    const book = await bookModel.create({
      ...req.body,
      admin: adminId,
    });

    if (!book) {
      return res
        .status(400)
        .json({ status: 400, message: "Book was not created" });
    }

    await book.save();

    res.status(200).json({
      status: 200,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Book - PUT
export const updateBook = async (req, res) => {
  try {
    const id = req.params.id; // ID of the book to update
    const role = req.user.role; // Role of the user making the request
    const adminId = req.user.id;


    // Check if the user is the admin
    if (role === "admin") {
      res.status(403).json({
        status: 403,
        message: "You don't have permission",
      });

   
    }
       // Check if the admin user exists
       const admin = await userModel.findById(adminId); // Corrected to use adminId directly
      if (!admin) {
        return res.status(404).json({ status: 404, message: "The admin not found" });
      }

      // Check if the book exists
      const book = await bookModel.findById(id);

      if (!book) {
        return res.status(404).json({
          status: 404,
          message: "The book not found",
        });
      }

      // Check if the logged-in admin owns the book
      if (book.admin.toString() !== adminId) {
        return res.status(403).json({
          status: 403,
          message: "You do not own this book!",
        });
      }

      // Update the book
      const updatedBook = await bookModel.findByIdAndUpdate(
        id, // Corrected to pass the id directly
        { $set: req.body }, // Update operations
        { new: true } // Options: return the modified document rather than the original
      );

      if (!updatedBook) {
        return res.status(400).json({ status: 400, message: "Book was not updated!" });
      }

      // Respond with success message
      res.status(200).json({ status: 200, message: "Book updated successfully", data: updatedBook });
    
  } catch (error) {
    // Handle any other errors
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





// Book Delete - DELETE
export const deleteBook = async (req, res) => {
  try {
    const role = req.user.role;
    const id = req.params.id; 

    if (role !== "admin") {

      const adminId = req.user.id;

      // Check if the admin exists
      const admin = await userModel.findById({ _id: adminId });

      if (!admin) {
        return res
          .status(404)
          .json({ status: 404, message: "The admin not found" });
      }

      const book = await bookModel.findById(id);

      if (!book) {
        return res.status(404).json({
          status: 404,
          message: "The Book not found",
        });
      }

      if (book.admin.toString() !== adminId) {
        return res.status(403).json({
          status: 403,
          message: "You do not own this book!",
        });
      }

      const deletedBook = await bookModel.findByIdAndDelete(id);

      if (!deletedBook) {
        return res
          .status(400)
          .json({ status: 400, message: " Book was not deleted" });
      }

      await deletedBook.save();
      res
        .status(200)
        .json({ status: 200, message: "Book deleted successfully" });
    } else {
      return res.status(403).json({
        status: 403,
        message: "You don't have permission",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
