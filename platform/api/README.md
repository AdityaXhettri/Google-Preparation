# google-prep-api

Backend for the prep platform. Just chatbot + notes API.

## Run

```bash
bun install
cp .env.example .env
# edit .env with your Gemini key
bun run dev
```

Listens on port 3001.

## Endpoints

- `GET /health` → `{ status: "ok" }`
- `POST /api/chat` → `{ question }` → `{ answer, sessionId }`
- `GET /api/note?path=...` → reads markdown from `../Google-Preparation/`