import { FastifyTypedInstance } from "../types.ts";
import v1Routes from "../../src/routes/v1/index.ts";

export default async function (app: FastifyTypedInstance) {
  await app.register(v1Routes, { prefix: "/api/v1" });
}