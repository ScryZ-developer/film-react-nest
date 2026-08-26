# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci \
  && npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build

# Production stage: static files for nginx volume
FROM alpine:3.20 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "cp -r /app/dist/. /usr/share/nginx/html/"]
