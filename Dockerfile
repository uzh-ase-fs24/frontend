FROM node:alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install -g ionic
RUN npm install

COPY ./ /app/
EXPOSE 8100
CMD ["ionic", "serve", "--external", "0.0.0.0", "--no-open"]