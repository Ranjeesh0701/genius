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
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
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
    console.log(`[VIDEO_ERROR] ${error}`);
    return new Response(`Internal Error ${error}`, { status: 500 });
  }
}