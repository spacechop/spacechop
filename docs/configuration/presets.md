# Presets

## Crop

Keeps only a specific region of the image, and removes the rest.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">width</td>
      <td style="text-align:left">
        <p><b>Type</b>: number</p>
        <p><b>Default: </b>Width of the image</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Default:</b> Height of the image</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">gravity</td>
      <td style="text-align:left">
        <p><b>Type: </b>string</p>
        <p><b>Default: </b>center</p>
        <p>center | northwest | north |</p>
        <p>northeast | east | southeast |</p>
        <p>south | southwest | west</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
At least **width** or **height** is required for a crop operation.
{% endhint %}

### Example

Crop an image to 200x200 pixels and center the image on the largest face in the picture.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
presets:
  crop_200x200_face:
    steps:
      - $crop:
          width: 200
          height: 200
          gravity: face
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Crop so that the image fits within a 200 pixels width and keep height from the original.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```text
presets:
  crop_200_width:
    steps:
      - $crop:
          width: 200
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Fit

Fits the image into a box. Keeps aspect ratio and does not remove any parts of the image.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">width</td>
      <td style="text-align:left">
        <p><b>Type: </b>number</p>
        <p><b>Default: </b>Width of the image</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Default:</b> Height of the image</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
  </tbody>
</table>### Example

Fit an image within 200x200 pixels large area and keep aspect ratio.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```text
presets:
  fit_200x200:
    steps:
      - $fit:
          width: 200
          height: 200
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Fill

Resizes the image to fill a bounding box. **With aspect ratio intact** and will remove parts of the image that are outside the box. Use gravity to move the image within the bounding box.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">width</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">gravity</td>
      <td style="text-align:left">
        <p><b>Type</b>: string</p>
        <p><b>Default: </b>center</p>
        <p>center | northwest | north |</p>
        <p>northeast | east | southeast |</p>
        <p>south | southwest | west</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
Fill will not scale up images if they are smaller than the defined width and height of the preset.
{% endhint %}

### Example

Creates an image with 200x200 pixels size and any bleeding pixels are cut off, if there is faces in the picture, center on the largest one found.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
presets:
  fill_200x200_face:
    steps:
      - $fill:
          width: 200
          height: 200
          gravity: face
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Resize

Resizes images to the exact dimension specified, **without** keeping aspect ratio, and does not remove any part of the image.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">width</td>
      <td style="text-align:left">
        <p><b>Type: </b>number</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Required</b>
        </p>
      </td>
    </tr>
  </tbody>
</table>### Example

Resizes images to the exact dimension of 200x200 pixels.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
presets:
  resize_200x200:
    steps:
      - $resize:
          width: 200
          height: 200
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Format

Changes the format of the image. Conversion is implemented between all of SpaceChops supported formats.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">type</td>
      <td style="text-align:left">
        <p><b>Type: </b>string</p>
        <p><b>Required</b>
        </p>
        <p>jpeg | png | gif | webp</p>
      </td>
    </tr>
  </tbody>
</table>### Example

Fill the area of 200x200 pixels with the image and format to jpeg if the original is another type.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
presets:
  fill_200x200:
    steps:
      - $fill:
          width: 200
          height: 200
      - $format:
          type: jpeg
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Compress

Compresses the image \(but does not strip metadata\). If used together with Format, Compress should be placed after Format as it depends on the filetype.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">quality</td>
      <td style="text-align:left">
        <p><b>Type</b>: number</p>
        <p><b>Default: </b>100</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">lossy</td>
      <td style="text-align:left">
        <p><b>Type: </b>boolean</p>
        <p><b>Default:</b> false</p>
      </td>
    </tr>
  </tbody>
</table>### Example

Fill an area of 200x200 pixels and compress the image using mozjpeg to a quality of 82, to make the images fast and **SEO friendly**.

```text
presets:
  fill_200x200:
    steps:
      - $fill:
          width: 200
          height: 200
      - $format:
          type: jpeg
      - $compress:
          quality: 82
```

## Strip

Strips the image of all EXIF data.

> Exif data is nowadays often quite large, and for images to be fast to load this should be removed.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">icc_profile</td>
      <td style="text-align:left">
        <p>Should the ICC Profile be kept
          <br />
        </p>
        <p><b>Type: </b>boolean</p>
        <p><b>Default: </b>true</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
Do avoid removing icc\_profile, your images will look different on different types of screens.
{% endhint %}

### Example

Fill an area of 200x200 pixels and strip all exif data so that the resulting image becomes fast to load and small in byte size. We also want to keep all the colors as they were made from the original.

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
presets:
  fill_200x200:
    steps:
      - $fill:
          width: 200
          height: 200
      - $strip:
          icc_profile: jpeg
```
{% endcode-tabs-item %}
{% endcode-tabs %}

