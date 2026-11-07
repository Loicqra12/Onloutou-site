# API ONLOUTOU - image portable (Render, DigitalOcean App Platform, Droplet).
# Le contexte de build est la RACINE du depot (workspaces npm) :
#   docker build -f backend/Dockerfile -t onloutou-api .
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci -w @onloutou/backend --ignore-scripts
COPY backend/prisma ./backend/prisma
COPY backend/tsconfig.json backend/tsconfig.build.json ./backend/
COPY backend/scripts ./backend/scripts
COPY backend/src ./backend/src
WORKDIR /app/backend
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci -w @onloutou/backend --omit=dev --ignore-scripts
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/backend/dist ./backend/dist
COPY backend/prisma ./backend/prisma
WORKDIR /app/backend
# Render fournit PORT ; l'API le lit deja (defaut 4000).
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
