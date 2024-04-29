---
title: How to cancel fetch request using native browser APIs
publication:
reference: https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#response-timeout
---



```typescript
const controller = new AbortController();

const TIME_OUT = 5_000; // milliseconds

const options = {
    method: 'POST',
    signal: controller.signal,
};

const promise = fetch('https://example.com', options);

const timeoutId = setTimeout(() => controller.abort(), TIME_OUT);

promise
    .then((response) => {
        clearTimeout(timeoutId);

        /* handle the response */
    })
    .catch((error) => if (controller.signal.aborted) console.error('timeout exceeded'));
```
