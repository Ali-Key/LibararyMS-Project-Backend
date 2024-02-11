import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import ValidateBook from "../middleware/ValidateBook.js";
import { createBook, createBorrowing, createTransaction, deleteBook, deleteBorrowing, deleteTransaction, getBook, getBooks, getBorrowing, getBorrows, getTransaction, getTransactions, updateBook, updateBorrowing, updateTransaction,   } from "../controllers/book.controller.js";

const router = express.Router();

// book routers
router.get("/getBooks", getBooks);
router.get("/getBook/:id", verifyToken, getBook);
router.post("/createBook", verifyToken, ValidateBook, createBook);
router.put("/updateBook/:id", verifyToken, ValidateBook, updateBook);
router.delete("/deleteBook/:id", verifyToken, deleteBook);

// borrowing routes
router.get("/getBorrows", getBorrows);
router.get("/getBorrow/:id", verifyToken, getBorrowing);
router.post("/BorrowingCreate", verifyToken, createBorrowing);
router.put("/updateBorrowing/:id", verifyToken, updateBorrowing);
router.delete("/deleteBorrowing/:id",verifyToken, deleteBorrowing );


// transaction routers
router.get("/getTransactions", verifyToken , getTransactions);
router.get("/getTransaction/:id",verifyToken ,getTransaction);
router.post("/createTransaction",verifyToken ,createTransaction);
router.put("/updateTransaction/:id", verifyToken, updateTransaction);
router.delete("/deleteTransaction/:id", verifyToken, deleteTransaction);




export default router;
