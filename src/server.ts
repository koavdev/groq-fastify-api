import cors from '@fastify/cors'
import { FastifyTypedInstance } from "./types.ts";
import fastifyEnv from '@fastify/env';

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: '3001'
    },
    FRONTEND_PORT: {
      type: 'string',
      default: '3000'
    },
    GROQ_API_KEY: {
        type: 'string'
    }
  }
}

const options = {
  confKey: 'config',
  schema: schema,
  dotenv: true
}

export default async function (app: FastifyTypedInstance) {
  app
    .register(fastifyEnv, options)
    .ready((err) => {
        if (err) console.error(err)
    })

  await app.register(cors, {
      origin: `http://localhost:${process.env.FRONTEND_PORT}`,
      credentials: true
  })

  

}