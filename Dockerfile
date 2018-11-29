#FROM node:10.1.0
#COPY . /app
#WORKDIR /app
#RUN npm install --registry=https://registry.npm.taobao.org
#EXPOSE 7001
#CMD npm run start


FROM node:10.1.0

#RUN apk --update add tzdata \
#    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
#    && echo "Asia/Shanghai" > /etc/timezone \
#    && apk del tzdata

RUN mkdir -p /app

WORKDIR /app

# add npm package
COPY package.json /app/package.json

RUN npm i --registry=https://registry.npm.taobao.org

# copy code
COPY . /app

EXPOSE 7001

CMD npm start
