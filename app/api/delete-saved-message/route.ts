import { NextRequest } from "next/server";
import { connect } from "@/utils/config/dbConfig";
import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { verifyRequest } from "@/utils/auth/verifyRequest";

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const session = await verifyRequest();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { messageId, userId } = await req.json();

    if (!messageId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing messageId or userId" }),
        { status: 400 }
      );
    }

    if (session.email !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const deleted = await SavedMessageModel.findOneAndDelete({
      _id: messageId,
      userId,
    });

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: "Message not found or not authorized" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error deleting saved message:", err);
    return new Response(
      JSON.stringify({ error: "Failed to delete message" }),
      { status: 500 }
    );
  }
}
