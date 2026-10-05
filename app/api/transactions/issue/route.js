import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Book from "@/models/Book";
import Member from "@/models/Member";
import Transaction from "@/models/Transaction";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { bookId, memberId } = body;

    if (!bookId || !memberId) {
      return Response.json(
        {
          success: false,
          message: "Book ID and Member ID are required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid book ID or member ID",
        },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return Response.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return Response.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    if (book.availableQuantity <= 0) {
      return Response.json(
        {
          success: false,
          message: "Book is currently unavailable",
        },
        { status: 400 }
      );
    }

    const activeTransaction = await Transaction.findOne({
      book: bookId,
      member: memberId,
      status: "issued",
    });

    if (activeTransaction) {
      return Response.json(
        {
          success: false,
          message: "This book is already issued to this member",
        },
        { status: 400 }
      );
    }

    book.availableQuantity -= 1;
    await book.save();

    const transaction = await Transaction.create({
      book: bookId,
      member: memberId,
      issueDate: new Date(),
      status: "issued",
    });

    const populatedTransaction = await Transaction.findById(
      transaction._id
    )
      .populate("book")
      .populate("member");

    return Response.json(
      {
        success: true,
        message: "Book issued successfully",
        transaction: populatedTransaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Issue book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to issue book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}