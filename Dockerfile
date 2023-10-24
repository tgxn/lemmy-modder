FROM node:18-alpine as build

WORKDIR /app

# install npm deps
COPY package*.json ./
RUN npm ci

# build frontend
COPY ./ .
RUN npm run build

# copy files to run container
FROM nginx:stable-alpine

# copy distribution from build step
COPY --from=build /app/dist /usr/share/nginx/html

# install entrypoint script to /usr/local/bin/
RUN mkdir -p /usr/local/bin/
COPY ./scripts/docker-startup.sh /usr/local/bin/docker-startup.sh
RUN chmod 700 /usr/local/bin/docker-startup.sh

# expose and set entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/usr/local/bin/docker-startup.sh"]
