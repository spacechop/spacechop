# Sources

## HTTP Source

The HTTP source fetches original images via GET request.

### Example

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
sources:
  - http:
      root: https://example.com/assets/:image
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Options

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">root</td>
      <td style="text-align:left">
        <p>The url of original image.</p>
        <p></p>
        <p><b>Type: </b>string with parameters</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
  </tbody>
</table>

## S3 Source

The S3 sources fetches original images from a S3 bucket. Can also be used for Digital Ocean spaces, by changing the endpoint.

### Example

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
sources:
  - s3:
      access_key_id: 'xxxx'
      secret_access_key: 'yyy'
      region: 'nyc3'
      bucket_name: 'my-bucket'
      path: 'originals/:image'
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Example ([minio](https://min.io/))

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
sources:
  - s3:
      access_key_id: 'xxxx'
      secret_access_key: 'yyy'
      region: 'us-east-1'
      bucket_name: 'my-bucket'
      path: '/originals/:image'
      endpoint: "http://localhost:9000"
      sslDisabled: true
      signatureVersion: "v4"
      s3ForcePathStyle: true
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Options

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">access_key_id</td>
      <td style="text-align:left">
        <p>Access key id from S3</p>
        <p>
          <br /><b>Type: </b>string</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">secret_access_key</td>
      <td style="text-align:left">
        <p>Secret access key from S3</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">region</td>
      <td style="text-align:left">
        <p>Region of S3 bucket</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">bucket_name</td>
      <td style="text-align:left">
        <p>Name of bucket</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">path</td>
      <td style="text-align:left">
        <p>Path of the original image in the bucket</p>
        <p></p>
        <p><b>Type: </b>string with parameters</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">endpoint</td>
      <td style="text-align:left">
        <p>Which endpoint to use, useful if using Digital Ocean Spaces.</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Default: </b>derived from bucket_name and region, as per AWS standard.</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">sslDisabled</td>
      <td style="text-align:left">
        <p>Disable SSL validation (useful when using a local S3 compatible server, minio)</p>
        <p></p>
        <p><b>Type: </b>boolean</p>
        <p><b>Default: </b>false</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">signatureVersion</td>
      <td style="text-align:left">
        <p>S3 Signature Version (useful when using a local S3 compatible server, like minio)</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Default: </b>defaults to AWS SDK internal default value for this setting</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">s3ForcePathStyle</td>
      <td style="text-align:left">
        <p>S3 force path style (useful when using a local S3 compatible server, like minio)</p>
        <p></p>
        <p><b>Type: </b>string</p>
        <p><b>Default: </b>defaults to AWS SDK internal default value for this setting</p>
      </td>
    </tr>
  </tbody>
</table>

{% hint style="info" %}
Avoid using forward slash in **path**, it will create unnamed folders.
{% endhint %}

## Volume Source

The volume sources fetches original image from disk.

### Example

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
sources:
  - volume:
      root: /mnt/images/:image
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Options

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">root</td>
      <td style="text-align:left">
        <p>The path of the original image on disk</p>
        <p></p>
        <p><b>Type: </b>string with parameters</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
  </tbody>
</table>

