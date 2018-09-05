# Sources

## HTTP Source

The HTTP source fetches original images via GET request.

### Example

```yaml
sources:
  - http:
      root: https://example.com/assets/:image
```

### Options

| Name |  |
| :--- | :--- |
| root | The url of original image.**Type:** string with parameters**Required** |

## S3 Source

The S3 sources fetches original images from a S3 bucket. Can also be used for Digital Ocean spaces, by changing the endpoint.

### Example

```yaml
sources:
  - s3:
      access_key_id: 'xxxx'
      secret_access_key: 'yyy'
      region: 'nyc3'
      bucket_name: 'my-bucket'
      path: 'originals/:image'
```

### Options

| Name |  |
| :--- | :--- |
| access\_key\_id | Access key id from S3 **Type:** string**Required** |
| secret\_access\_key | Secret access key from S3**Type:** string**Required** |
| region | Region of S3 bucket**Type:** string**Required** |
| bucket\_name | Name of bucket**Type:** string**Required** |
| path | Path of the original image in the bucket**Type:** string with parameters**Required** |
| endpoint | Which endpoint to use, useful if using Digital Ocean Spaces.**Type:** string**Default:** derived from bucket\_name and region, as per AWS standard. |

## Volume Source

The volume sources fetches original image from disk.

### Example

```yaml
sources:
  - volume:
      root: /mnt/images/:image
```

### Options

| Name |  |
| :--- | :--- |
| root | The path of the original image on disk**Type:** string with parameters**Required** |



