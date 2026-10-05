import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find({
      status: "issued",
    }).sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get issued transactions error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch issued transactions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
