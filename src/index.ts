    import fastify from "fastify";
    import buildServer from './server.ts'
    import buildEnv from './env.ts'
    import buildCors from './cors.ts'
    import { createGroq } from "@ai-sdk/groq";

    declare module 'fastify' {
    interface FastifyInstance {
        config: {
        PORT: string
        GROQ_API_KEY: string
        };
    }
    }

    async function run() {
        const app = fastify({
            logger: {
                transport: {
                    target: 'pino-pretty'
                }
            }
        });
        await buildCors(app)
        await app.register(buildEnv);
        await app.register(buildServer);

        const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

        try {
            await app.listen({
                port: Number(process.env.PORT) || 3001,
                host: "0.0.0.0"
            });
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        } catch (err) {
            app.log.error(err);
            process.exit();
        }
    }

    run();