FROM node
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 7001
CMD npm run start
