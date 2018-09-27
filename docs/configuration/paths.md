# Paths

The paths you configure defines the entry points for fetching transformed images from SpaceChop. Under the hood SpaceChop uses [path-to-regex](https://github.com/pillarjs/path-to-regexp) to transform the incoming requests URL to a set of parameters that will be used to fetch and transform the original image.

You can use [http://forbeslindesay.github.io/express-route-tester/](http://forbeslindesay.github.io/express-route-tester/) to play around with different type of paths to see which parameters they resolve to. **Make sure to use package version 2.0.0** to get the appropriate results.

If you require multiple different paths that are very different you can define several paths in the configuration.

## Examples

```yaml
paths:
  # ex. https://example.com/images/t_thumb/cat.jpeg
  - /images/:preset/:image
  
  # If originals are stored without an extension but you want
  # to fetch them with an extension
  # ex. https://example.com/image/cat.jpeg
  - /images/:preset/:image(\w+).(.*)

```

