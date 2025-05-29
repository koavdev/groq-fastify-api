import aiRoutes from "./ai.route.ts";
import healthRoutes from "./health.route.ts";
import { FastifyTypedInstance } from "../../types.ts";

export default async function (app: FastifyTypedInstance) {
  await app.register(aiRoutes, { prefix: "/ai" });
  await app.register(healthRoutes, { prefix: "/health" });
}