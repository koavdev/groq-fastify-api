import fastify from "fastify";
import buildServer from './server.ts'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from '../src/routes/index.ts'
import cors from '@fastify/cors'
import { createGroq } from '@ai-sdk/groq'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";

const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
}).withTypeProvider<ZodTypeProvider>();

await app.register(cors, {
    origin: '*',
    credentials: true
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(buildServer);

await app.register(fastifySwagger, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Groq Fastify API',
            description: 'Testing the Groq API',
            version: '0.1.0'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Development server'
            }
        ],
        tags: [
            { name: 'ai', description: 'Groq API' },
            { name: 'health', description: 'Health Check' },
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header'
                }
            }
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
    },
    transform: jsonSchemaTransform
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



