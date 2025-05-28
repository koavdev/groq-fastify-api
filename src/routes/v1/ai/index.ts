import { FastifyInstance } from "fastify";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

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
            model: groq('gemma2-9b-it'),
            prompt,
            // tools:   { postgres: postgresTool },
            system: `
                Você é um agente de IA responsável por responder dúvidas de um empreendimento imobiliário.
                Inclua apenas o que o usuário pediu, sem texto adicional.
                Retorne sempre em markdown, sem \`\`\`.
            `.trim(),
            maxSteps: 5
        });
        console.log(response.text)
        return { text: response.text }
    });
}