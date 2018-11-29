#!/bin/bash
docker stop ant-vue-blog-service
docker rm ant-vue-blog-service
docker rmi ant-vue-blog-service
docker image build -t ant-vue-blog-service .
docker container run --name ant-vue-blog-service  -d -p 7001:7001  -v /root/code/AntEggBlogService/app/public/img:/app/app/public/img -it ant-vue-blog-service
