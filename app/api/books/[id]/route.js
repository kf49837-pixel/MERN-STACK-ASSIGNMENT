import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Book from "@/models/Book";
import Transaction from "@/models/Transaction";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid book ID",
        },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);

    if (!book) {
      return Response.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid book ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      author,
      category,
      ISBN,
      quantity,
      availableQuantity,
      publicationYear,
    } = body;

    if (
      !title ||
      !author ||
      !category ||
      !ISBN ||
      quantity === undefined ||
      availableQuantity === undefined ||
      publicationYear === undefined
    ) {
      return Response.json(
        {
          success: false,
          message: "All book fields are required",
        },
        { status: 400 }
      );
    }

    if (Number(quantity) < 0 || Number(availableQuantity) < 0) {
      return Response.json(
        {
          success: false,
          message: "Quantity cannot be negative",
        },
        { status: 400 }
      );
    }

    if (Number(availableQuantity) > Number(quantity)) {
      return Response.json(
        {
          success: false,
          message: "Available quantity cannot be greater than total quantity",
        },
        { status: 400 }
      );
    }

    const existingBook = await Book.findOne({
      ISBN: ISBN.trim(),
      _id: { $ne: id },
    });

    if (existingBook) {
      return Response.json(
        {
          success: false,
          message: "Another book with this ISBN already exists",
        },
        { status: 409 }
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        ISBN: ISBN.trim(),
        quantity: Number(quantity),
        availableQuantity: Number(availableQuantity),
        publicationYear: Number(publicationYear),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return Response.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Update book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid book ID",
        },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);

    if (!book) {
      return Response.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    const transactionExists = await Transaction.exists({
      book: id,
    });

    if (transactionExists) {
      return Response.json(
        {
          success: false,
          message:
            "This book cannot be deleted because it has transaction history",
        },
        { status: 409 }
      );
    }

    await Book.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Delete book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
