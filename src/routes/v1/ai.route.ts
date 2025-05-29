import { FastifyReply, FastifyRequest } from "fastify"
import { FastifyTypedInstance } from "../..//types.ts"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { projectTool } from "../../ai/tools/project.ts"
import { companyTool } from "../../ai/tools/company.ts"
import z from 'zod'

export default async function (app: FastifyTypedInstance) {
  app.post('/answer', {
        schema: {
            tags: ['ai'],
            description: 'Ask a question to AI',
            body: z.object({
                prompt: z.string()
            })
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { prompt } = request.body;
        const response = await generateText({
            model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
            prompt,
            tools:   { 
                project: projectTool,
                company: companyTool,
            },
            system: `
                Você é um agente de IA que responde dúvidas sobre empreendimentos imobiliários.
                Responda apenas o que for pedido, em markdown.
            `.trim(),
            maxSteps: 5
        });
        reply.status(201).send({ text: response.text })
    });

       app.get("/", {
        schema: {
            tags: ['ai'],
            description: 'GET AI'
        }
    }, (_, reply: FastifyReply) => {
        reply.status(200).send("urbe.ai")
    })
}
