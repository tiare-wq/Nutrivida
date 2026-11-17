FROM node:24-alpine AS build
WORKDIR /nutrivida/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /nutrivida/frontend/dist /usr/share/nginx/html
