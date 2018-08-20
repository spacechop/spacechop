FROM node:10-alpine

#2 Add Edge and bleeding repos
# add the edge repositories
RUN echo "@edge-testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    echo "@edge-community http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN mkdir /src
WORKDIR /src

ADD /bin/CMakeLists.txt /bin/CMakeLists.txt
ADD /bin/facedetect.cpp /bin/facedetect.cpp
ADD scripts/install_deps.sh /install_deps.sh
RUN sh /install_deps.sh

ADD package.json /src/package.json
RUN npm install

ADD nodemon.json /src/nodemon.json
ADD tsconfig.json /src/tsconfig.json

ADD src/. /src/app

EXPOSE 80
CMD npm start
