import { PrismaClient } from "@prisma/client";

declare global {
  var primsa: PrismaClient | undefined;
}

const primsaDb = globalThis.primsa || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.primsa = primsaDb;

export default primsaDb;
