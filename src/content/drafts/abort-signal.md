```typescript
const controller = new AbortController();
const options = {
    method: 'POST',
    signal: controller.signal,
    body: JSON.stringify({
        firstName: 'David',
        lastName: 'Pollock',
    }),
};
const promise = fetch('/login', options);
const timeoutId = setTimeout(() => controller.abort(), 4000);

promise
    .then((response) => {
        /* handle the response */
    })
    .catch((error) => console.error('timeout exceeded'));
```

source: https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#response-timeout
