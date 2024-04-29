---
title: Build a progress bar using browser native APIs only.
publication:
reference: https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#download-progress
---


```typescript

index.html
<!-- Wherever you html is -->
  <div id="progress" src="">progress</div>
  <img id="img">

script.js
'use strict'
const element = document.getElementById('progress');
fetch('https://example.com/very-large-file')
  .then(response => {
    if (!response.ok) {
      throw Error(response.status+' '+response.statusText)
    }
    // ensure ReadableStream is supported
    if (!response.body) {
      throw Error('ReadableStream not yet supported in this browser.')
    }
    // store the size of the entity-body, in bytes
    const contentLength = response.headers.get('content-length');
    // ensure contentLength is available
    if (!contentLength) {
      throw Error('Content-Length response header unavailable');
    }
    // parse the integer into a base-10 number
    const total = parseInt(contentLength, 10);
    let loaded = 0;
    return new Response(
      // create and return a readable stream
      new ReadableStream({
        start(controller) {
          const reader = response.body.getReader();
          read();
          function read() {
            reader.read().then(({done, value}) => {
              if (done) {
                controller.close();
                return;
              }
              loaded += value.byteLength;
              progress({loaded, total})
              controller.enqueue(value);
              read();
            }).catch(error => {
              console.error(error);
              controller.error(error)
            })
          }
        }
      })
    );
  })
  .then(response =>
    // construct a blob from the data
    response.blob()
  )
  .then(data => {
    // insert the downloaded image into the page
    document.getElementById('img').src = URL.createObjectURL(data);
  })
  .catch(error => {
    console.error(error);
  })
function progress({loaded, total}) {
  element.innerHTML = Math.round(loaded/total*100)+'%';
}
```

```typescript
let fileSize = ”; // you can get fileSize in input[type=file] onchange event
let uploadedByte = 0;

fetch().then(res => {
  let reader = res.body.getReader();

  reader.read().then(({ done, value }) => {

    if (done) console.log(‘upload completed’);

    uploadedByte += value.byteLength;

    console.log(‘uploaded: ‘ + uploadedByte);
    console.log(‘progress: (uploadedByte/fileSize * 100).toFixed());
  });
})
```
