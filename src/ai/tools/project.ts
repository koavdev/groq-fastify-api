import { tool } from "ai"
import z from 'zod'

export const projectTool = tool({
    description: `
        Realiza requisições para buscar informações de projetos via API REST.

        Só pode realizar operações de busca (GET), não é permitido realizar operações de escrita.

        Endpoint base:
        http://localhost:8002/api/admin/project/

        A entidade project é definida a partir do script SQL abaixo:

        """
        CREATE TABLE public.project_project (
            id bigint NOT NULL,
            deleted boolean NOT NULL,
            created timestamp with time zone NOT NULL,
            updated timestamp with time zone NOT NULL,
            slug character varying(255) NOT NULL,
            name character varying(128) NOT NULL,
            category character varying(6),
            modality character varying(16),
            layout character varying(10),
            use character varying(11),
            total_potential_sales_value numeric(15,2),
            built_area numeric(15,2),
            land_area numeric(15,2),
            has_incorporation_registration boolean,
            expected_date_for_registration date,
            construction_status character varying(11) NOT NULL,
            construction_expected_start_date date,
            construction_expected_end_date date,
            construction_start_date date,
            sales_status character varying(11) NOT NULL,
            sales_expected_start_date date,
            sales_expected_end_date date,
            sales_start_date date,
            land_acquisition_date date,
            private_project_visualization boolean NOT NULL,
            private_visualization_password character varying(36),
            form_step character varying(5),
            address_id bigint NOT NULL,
            company_id bigint NOT NULL,
            registry_office_address_id bigint NOT NULL,
            spe_id bigint,
            is_draft boolean NOT NULL
        );
        """

        Todas as operações devem retornar um máximo de 50 itens.
    `.trim(),
    parameters: z.object({
        id: z.number().optional().describe('ID do projeto a ser buscado. Se não informado, retorna lista de projetos'),
        name: z.string().optional().describe('Nome do projeto a ser buscado. Se não informado, retorna lista de projetos'),
    }),
    execute: async ({ id, name }) => {7
        console.log(id, name)
        let url = "http://localhost:8002/api/admin/project/"
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
            // Se o nome foi passado, filtra pelo nome (case insensitive)
            let filtered = data.results;
            if (name) {
                filtered = filtered.filter(
                    (p) => p.name.toLowerCase().includes(name.toLowerCase())
                );
            }
            // Reduz para campos essenciais
            const reduced = filtered.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                land_area: p.land_area,
                built_area: p.built_area,
                url: p.url,
                address: p.address
                    ? {
                        street: p.address.street,
                        number: p.address.number,
                        city: p.address.city,
                        neighborhood: p.address.neighborhood,
                        postal_code: p.address.postal_code
                    }
                    : null
            }));
            // Retorna só os 5 primeiros para não estourar o contexto
            return JSON.stringify(reduced.slice(0, 5));
        }

        // Se for um projeto único, reduz campos
        if (data && data.id) {
            const reduced = {
                id: data.id,
                name: data.name,
                slug: data.slug,
                land_area: data.land_area,
                built_area: data.built_area,
                url: data.url,
                address: data.address
                    ? {
                        street: data.address.street,
                        number: data.address.number,
                        city: data.address.city,
                        neighborhood: data.address.neighborhood,
                        postal_code: data.address.postal_code
                    }
                    : null
            };
            return JSON.stringify(reduced);
        }

        // Caso não encontre nada
        return JSON.stringify([]);
    }
})