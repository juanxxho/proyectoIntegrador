FROM node:23-slim

WORKDIR /app

# Copiar el archivo wait-for-it.sh al contenedor
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Copiar tus dependencias y código como ya tenías
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3003

# Usar wait-for-it para esperar a que la base de datos esté lista (ajusta el host y puerto)
CMD ["wait-for-it", "brigadas-db:3306", "--", "npm", "start"]
