import connectDB from "@/lib/db";
import Book from "@/models/Book";

// =========================
// POST - Add New Book
// =========================
export async function POST(request) {
  try {
    await connectDB();

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
    });

    if (existingBook) {
      return Response.json(
        {
          success: false,
          message: "A book with this ISBN already exists",
        },
        { status: 409 }
      );
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      ISBN: ISBN.trim(),
      quantity: Number(quantity),
      availableQuantity: Number(availableQuantity),
      publicationYear: Number(publicationYear),
    });

    return Response.json(
      {
        success: true,
        message: "Book added successfully",
        book,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add book error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to add book",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================
// GET - Get All Books
// =========================
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    const books = await Book.find(query).sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch books",
        error: error.message,
      },
      { status: 500 }
    );
  }
}