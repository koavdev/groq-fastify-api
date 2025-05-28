import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
    app.get("/", (request, reply) => {
        return { heatlh: "alive" };
    });
}