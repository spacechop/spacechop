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

ADD packages/. /src/packages
ADD package.json /src/package.json
RUN npm install

ADD tsconfig.json /src/tsconfig.json
ADD nodemon.json /src/nodemon.json

ADD src/. /src/app

# If building for production
# - build babel to dist folder
# - remove dev dependencies
ARG env=production
ADD scripts/build_production.sh /build_production.sh
RUN if [ "${env}" = "production" ] ; then sh /build_production.sh ; fi

# Default empty config to prevent docker volumes
# to create a directory instead of a file
RUN touch /config.yml
EXPOSE 80
CMD npm start
