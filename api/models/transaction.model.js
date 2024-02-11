import mongoose from "mongoose";
mongoose.options.strictPopulate = false;

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    borrowing: {
      type: mongoose.Types.ObjectId,
      ref: "Borrowing",
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
