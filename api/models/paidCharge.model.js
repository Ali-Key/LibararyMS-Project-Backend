import mongoose from "mongoose";
mongoose.options.strictPopulate = false;

const paidChargeSchema = new mongoose.Schema(
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

const paidChargeModel = mongoose.model("paidCharge", paidChargeSchema);
export default paidChargeModel