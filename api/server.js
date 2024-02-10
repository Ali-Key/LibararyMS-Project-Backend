import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js';
import bookRouter from './routes/book.route.js';


const server = express()

dotenv.config()
server.use(express.json())

const conn = process.env.MONGO_URL || 'mongodb://localhost:27017/LibraryMS';





// connect mongoDB
mongoose.connect(conn ,{
  
}).then(() => {
    console.log("Connected MongoDB")
}).catch((error) => {
    console.log("Connecting MongoDB Error:", error)
})

// routes 
server.use("/api/users/", userRouter)
server.use("/api/books/", bookRouter)











export default server