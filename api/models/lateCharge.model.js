import mongoose from "mongoose";
mongoose.options.strictPopulate = false;

const lateChargeSchema = new mongoose.Schema(
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

const lateChargeModel = mongoose.model("lateCharge", lateChargeSchema);
export default lateChargeModel;