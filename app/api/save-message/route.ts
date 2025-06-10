import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { NextRequest } from "next/server";
import { connect } from "@/utils/config/dbConfig";

export async function POST(req: NextRequest) {
  await connect();

  const { messageId, userId, content } = await req.json();

  if (!userId || !content) {
    return new Response(JSON.stringify({ error: "Missing userId or content" }), {
      status: 400,
    });
  }

  // Prevent duplicate saves of same message by same user
  const existing = await SavedMessageModel.findOne({ messageId, userId, content });
  if (existing) {
    return new Response(JSON.stringify({ message: "Already saved" }), {
      status: 200,
    });
  }

  await SavedMessageModel.create({ messageId, userId, content });

  return new Response(JSON.stringify({ message: "Message saved successfully" }), {
    status: 200,
  });
}
