import { auth } from "@clerk/nextjs";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new Response("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new Response("Messages are required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new Response("Free trail has expired", { status: 403 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    if (!isPro) {
      await increaseApiLimit();
    }

    return new Response(JSON.stringify(response.data.choices[0].message), {
      status: 200,
    });
  } catch (error) {
    console.log(`[CODE_ERROR] ${error}`);
    return new Response(`Internal Error ${error}`, { status: 500 });
  }
}
