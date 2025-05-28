import {FastifyInstance} from 'fastify';
import { fastifyEnv } from '@fastify/env';

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: '3001'
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

export default async function (app: FastifyInstance) {
  app
    .register(fastifyEnv, options)
    .ready((err) => {
        if (err) console.error(err)
    })
}