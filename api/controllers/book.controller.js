import bookModel from "../models/book.model.js";
import borrowingModel from "../models/borrowing.model.js";
import transactionModel from "../models/transaction.model.js";
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
// Get book By id


export const getBook = async (req, res) => {
  try {
    const book = await bookModel
      .findById(req.params.id)
      .populate("admin", "name email avatar");

    if (!book) {
      return res.status(404).json({ status: 404, message: "Book not found" });
    }

    res.status(200).json({

      status: 200,
      message: "Book found successfully",
      data: book,

    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });

  }
}





// create book - POST
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


// Get borrowing and search filter - GET
export const getBorrows = async (req, res) => {
  try {
    const search = req.query;

    const borrows = await borrowingModel
      .find(search)
      .sort({ createdAt: -1 })
      .populate("customer", "name email avatar");

    if (borrows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Borrowing not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Borrowing found successfully",
      data: borrows,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// Get borrowing by id 
export const getBorrowing = async (req, res) => {
  try {
    const id = req.params.id;

    const borrowing = await borrowingModel.findById(id)
    .populate("customer", "name email avatar");

    if (!borrowing) {
      return res.status(404).json({
        status: 404,
        message: "Borrowing not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Borrowing found successfully",
      data: borrowing,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// create brorrowing - POST
export const createBorrowing = async (req, res) => {
  try {
    const customerId = req.user.id;
    const role = req.user.role;

    // Corrected the condition: Only allow customers to create a borrowing
    if (role !== "customer") {
      return res.status(403).json({
        status: 403,
        message: "You don't have permission",
      });
    }

    // Check if the customer exists
    const customer = await userModel.findById({ _id: customerId });
    if (!customer) {
      return res
        .status(404)
        .json({ status: 404, message: "The customer not found" });
    }

    // Create the borrowing
    const borrowing = await borrowingModel.create({
      ...req.body,
      customer: customerId,
    });
 
    await borrowing.save();
    res.status(200).json({
      status: 200,
      message: "Borrowing created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update borrowing - PUT
export const updateBorrowing = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.user.role;

    // Check if the user is the customer
    if (role === "customer") {
      const customerId = req.user.id;

      const customer = await userModel.findById({ _id: customerId });

      if (!customer) {
        return res
          .status(404)
          .json({ status: 404, message: "The customer not found" });
      }

      const borrowing = await borrowingModel.findById(id);

      if (!borrowing) {
        return res.status(404).json({
          status: 404,
          message: "The borrowing not found",
        });
      }

      if (borrowing.customer.toString() !== customerId) {
        return res.status(403).json({
          status: 403,
          message: "You do not own this borrowing!",
        });
      }

      const updatedBorrowing = await borrowingModel.findByIdAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      );

      if (!updatedBorrowing) {
        return res
          .status(400)
          .json({ status: 400, message: "Borrowing was not updated!" });
      }


      res
        .status(200)
        .json({ status: 200, message: "Borrowing updated successfully" });
    } else {
      res.status(403).json({
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


//  Borrowing Delete - DELETE
export const deleteBorrowing = async (req, res) => {
  try {
    const role = req.user.role;
    const id = req.params.id; 

    if (role !== "customer") {

      const customerId = req.user.id;

      // Check if the customer exists
      const customer = await userModel.findById({ _id: customerId });

      if (!customer) {
        return res
          .status(404)
          .json({ status: 404, message: "The customer not found" });
      }

      const borrowing = await borrowingModel.findById(id);

      if (!borrowing) {
        return res.status(404).json({
          status: 404,
          message: "The Borrowing not found",
        });
      }

      // Remove the ownership check
      // if (borrowing.customer.toString() !== customerId) {
      //   return res.status(403).json({
      //     status: 403,
      //     message: "You do not own this borrowing!",
      //   });
      // }

      const deletedBorrowing = await borrowingModel.findByIdAndDelete(id);

      if (!deletedBorrowing) {
        return res
          .status(400)
          .json({ status: 400, message: " Borrowing was not deleted" });
      }

      res
        .status(200)
        .json({ status: 200, message: " Borrowing deleted successfully" });
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


// Get transactions and search filter - GET
export const getTransactions = async (req, res) => {
  try {
    const search = req.query;

    const transaction = await transactionModel
      .find(search)
      .sort({ createdAt: -1 })
      .populate("admin", "name email avatar");

    if (transaction.length === 0) {
      return res.status(404).json({ status: 404, message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get transaction by id
export const getTransaction = async (req, res) => {
  try {
    const transaction = await transactionModel
      .findById(req.params.id)
      .populate("admin", "name email avatar");

    if (!transaction) {
      return res.status(404).json({ status: 404, message: "Transaction not found" });
    }

    res.status(200).json({

      status: 200,
      message: "Transaction found successfully",
      data: transaction,

    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });

  }
}

// create transaction - POST
export const createTransaction = async (req, res) => {
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

      const transaction = await transactionModel.create({
        ...req.body,
        admin: adminId,
      });

      if (!transaction) {
        return res
          .status(400)
          .json({ status: 400, message: "Transaction was not created" });
      }

      res.status(201).json({
        status: 201,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }

};

// update transaction - PUT
export const updateTransaction = async (req, res) => {
    try {
      const id = req.params.id;
      const role = req.user.role;

      if (role === "admin") {
        res.status(403).json({
          status: 403,
          message: "You don't have permission",
        });
      }

      const transaction = await transactionModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!transaction) {
        return res
          .status(400)
          .json({ status: 400, message: "Transaction was not updated" });
      }

      res
        .status(200)
        .json({ status: 200, message: "Transaction updated successfully" });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      })
    }
}

// transaction Delete - DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const role = req.user.role;
    const id = req.params.id;


    if (role === "admin") {
      res.status(403).json({
        status: 403,
        message: "You don't have permission",
      })
    }

    const transaction = await transactionModel.findByIdAndDelete(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ status: 404, message: "Transaction not found" });

    }

    res
      .status(200)
      .json({ status: 200, message: "Transaction deleted successfully" });

  } catch (error) {
    
    res.status(500).json({
      
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}










