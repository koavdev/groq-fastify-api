import { FastifyReply } from "fastify"
import { FastifyTypedInstance } from "../../types.ts"

export default async function (app: FastifyTypedInstance) {
    app.get("/", {
        schema: {
            tags: ['health'],
            description: 'Health check'
        }
    }, (_, reply: FastifyReply) => {
        reply.status(200).send({ health: "check"})
    })
}