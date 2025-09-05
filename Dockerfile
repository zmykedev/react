#Step1. Build
#1. Image base
FROM node:20 as build

#2. Crear carpeta de trabajo
WORKDIR /app

#3. Instalar pnpm
RUN npm install -g pnpm

#4. Copiar package.json y package-lock.json
COPY package*.json ./

#5. Instalar dependencias
RUN pnpm install

#6. Copiar el resto del codigo
COPY . .

#7. Build
RUN pnpm run build

#Step2. Servir la app con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




