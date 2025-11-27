
# FutureKey — React + Node (Monorepo)

SaaS monolítico com **3 integrações**:
- **Análise Instagram**: RapidAPI (Instagram Scraper Stable API)
- **Agendamento**: Google Calendar (OAuth2)
- **Pagamentos**: Stripe (Checkout)

Banco de dados: **MongoDB Atlas** (free).

## Estrutura
```
futurekey-react-node/
├─ backend/        # Node.js + Express + Mongo + JWT
└─ frontend/       # React (Vite) + Axios + React Router
```

## Passos rápidos
1) Copie os `.env.example` para `.env` (backend e frontend) e preencha.
2) Instale deps:
```
cd backend && npm install
cd ../frontend && npm install
```
3) Dev:
```
# Em dois terminais
cd backend && npm start
cd frontend && npm run dev
```
Backend: http://localhost:4000  
Frontend (Vite): http://localhost:5173

> Produção: faça build do frontend e sirva os arquivos estáticos pelo backend (ver `backend/src/server.js`).

## Integrações
- **RapidAPI**: defina `RAPIDAPI_HOST` e `RAPIDAPI_KEY` no `.env` do backend.
- **Google**: crie OAuth Client (Web), ative Calendar API e use o redirect do `.env` (`/api/google/auth/callback`).
- **Stripe**: crie 3 Prices (Starter/Pro/Agency) e cole os IDs no `.env`. Use `STRIPE_SECRET_KEY` de teste.
- **MongoDB Atlas**: crie um cluster gratuito, pegue a `MONGO_URI` e cole no backend `.env`.

## Endpoints principais (backend)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Instagram**: `GET /api/instagram/posts?username=...`, `GET /api/instagram/best-post-time?username=...`
- **Google**: `GET /api/google/auth/url`, `GET /api/google/auth/callback`, `POST /api/google/meetings`
- **Meetings (local log)**: `GET/POST /api/meetings`
- **Billing**: `POST /api/billing/checkout`, `POST /api/billing/webhook`
