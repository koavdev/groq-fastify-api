import { FastifyInstance } from "fastify";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { projectTool } from '../../../ai/tools/project'
import { companyTool } from '../../../ai/tools/company'

export default async function (app: FastifyInstance) {
    app.get("/", (req, res) => {
        res.status(200).send("urbe.ai")
    })

    app.post<{
        Body: {
            prompt: string;
        }
    }>('/', async (request, reply) => {
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
        console.log(response.text)
        return { text: response.text }
    });
}