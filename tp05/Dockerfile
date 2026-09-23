FROM node:26-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "start:dev"]
