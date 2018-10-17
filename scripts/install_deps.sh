#!/bin/sh

apk update
apk upgrade

# Install dependencies.
apk add --no-cache imagemagick openblas jq

# Install build dependencies.
apk --no-cache add -t .build-deps \
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
  pkgconf \
  openblas-dev
  clang

# Custom dlib face detection with landmarks (facedetect).
git clone https://github.com/davisking/dlib.git /usr/share/dlib
mkdir -p /usr/share/dlib/app
mv /bin/CMakeLists.txt /usr/share/dlib/app/CMakeLists.txt
mv /bin/facedetect.cpp /usr/share/dlib/app/facedetect.cpp
mkdir -p /usr/share/dlib/build/
cd /usr/share/dlib/build
cmake \
  -O0 -j3 \
  -D USE_SSE2_INSTRUCTIONS=ON \
  -D USE_AVX_INSTRUCTIONS=1 \
  -D CMAKE_BUILD_TYPE=RELEASE \
  -D CMAKE_INSTALL_PREFIX=/usr \
  ../app
cmake --build .
mv /usr/share/dlib/build /usr/share/dlib-build
rm -rf /usr/share/dlib
ln -s /usr/share/dlib-build/facedetect /usr/bin/facedetect

# mozjpeg
cd /opt/
git clone https://github.com/mozilla/mozjpeg.git tmp
cd tmp
autoreconf -fiv
./configure -prefix=/opt/mozjpeg
make install
rm -rf /opt/tmp
ln -s /opt/mozjpeg/bin/cjpeg /usr/local/bin/mozjpeg

# gifsicle (giflossy fork)
cd /opt
git clone https://github.com/pornel/giflossy.git tmp
cd tmp
autoreconf -fiv
./configure -prefix=/opt/gifsicle
make install
rm -rf /opt/tmp
ln -s /opt/gifsicle/bin/gifsicle /usr/local/bin/gifsicle

# pngquant
apk --update add --no-cache \
  --repository "http://dl-cdn.alpinelinux.org/alpine/edge/community" \
  pngquant

# vips
apk --update add --no-cache \
  --repository "http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
  vips-tools

# exiftool
apk --update add --no-cache \
  --repository "http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
  exiftool

apk --no-cache add libpng libstdc++ file
apk -- del .build-deps

# cleanup /tmp
cd /tmp && rm -rf *
