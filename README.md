# FutureKey — React + Node (monorepo)

SaaS focado em analytics e gestão de conteúdo, com integrações externas:
- **Instagram** (RapidAPI) para métricas.
- **Google Calendar** (OAuth2) para agendamento.
- **Stripe** para billing.
- **MongoDB** para persistência.

## Visão em camadas
```
┌───────────────┐      ┌─────────────────────────────┐
│   Frontend    │      │           Backend            │
│ React + Vite  │      │ Node.js + Express + Mongoose │
├───────────────┤      ├─────────────────────────────┤
│ Pages (UI)    │ ---> │ Controllers/Routes           │
│ Components    │      │  |                          │
│ Hooks/Context │ <--- │ Services (Instagram/Stripe/Google) │
└───────────────┘      └──────────┬──────────────────┘
                                  │
                                  ▼
                           MongoDB (InstagramUsers, Users)
```

### Fluxo principal (Analytics)
```
Usuário -> /analytics (React)
        -> fetch /api/instagram/analytics/:username
        -> Controller chama Mongo e retorna métricas
        -> UI renderiza cards, gráficos e tabela
```

### Estrutura do repo
```
futurekey-react-node/
├─ backend/        # Node.js + Express + MongoDB + JWT
└─ frontend/       # React (Vite) + React Router
```

## Instalação e execução
1) Crie `.env` no backend e frontend (copie de eventuais exemplos).
2) Dependências:
```
cd backend && npm install
cd ../frontend && npm install
```
3) Dev (2 terminais):
```
cd backend && npm start          # http://localhost:4000
cd frontend && npm run dev       # http://localhost:5173
```

> Produção: faça `npm run build` no frontend e sirva os estáticos pelo backend (`backend/src/server.js`).

## Variáveis essenciais (backend)
- `MONGO_URL` ou `MONGO_URI`
- `JWT_SECRET`
- Instagram via RapidAPI: `RAPIDAPI_HOST`, `RAPIDAPI_KEY`
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- Stripe: `STRIPE_SECRET_KEY`, IDs de preços

## Endpoints (resumo)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Instagram**:
  - `GET /api/instagram/search?q=` (listar empresas/usuários)
  - `GET /api/instagram/:username` (detalhe)
  - `PUT /api/instagram/:username` (atualizar perfil + posts)
  - `POST /api/instagram/seed` (criar/atualizar rápido)
  - `GET /api/instagram/analytics/:username` (métricas)
- **Google**: `GET /api/google/auth/url`, `GET /api/google/auth/callback`, `POST /api/google/meetings`
- **Billing**: `POST /api/billing/checkout`, `POST /api/billing/webhook`

## Frontend
- **Pages**: Home (hero + CTA), Analytics (busca + gráficos), Companies (CRUD de empresas/posts), Login.
- **Components**: gráficos (Recharts), cards, layout e estilos modernizados.
- **Context**: `AuthContext` para proteger rotas e redirecionar.

## Checklist rápido
- [ ] Preencher `.env` do backend (Mongo, integrações).
- [ ] Preencher `.env` do frontend (VITE_API_BASE).
- [ ] Rodar `npm start` no backend e `npm run dev` no frontend.
- [ ] Criar empresa/posts em `/companies` e validar métricas em `/analytics`.
