import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'

export default async function (app: FastifyInstance) {
    await app.register(cors, {
        origin: 'http://localhost:3000',
        credentials: true
    })
}