import connectDB from "@/lib/db";
import Book from "@/models/Book";
import Member from "@/models/Member";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectDB();

    const totalBooks = await Book.countDocuments();

    const totalMembers = await Member.countDocuments();

    const issuedBooks = await Transaction.countDocuments({
      status: "issued",
    });

    const returnedBooks = await Transaction.countDocuments({
      status: "returned",
    });

    const books = await Book.find({}, {
      availableQuantity: 1,
    });

    const availableBooks = books.reduce(
      (total, book) => total + book.availableQuantity,
      0
    );

    return Response.json({
      success: true,
      dashboard: {
        totalBooks,
        totalMembers,
        issuedBooks,
        returnedBooks,
        availableBooks,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
