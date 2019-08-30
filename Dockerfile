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

ADD tsconfig.json /src/tsconfig.json
ADD nodemon.json /src/nodemon.json

ADD src/. /src/app

# If building for production
# - build babel to dist folder
# - remove dev dependencies
ARG env=production
ADD scripts/build_production.sh /build_production.sh
RUN if [ "${env}" = "production" ] ; then sh /build_production.sh ; fi

# Set default image magick policy
ENV MAGICK_MEMORY_LIMIT=2GiB \
  MAGICK_MAP_LIMIT=4GiB \
  MAGICK_DISK_LIMIT=16GiB \
  MAGICK_AREA_LIMIT=100MP \
  MAGICK_HEIGHT_LIMIT=10KP \
  MAGICK_WIDTH_LIMIT=10KP \
  MAGICK_THREAD_LIMIT=4 \
  MAGICK_THROTTLE_LIMIT=0 \
  MAGICK_TIME_LIMIT=3600

# Default empty config to prevent docker volumes
# to create a directory instead of a file
RUN touch /config.yml
EXPOSE 80
CMD npm start
