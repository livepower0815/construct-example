# build stage
FROM XXX.XXX.XXX:5000/frontend-base:node-14.17.0-alpine-git as build-stage
WORKDIR /app
ARG VITE_BUILD_MODE
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm@6.24.4 && \
		pnpm install

COPY . .
RUN pnpm run build -- --mode ${VITE_BUILD_MODE}

# production stage
FROM XXX.XXX:5000/frontend-base:nginx-1.20.1-stable-alpine as production-stage
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
		ln -sf /dev/stderr /var/log/nginx/error.log

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
