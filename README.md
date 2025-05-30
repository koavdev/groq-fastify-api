# Groq Fastify API

A REST API built with Fastify that integrates with the Groq API for natural language processing, using Vercel's AI SDK for response streaming, Zod for schema validation, and Swagger for documentation.

## 🚀 Technologies

- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [Groq API](https://groq.com/) - Natural language API
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - SDK for AI models integration
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript superset
- [Swagger](https://swagger.io/) - API documentation with OpenAPI 3.0

## 📋 Prerequisites

- Node.js 18+
- A Groq API key

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/groq-fastify-api.git
cd groq-fastify-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit the `.env` file and add your Groq API key:
```env
GROQ_API_KEY=your-key-here
PORT=3001
```

## 🚀 Usage

### Development

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## 📝 Endpoints

### POST /api/v1/chat

Send messages to the AI model and receive streaming responses.

**Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "List all project names"
    }
  ]
}
```

### GET /api/v1/health

API health check endpoint.

## 📚 Documentation

Interactive API documentation is available through Swagger UI:

- **Swagger UI**: `http://localhost:3001/docs`
  - Interactive interface for testing endpoints
  - Complete schema documentation
  - Request and response examples

- **OpenAPI/Swagger JSON**: `http://localhost:3001/docs/json`
  - OpenAPI 3.0 specification
  - Ideal for automatic client generation

### Swagger Configuration

The project uses `@fastify/swagger` and `@fastify/swagger-ui` to generate automatic documentation based on Zod schemas and route configurations.

## 🛠️ Available Tools

- **Project Tool**: Fetch real estate project information
- **Company Tool**: Fetch developer company information

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.