# Étape 1 : vite build produit des fichiers statiques dans dist/
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Figé dans le JavaScript au build : c'est le navigateur qui appelle l'API, pas nginx
ARG VITE_API_URL
RUN npm run build

# Étape 2 : nginx sert les fichiers, sans Node
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
