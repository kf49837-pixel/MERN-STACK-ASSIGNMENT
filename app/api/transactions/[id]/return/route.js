import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Book from "@/models/Book";
import Member from "@/models/Member";
import Transaction from "@/models/Transaction";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid transaction ID",
        },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return Response.json(
        {
          success: false,
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }

    if (transaction.status === "returned") {
      return Response.json(
        {
          success: false,
          message: "Book has already been returned",
        },
        { status: 400 }
      );
    }

    const book = await Book.findById(transaction.book);

    if (!book) {
      return Response.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    const member = await Member.findById(transaction.member);

    if (!member) {
      return Response.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    if (book.availableQuantity < book.quantity) {
      book.availableQuantity += 1;
      await book.save();
    }

    transaction.returnDate = new Date();
    transaction.status = "returned";

    await transaction.save();

    return Response.json({
      success: true,
      message: "Book returned successfully",
      transaction: {
        _id: transaction._id,
        book: book,
        member: member,
        issueDate: transaction.issueDate,
        returnDate: transaction.returnDate,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error("Return book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to return book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
