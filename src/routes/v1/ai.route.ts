import { FastifyReply, FastifyRequest } from "fastify"
import { FastifyTypedInstance } from "../..//types.ts"
import { streamText, UIMessage } from "ai"
import { groq } from "@ai-sdk/groq"
import { projectTool } from "../../ai/tools/project.ts"
import { companyTool } from "../../ai/tools/company.ts"
import z from 'zod'

export default async function (app: FastifyTypedInstance) {
    app.post('/chat', {
        schema: {
            tags: ['ai'],
            description: 'Chat with Groq Fastify API',
            body: z.object({
                messages: z.array(
                    z.object({
                        role: z.string().describe('role'),
                        content: z.string().describe('content')
                    })
                )
            }),
        }
    }, (request: FastifyRequest<{Body: { messages: UIMessage[] }}>, reply: FastifyReply) => {
        const { messages } = request.body;
        const result = streamText({
            model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
            messages,
            tools:   { 
                project: projectTool,
                company: companyTool,
            },
            system: `
                Você é um agente de IA que responde dúvidas sobre empreendimentos imobiliários.
                Responda apenas o que for pedido, em plain text.
            `.trim(),
            maxSteps: 5
        });
        return result.toDataStreamResponse();
    });

    app.get("/", {
        schema: {
            tags: ['ai'],
            description: 'GET AI'
        }
    }, (_, reply: FastifyReply) => {
        reply.status(200).send("Groq Fastify API")
    })
}
