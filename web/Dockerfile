FROM node:21

ENV TZ=Asia/Tokyo   

COPY ./next /web

WORKDIR /web

RUN npm install

RUN chown -R node:node /web

USER node


# リリース

RUN npm run build

CMD ["npm", "start"]
