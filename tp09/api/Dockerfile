# Étape 1 : construire, avec tous les outils (CLI Nest, CLI Prisma, tsx)
FROM node:26-alpine AS build
WORKDIR /app
# Les dépendances d'abord, pour le cache. Le schéma est requis par le postinstall (prisma generate)
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma/schema.prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build
# Le service migrate tourne sur cette étape : la base doit appartenir à node, comme pour l'API
RUN mkdir -p /app/db && chown node:node /app/db
USER node

# Étape 2 : exécuter, avec le strict nécessaire
FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# --ignore-scripts : sans la CLI Prisma, le postinstall échouerait. On relance seulement le build natif de better-sqlite3
RUN npm ci --omit=dev --omit=optional --ignore-scripts \
 && npm rebuild better-sqlite3 && npm cache clean --force
COPY --from=build /app/dist ./dist
# SQLite écrit la base et son journal dans ce dossier : il doit appartenir à node
RUN mkdir -p /app/db && chown node:node /app/db
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
