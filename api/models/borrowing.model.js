import mongoose from "mongoose";
mongoose.options.strictPopulate = false;

const borrowingSchema = new mongoose.Schema(
    {
     
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["borrowed", "returned"],
            default: "borrowed",
        },
        book:{
            type: mongoose.Types.ObjectId,
            ref: "Book"
        },
        customer:{
            type: mongoose.Types.ObjectId,
            ref: "User"

        }
      
    },
    { timestamps: true }
);

const borrowingModel = mongoose.model("Borrowing", borrowingSchema);

export default borrowingModel