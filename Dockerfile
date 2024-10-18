FROM node:20-alpine as development

WORKDIR /app

COPY . .

RUN npm i

CMD [ "/bin/sh", "-c", "npm run migration:up && npm run start:dev" ]

FROM development as build

WORKDIR /app
RUN npm run build

FROM node:20-alpine as production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/templates ./templates
COPY --from=build /app/dist ./

CMD [ "/bin/sh", "-c", "npm run migration:up && node app.js" ]
