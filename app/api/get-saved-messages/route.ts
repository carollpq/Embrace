import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { connect } from "@/utils/config/dbConfig";

export async function GET(req: Request) {
  await connect();

  const userId = new URL(req.url).searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  const messages = await SavedMessageModel.find({ userId }).sort({
    savedAt: -1,
  });

  return new Response(JSON.stringify({ messages }), {
    status: 200,
  });
}
