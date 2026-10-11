FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:24-bookworm-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json
ENV HOST=0.0.0.0 PORT=4387 DB_PATH=/app/data/nutrivida.sqlite
EXPOSE 4387
CMD ["node","server/index.js"]
