import { SavedMessageModel } from "@/utils/models/SavedMessage";
import { connect } from "@/utils/config/dbConfig";
import { verifyRequest } from "@/utils/auth/verifyRequest";

export async function GET(req: Request) {
  await connect();

  const session = await verifyRequest();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = new URL(req.url).searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  if (session.email !== userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const messages = await SavedMessageModel.find({ userId }).sort({
    savedAt: -1,
  });

  return new Response(JSON.stringify({ messages }), {
    status: 200,
  });
}
