import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { connect } from "@/utils/config/dbConfig";

export async function POST(req: Request) {
  await connect();

  const { userId, content, note } = await req.json();

  if (!userId || !content) {
    return new Response(JSON.stringify({ error: "Missing userId or content" }), {
      status: 400,
    });
  }

  // Prevent duplicate saves of same message by same user
  const existing = await SavedMessageModel.findOne({ userId, content });
  if (existing) {
    return new Response(JSON.stringify({ message: "Already saved" }), {
      status: 200,
    });
  }

  await SavedMessageModel.create({ userId, content, note });

  return new Response(JSON.stringify({ message: "Message saved successfully" }), {
    status: 200,
  });
}
