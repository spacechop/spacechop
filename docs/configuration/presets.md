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
        <p><b>Default: </b>Width of image</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Default:</b> Height of image</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">gravity</td>
      <td style="text-align:left">
        <p><b>Type: </b>string</p>
        <p><b>Default: '</b>center'</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
Examples to be added
{% endhint %}

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
      </td>
    </tr>
    <tr>
      <td style="text-align:left">height</td>
      <td style="text-align:left">
        <p><b>Type:</b> number</p>
        <p><b>Default:</b> Height of the image</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
Examples to be added
{% endhint %}

## Fill

Resizes the image to fill a bounding box. Does not keep aspect ratio and will remove parts of the image that are outside the box.

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
        <p><b>Default: '</b>center'</p>
      </td>
    </tr>
  </tbody>
</table>{% hint style="info" %}
Examples to be added
{% endhint %}

## Resize

Resizes the image without keeping aspect ratio, but does not remove any part of the image.

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
</table>{% hint style="info" %}
Examples to be added
{% endhint %}

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
      </td>
    </tr>
  </tbody>
</table>## Compress

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
</table>## Strip

Strips the image of all EXIF data.

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
</table>

