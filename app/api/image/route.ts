import { auth } from "@clerk/nextjs";
import { Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body.values;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new Response("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new Response("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new Response("Resolution is required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new Response("Free trail has expired", { status: 403 });
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    if (!isPro) {
      await increaseApiLimit();
    }

    return new Response(JSON.stringify(response.data.data), {
      status: 200,
    });
  } catch (error) {
    console.log(`[IMAGE_ERROR] ${error}`);
    return new Response(`Internal Error ${error}`, { status: 500 });
  }
}
