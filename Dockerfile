FROM node:20

USER node
WORKDIR /home/node

COPY --chown=node . .
RUN npm install

CMD node main.js
