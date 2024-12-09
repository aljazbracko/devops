# Gradnja aplikacije
FROM node:20 AS build

WORKDIR /app

# Kopiramo package.json in package-lock.json, da zmanjšamo nepotrebne ponovne gradnje
COPY package.json package-lock.json ./

# Namestimo odvisnosti
RUN npm ci

# Kopiramo ostale datoteke in gradimo aplikacijo
COPY . .
RUN npm run build

# Uporabimo Nginx za serviranje
FROM nginx:alpine

# Kopiramo zgrajene datoteke v Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Nginx posluša na portu 80
EXPOSE 80

# Privzeti ukaz za zagon Nginx strežnika
CMD ["nginx", "-g", "daemon off;"]
