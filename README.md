# FutureKey � Plataforma de Analise Digital

FutureKey � uma plataforma de analise de perfis do Instagram, com edicao de dados e visualizacao de metricas. Projeto organizado em frontend (React) e backend (Node/Express + MongoDB).

## Visao em camadas
```
+------------------+       +-----------------------------+
�  Frontend (Vite) �  -->  �  Backend (Express + Mongoose)�
�  Pages/Components�       �  Controllers + Services      �
+------------------+       +------------------------------+
                                       �
                                       ?
                                MongoDB (InstagramUsers)
```

### Fluxo principal (Analytics)
```
Usuario -> /analytics (React)
        -> GET /api/instagram/analytics/:username
        -> Controller le Mongo e retorna: best time, medias, distribuicao de midia
        -> Frontend exibe KPIs, graficos e tabela de posts (com filtros de data)
```

### Fluxo de gestao (Companies)
```
Usuario -> /companies (React)
        -> GET /api/instagram/search?q= (lista empresas/usuarios)
        -> GET /api/instagram/:username (detalhe)
        -> PUT /api/instagram/:username (atualiza perfil + posts)
        -> POST /api/instagram/seed (criacao/atualizacao rapida)
```

## Estrutura do repo
```
futurekey-react-node/
+- backend/        # Node.js + Express + MongoDB
+- frontend/       # React (Vite) + React Router + Recharts
```

## Funcionalidades
- Busca de perfis/empresas e edicao de posts (tabela, filtros de data).
- Pagina de Analytics com KPIs, graficos (area, donut), filtro por periodo e melhor horario.
- Pagina de Companies unificada (criar/editar usuario, nome da empresa, foto e posts).
- Auth + rotas protegidas (redirect de Home para Companies quando logado).

## Configuracao
1) Crie os `.env` em backend e frontend (copie exemplos se existir).
2) Instale dependencias:
```
cd backend && npm install
cd ../frontend && npm install
```
3) Rode em desenvolvimento (dois terminais):
```
cd backend && npm start          # http://localhost:4000
cd frontend && npm run dev       # http://localhost:5173
```
> Producao: `npm run build` no frontend e sirva os estaticos pelo backend (ver `backend/src/server.js`).

## Endpoints (resumo)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Instagram/Companies**:
  - `GET /api/instagram/search?q=` � lista empresas/usuarios
  - `GET /api/instagram/:username` � detalhe
  - `PUT /api/instagram/:username` � atualizar perfil + posts
  - `POST /api/instagram/seed` � criar/atualizar rapido
  - `GET /api/instagram/analytics/:username` � metricas

## Frontend
- **Pages**: Home (hero), Analytics (busca + graficos), Companies (CRUD de empresas/posts), Login.
- **Components**: InstagramInsightsOverview (graficos e KPIs), layout com gradientes e efeitos modernos.
- **Context**: `AuthContext` para proteger rotas e redirecionar logados para Companies.

## Checklist rapido
- [ ] Preencher `.env` do backend (Mongo, JWT, RapidAPI se necessario).
- [ ] Preencher `.env` do frontend (ex: `VITE_API_BASE=http://localhost:4000`).
- [ ] `npm start` no backend e `npm run dev` no frontend.
- [ ] Criar/editar empresas e posts em `/companies` e validar metricas em `/analytics`.
