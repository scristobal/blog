---
title: How to cancel fetch request using native browser APIs
publication: 10-11-2024
reference: https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#response-timeout
---

The following code makes a fetch request, but cancels it if it exceeds a 1 second timeout.

```typescript
const controller = new AbortController();

const timeoutId = setTimeout(() => controller.abort(),  1_000);

fetch('https://example.com', { signal: controller.signal })
  .then((response) => {
    clearTimeout(timeoutId);
    /* handle the response */
  })
  .catch((error) => {
  if (controller.signal.aborted) {
    /* handle timeout */
  } else {
    /* handle error */
  }
});
```

The following code will make two request, process the fastest and aborts the slowest.

```typescript
const controller = new AbortController();

const urls = [
    "https://example.com/1",
    "https://example.com/2"
]

Promise
  .race(urls.map((url) => fetch(url, { signal: controller.signal }))
  .then((response) => {
    controller.abort;
    /* handle the (fastest) response */
  })
  .catch((error) => {
    if (controller.signal.aborted) {
      /* handle the (slower) response(s) */
    } else {
      /* handle the (fastest) error */
    }
  });
```

It is important to note that `Promise.race` return the first promise that accepts or rejects.
