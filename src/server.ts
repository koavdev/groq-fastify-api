import { FastifyTypedInstance } from "./types.ts";
import fastifyEnv from '@fastify/env';

const schema = {
  type: 'object',
  required: [ 'PORT', 'GROQ_API_KEY' ],
  properties: {
    PORT: {
      type: 'string',
      default: '3001'
    },
    BACKEND_TOKEN: {
      type: 'string',
      default: 'secrets'
    },
    BACKEND_URL: {
      type: 'string',
      default: 'http://localhost:8000'
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
  app.register(fastifyEnv, options)
    .ready((err) => {
      if (err) console.error(err)
  })
}