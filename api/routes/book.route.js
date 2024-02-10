import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import ValidateBook from "../middleware/ValidateBook.js";
import { createBook, deleteBook, getBooks, updateBook,   } from "../controllers/book.controller.js";

const router = express.Router();

// book routers
router.get("/", getBooks);
router.post("/create", verifyToken, ValidateBook, createBook);
router.put("/update/:id", verifyToken, ValidateBook, updateBook);
router.delete("/delete/:id", verifyToken, deleteBook);



export default router;
