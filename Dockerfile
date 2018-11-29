FROM node:10.1.0
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 7001
CMD npm run start
