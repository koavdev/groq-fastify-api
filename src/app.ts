import fastify from "fastify";
import buildServer from './server.ts'
import { createGroq } from '@ai-sdk/groq'
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from '../src/routes/index.ts'

const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
}).withTypeProvider<ZodTypeProvider>();


app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


await app.register(buildServer);

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Groq Fastify API',
            version: '1.0.0',
        }
    }
})

await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

await app.register(routes)

createGroq({ apiKey: process.env.GROQ_API_KEY });


try {
    await app.listen({
        port: Number(process.env.PORT),
        host: "0.0.0.0"
    });
    console.log(`Server running at http://localhost:${process.env.PORT}`);
} catch (err) {
    app.log.error(err);
    process.exit();
}



