FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push && node api/index.js"]
