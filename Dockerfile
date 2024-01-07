FROM node:18.7.0-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --production=true
RUN cp -R node_modules prod_node_modules
RUN yarn --production=false
COPY . .

RUN yarn build

FROM node:18.7.0-alpine

ENV NODE_ENV=production
ENV PORT=80

EXPOSE $PORT

WORKDIR /app

COPY package.json .

COPY --from=builder /app/prod_node_modules ./node_modules
COPY --from=builder /app/dist ./dist
