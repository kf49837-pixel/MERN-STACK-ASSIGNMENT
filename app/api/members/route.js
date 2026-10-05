import connectDB from "@/lib/db";
import Member from "@/models/Member";

// =========================
// POST - Add New Member
// =========================
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      phone,
      address,
      membershipDate,
    } = body;

    if (!name || !email || !phone || !address) {
      return Response.json(
        {
          success: false,
          message: "Name, email, phone and address are required",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Response.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    const existingMember = await Member.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingMember) {
      return Response.json(
        {
          success: false,
          message: "A member with this email already exists",
        },
        { status: 409 }
      );
    }

    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      membershipDate: membershipDate || new Date(),
    });

    return Response.json(
      {
        success: true,
        message: "Member added successfully",
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add member error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to add member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================
// GET - Get All Members
// =========================
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const members = await Member.find(query).sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get members error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch members",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
