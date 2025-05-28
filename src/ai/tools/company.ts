import { tool } from "ai"
import z from 'zod'

export const companyTool = tool({
    description: `
        Realiza requisições para buscar informações de projetos via API REST.

        Só pode realizar operações de busca (GET), não é permitido realizar operações de escrita.

        Endpoint base:
        http://localhost:8002/api/admin/project/

        A entidade project é definida a partir do script SQL abaixo:

        """
        CREATE TABLE IF NOT EXISTS public.company_company (
            id bigint NOT NULL,
            deleted boolean NOT NULL,
            created timestamp with time zone NOT NULL,
            updated timestamp with time zone NOT NULL,
            slug character varying(255) NOT NULL,
            formal_name character varying(255) NOT NULL,
            fantasy_name character varying(255) NOT NULL,
            document character varying(14),
            site character varying(200),
            type character varying(20) NOT NULL,
            specific_purpose boolean NOT NULL,
            address_id bigint,
            holding_id bigint,
            owner_id bigint NOT NULL,
            foundation_year integer,
            foundation_date date,
            state_registration character varying(20),
        );
        """

        Todas as operações devem retornar um máximo de 50 itens.
    `.trim(),
    parameters: z.object({
        id: z.number().optional().describe('ID da incorporadora a ser buscado. Se não informado, retorna lista de projetos'),
        name: z.string().optional().describe('Nome da incorporadora a ser buscado. Se não informado, retorna lista de projetos'),
    }),
    execute: async ({ id, name }) => {7
        console.log(id, name)
        let url = "http://localhost:8002/api/admin/company/"
        if (id) url += `${id}/`

        const result = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDUyMTA1LCJpYXQiOjE3NDg0NDczMDUsImp0aSI6ImM2MTllNmZjZWQzOTQ3ZDk5YjFlYzI4OWY5OWQzNmE5IiwidXNlcl9pZCI6MTYwMX0.3jGc3wc76bJqtsJF2Pd26nCoBxI61lEio8b79uhmv-g`
            }
        })  
        const data = await result.json()
        console.log(data)
        // Se for lista, filtra e reduz campos
        if (Array.isArray(data.results)) {
            let filtered = data.results;
            if (name) {
                filtered = filtered.filter(
                    (c) =>
                        (c.formal_name && c.formal_name.toLowerCase().includes(name.toLowerCase())) ||
                        (c.fantasy_name && c.fantasy_name.toLowerCase().includes(name.toLowerCase()))
                );
            }
            const reduced = filtered.map(c => ({
                id: c.id,
                slug: c.slug,
                formal_name: c.formal_name,
                fantasy_name: c.fantasy_name,
                document: c.document,
                site: c.site,
                type: c.type,
                specific_purpose: c.specific_purpose,
                address_id: c.address_id,
                holding_id: c.holding_id,
                owner_id: c.owner_id,
                foundation_year: c.foundation_year,
                foundation_date: c.foundation_date,
                state_registration: c.state_registration
            }));
            return JSON.stringify(reduced.slice(0, 5));
        }

        // Se for uma empresa única, reduz campos
        if (data && data.id) {
            const reduced = {
                id: data.id,
                slug: data.slug,
                formal_name: data.formal_name,
                fantasy_name: data.fantasy_name,
                document: data.document,
                site: data.site,
                type: data.type,
                specific_purpose: data.specific_purpose,
                address_id: data.address_id,
                holding_id: data.holding_id,
                owner_id: data.owner_id,
                foundation_year: data.foundation_year,
                foundation_date: data.foundation_date,
                state_registration: data.state_registration
            };
            return JSON.stringify(reduced);
        }

        // Caso não encontre nada
        return JSON.stringify([]);
    }
})