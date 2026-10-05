import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    publicationYear: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;