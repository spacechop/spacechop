FROM node:10-alpine

#2 Add Edge and bleeding repos
# add the edge repositories
RUN echo "@edge-testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    echo "@edge-community http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN mkdir /src
WORKDIR /src

RUN apk update && apk upgrade

# Install dependencies.
RUN apk add --no-cache clang
RUN apk add --no-cache openblas-dev
RUN apk add --no-cache imagemagick

# Install build dependencies.
RUN apk --no-cache add -t .build-deps \
      autoconf \
      automake \
      build-base \
      bzip2 \
      clang-dev \
      cmake \
      curl \
      g++ \
      gcc \
      git \
      libc-dev \
      libpng-dev \
      libtool \
      make \
      nasm \
      pkgconf

# Custom dlib face detection with landmarks (facedetect).
RUN git clone https://github.com/davisking/dlib.git /usr/share/dlib
ADD /bin/CMakeLists.txt /usr/share/dlib/app/CMakeLists.txt
ADD /bin/facedetect.cpp /usr/share/dlib/app/facedetect.cpp
RUN curl -O http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2 && \
    bzip2 -d shape_predictor_68_face_landmarks.dat.bz2 && \
    mkdir -p /usr/share/dlib/build/ && \
    mv shape_predictor_68_face_landmarks.dat /usr/share/dlib/build/shape_predictor_68_face_landmarks.dat && \
    cd /usr/share/dlib/build && \
    cmake \
      -O0 -j3 \
      -D USE_SSE2_INSTRUCTIONS=ON \
      -D USE_AVX_INSTRUCTIONS=1 \
      -D CMAKE_BUILD_TYPE=RELEASE \
      -D CMAKE_INSTALL_PREFIX=/usr \
      ../app && \
    cmake --build . && \
    ln -s /usr/share/dlib/build/facedetect /usr/bin/facedetect

# mozjpeg
RUN cd /opt/ && \
    git clone https://github.com/mozilla/mozjpeg.git tmp && \
    cd tmp && \
    autoreconf -fiv && ./configure -prefix=/opt/mozjpeg && make install && \
    rm -rf /opt/tmp && \
    ln -s /opt/mozjpeg/bin/cjpeg /usr/local/bin/mozjpeg

# gifsicle (giflossy fork)
RUN cd /opt && \
    git clone https://github.com/pornel/giflossy.git tmp && \
    cd tmp && \
    autoreconf -fiv && ./configure -prefix=/opt/gifsicle && make install && \
    rm -rf /opt/tmp && \
    ln -s /opt/gifsicle/bin/gifsicle /usr/local/bin/gifsicle

# pngquant
RUN apk --update add --no-cache \
    --repository "http://dl-cdn.alpinelinux.org/alpine/edge/community" \
    pngquant

# vips
RUN apk --update add --no-cache \
    --repository "http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
    vips-tools

# exiftool
RUN apk --update add --no-cache \
    --repository "http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
    exiftool

RUN apk --no-cache add libpng libstdc++ file
RUN apk -- del .build-deps

ADD package.json /src/package.json
RUN npm install

ADD nodemon.json /src/nodemon.json
ADD tsconfig.json /src/tsconfig.json

ADD src/. /src/app

EXPOSE 80
CMD npm start
