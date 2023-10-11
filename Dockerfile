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
COPY --from=build /app/dist /usr/share/nginx/html

# expose and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
