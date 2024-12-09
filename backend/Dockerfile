# Osnovna slika z Node.js
FROM node:20

# Določimo delovni imenik
WORKDIR /app

# Kopiramo package.json in package-lock.json
COPY package.json package-lock.json ./

# Namestimo odvisnosti
RUN npm ci

# Kopiramo vse preostale datoteke
COPY . .

# Izpostavimo port, ki ga uporablja aplikacija
EXPOSE 3001

# Zagon aplikacije
CMD ["npm", "start"]
