import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { connect } from "@/utils/config/dbConfig";

export default async function POST(req: Request) {
  await connect();

  const { userId, content } = await req.json();

  if (!userId || !content) {
    return new Response(JSON.stringify({ error: "Missing userId or content" }), {
      status: 400,
    });
  }

  const deleted = await SavedMessageModel.deleteOne({ userId, content });

  if (deleted.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Message not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: "Message unsaved" }), {
    status: 200,
  });
}
