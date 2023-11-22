FROM node:20

USER node
WORKDIR /home/node

COPY . .
# RUN npm install

CMD node main.js
