import { auth } from "@clerk/nextjs";
import Replicate from "replicate";

import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new Response("Free trail has expired", { status: 403 });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    if (!isPro) {
      await increaseApiLimit();
    }

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.log(`[MUSIC_ERROR] ${error}`);
    return new Response(`Internal Error ${error}`, { status: 500 });
  }
}
