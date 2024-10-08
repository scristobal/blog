---
title: How to inline workers for single HTML pages.
publication:
reference: https://www.oreilly.com/library/view/web-workers/9781449322120/ch04.html
---


```html
<!DOCTYPE html>
<script id="worker1" type="javascript/worker">
    // This script won't be parsed by JS engines because its type is javascript/worker.
    self.onmessage = function(e) {
      self.postMessage('msg from worker');
    };
    // Rest of your worker code goes here.
</script>
<script>
    var blob = new Blob([document.querySelector('#worker1').textContent], {
        type: 'text/javascript',
    });

    // Note: window.webkitURL.createObjectURL() in Chrome 10+.
    var worker = new Worker(window.URL.createObjectURL(blob));
    worker.onmessage = function (e) {
        console.log('Received: ' + e.data);
    };
    worker.postMessage('hello'); // Start the worker.
</script>
```
