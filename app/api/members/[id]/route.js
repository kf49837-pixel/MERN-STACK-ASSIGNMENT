import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Member from "@/models/Member";
import Transaction from "@/models/Transaction";

// =========================
// GET - Get Member By ID
// =========================
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid member ID",
        },
        { status: 400 }
      );
    }

    const member = await Member.findById(id);

    if (!member) {
      return Response.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get member error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================
// PUT - Update Member
// =========================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid member ID",
        },
        { status: 400 }
      );
    }

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
      _id: { $ne: id },
    });

    if (existingMember) {
      return Response.json(
        {
          success: false,
          message: "Another member with this email already exists",
        },
        { status: 409 }
      );
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        membershipDate: membershipDate || new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMember) {
      return Response.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update member error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE - Delete Member
// =========================
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid member ID",
        },
        { status: 400 }
      );
    }

    const member = await Member.findById(id);

    if (!member) {
      return Response.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    const transactionExists = await Transaction.exists({
      member: id,
    });

    if (transactionExists) {
      return Response.json(
        {
          success: false,
          message:
            "This member cannot be deleted because they have transaction history",
        },
        { status: 409 }
      );
    }

    await Member.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Member deleted successfully",
      member,
    });
  } catch (error) {
    console.error("Delete member error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
