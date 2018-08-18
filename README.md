# [SpaceChop](https://spacechop.com) [![Build Status](https://travis-ci.org/spacechop/spacechop.svg?branch=master)](https://travis-ci.org/spacechop/spacechop)

SpaceChop is a fully-featured image processing microservice with integrations for remote sources in Amazon S3, Digital Ocean Spaces, and more. It allows you to easily transform images through a HTTP get requests. SpaceChop does not use any CDN, storage, database or caching, instead it relies on you to add this in front and behind the processing pipeline.

At [spacechop.com](https://spacechop.com), you can get for the hosted solution of SpaceChop which includes CDN, storage, caching, database, statistics and analytics for your service.

## Installation

To install SpaceChop you need two files:

`config.yml`
```yaml
paths:
  - /:preset/:image(.*)
sources:
  - http:
    root: http://commons.wikipedia.org/:image
presets:
  # fill 200x200 with type jpg and compress with quality 0.9
  t_200:
    steps:
      - $fill:
        width: 200
        height: 200
      - $format:
        type: jpg
      - $compress:
        quality: 0.9
```

`docker-compose.yml`
```yaml
version: '3'
services:
  spacechop:
    container_name: spacechop
    image: spacechop
    ports:
      - 8080:3000
    volumes:
      - ./config.yml:/config.yml
```

```sh
# start the service using docker-compose
docker-compose up -d

# check the logs for help with your configuration and see what's happening
docker-compose logs -f spacechop
```

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

Each source has its own set of configuration to be able to lookup and download originals. You can [read more about each source in our wiki documentation](https://github.com/spacechop/spacechop/wiki).

### presets

As you might have seen there is a :preset variable in the path in the example configuration above, this is the only required variable in path that there is, and this will match the exact name of your preset in the configuration as you might have guessed.

In a preset there are steps which are composed of a list of operations with their unique set of options. You can [read more about each operation in our wiki documentation](https://github.com/spacechop/spacechop/wiki).
