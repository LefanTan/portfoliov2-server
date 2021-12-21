FROM node:16.13.1-alpine3.14

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install 
COPY . .

EXPOSE 3001

CMD ["npm", "run", "serve"]