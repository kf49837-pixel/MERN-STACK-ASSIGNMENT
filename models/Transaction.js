import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["issued", "returned"],
      default: "issued",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;