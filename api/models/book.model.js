import mongoose from "mongoose";
mongoose.options.strictPopulate = false;

const bookSchema = new mongoose.Schema(
  {
  

    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("Book",  bookSchema);

export default bookModel;
