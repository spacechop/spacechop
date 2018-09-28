# Overrides

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">disableChunkedEncoding</td>
      <td style="text-align:left">
        <p>Disables sending a chunked response, and instead buffers all data in memory
          and sends it all at the same time. Also means that header <code>Content-Length</code> will
          be set.</p>
        <p><b>Type:</b> boolean</p>
        <p><b>Default</b>: false</p>
      </td>
    </tr>
  </tbody>
</table>### Example

Switch from `Transfer-Encoding: chunked` and turn on `Content-Length: bytelength`

{% code-tabs %}
{% code-tabs-item title="config.yml" %}
```yaml
disableChunkedEncoding: true
```
{% endcode-tabs-item %}
{% endcode-tabs %}



