# [SpaceChop](https://spacechop.com) [![Build Status](https://travis-ci.org/spacechop/spacechop.svg?branch=master)](https://travis-ci.org/spacechop/spacechop) [![Docker](https://img.shields.io/badge/docker-spacechop/spacechop-blue.svg)](https://hub.docker.com/r/spacechop/spacechop/) [![Docker Registry](https://img.shields.io/docker/pulls/spacechop/spacechop.svg)](https://hub.docker.com/r/spacechop/spacechop/) [![](https://images.microbadger.com/badges/image/spacechop/spacechop.svg)](https://microbadger.com/images/spacechop/spacechop "Get your own image badge on microbadger.com")
SpaceChop is a Docker container for processing your images through HTTP requests.

**🔒 Secure** - Dont allow everyone to create arbitrary image transformations and overload your server.

**📦 Storage** - Store original and transformed images on the infrastructure you are already using. For example Amazon S3, HTTP server, or local volume.

**👨‍💻 For developers** - Set up available transformations via yaml files.

At [spacechop.com](https://spacechop.com), you can get for the hosted solution of SpaceChop which includes CDN, storage, caching, database, statistics and analytics for your service.

To get started with SpaceChop, [**go to our documentation website**](https://spacechop.gitbook.io/spacechop/).

## Installation
The recommended way to use SpaceChop is via docker-compose:

`docker-compose.yml`
```yaml
version: '3'
services:
  spacechop:
    container_name: spacechop
    image: spacechop/spacechop:latest
    ports:
      - 8080:3000
    volumes:
      - ./config.yml:/config.yml
```

`config.yml`
```yaml
paths:
  - /:preset/:image(.*)
sources:
  - http:
      root: https://upload.wikimedia.org/wikipedia/commons/:image
presets:
  # fill 200x200 with type jpeg and compress with quality 0.9
  t_200:
    steps:
      - $fill:
          width: 200
          height: 200
      - $format:
          type: jpeg
      - $compress:
          quality: 90

```

```sh
# start the service using docker-compose
docker-compose up -d

# check the logs for help with your configuration and see what's happening
docker-compose logs -f spacechop
```

Go to `http://localhost:8080/t_200/c/c4/Photo_Wallet_product.jpg` in your browser and you should see an image fetched from Wikimedia and transformed with the above preset `t_200`. 
**You just successfully transfomed your first image using SpaceChop!**

## Getting started

You will at least need a path, source and preset to get started.

### paths and sources

Paths and sources are interlinked and work together using [`path-to-regex`](https://github.com/pillarjs/path-to-regexp) with support for ()-matching groups. Use the path [express-route-tester](http://forbeslindesay.github.io/express-route-tester/) with version **2.0.0** to see what works.

Basically how it works is that the path you request at http://localhost:8080/t_200/your-unique-path/with-slashes/to-and-image-url.jpg will look through your sources until it finds an image for your root url (if you are using the http source).

i.e.  
http://localhost:8080/t_200/your-unique-path/with-slashes/to-and-image-url.jpg
will in the above configuration look at:
http://commons.wikipedia.org/your-unique-path/with-slashes/to-and-image-url.jpg

Notice the usage of :image in paths and sources, you can change this to whatever makes sense for you in your matching. You can use your own variable names and matching in your sources.

Each source has its own set of configuration to be able to lookup and download originals. You can [read more about each source in our documentation](https://spacechop.gitbook.io/spacechop/).

### presets

As you might have seen there is a :preset variable in the path in the example configuration above, this is the only required variable in path that there is, and this will match the exact name of your preset in the configuration as you might have guessed.

In a preset there are steps which are composed of a list of operations with their unique set of options. You can [read more about each operation in our documentation](https://spacechop.gitbook.io/spacechop/).

## Contributing

[![codecov](https://codecov.io/gh/spacechop/spacechop/branch/master/graph/badge.svg)](https://codecov.io/gh/spacechop/spacechop) [![Greenkeeper badge](https://badges.greenkeeper.io/spacechop/spacechop.svg)](https://greenkeeper.io/)

[Read the SpaceChop Contributor Guidelines.](CONTRIBUTING.md)

Running tests locally:

```
sh test.sh
```

or manually using docker-compose

```
docker-compose up -d --build
docker-compose exec spacechop sh -c "npm run test:watch"
```

This project uses TypeScript for static typing and TSLint for linting. You can get both of these built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
