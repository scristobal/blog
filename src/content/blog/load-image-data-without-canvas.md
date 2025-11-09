---
title: Load ImageData without canvas
publication: 11-10-2024
---

On the browser to get the image data you need to call `2d` context on a `OffscreenCanvas` like so

```js
async function getImageDataUsingOfflineCanvas(url) {
    const response = await fetch(url);

    const blob = await response.blob();

    const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);

    const ctx = canvas.getContext('2d');

    ctx?.drawImage(bitmap, 0, 0);

    // bitmaps do not get GC'd
    bitmap.close();

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

    return imageData.data
}
```

This however will not work on environments where `OffscreenCanvas` is not available.

Easily overcome with a few lines of Rust compiled to Web Assembly.

```rust
extern crate console_error_panic_hook;

mod utils;

use image::{ImageFormat, ImageReader};
use js_sys::{ArrayBuffer, Error, Uint8Array, Uint8ClampedArray};
use std::io::Cursor;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::Response;

#[wasm_bindgen]
pub async fn decode_img_from_url(url: String) -> Result<Uint8ClampedArray, JsValue> {
    console_error_panic_hook::set_once();

    let window = web_sys::window().ok_or(Error::new("No Window. Are you in the browser?"))?;

    let response = JsFuture::from(window.fetch_with_str(&url))
        .await?
        .dyn_into::<Response>()?;

    let encoded = JsFuture::from(response.array_buffer()?)
        .await?
        .dyn_into::<ArrayBuffer>()?;

    decode_img_from_arraybuffer(&encoded).await
}

#[wasm_bindgen]
pub async fn decode_img_from_arraybuffer(
    array_buffer: &ArrayBuffer,
) -> Result<Uint8ClampedArray, JsValue> {
    let data = Uint8Array::new(array_buffer);

    let cursor_enc = Cursor::new(data.to_vec());

    let img = ImageReader::with_format(cursor_enc, ImageFormat::Png)
        .decode()
        .map_err(|e| Error::new(&format!("Can't decode {e:?}. Is it a valid .png file?")))?;

    let result = unsafe { Uint8ClampedArray::view(img.as_bytes()) };

    Ok(result)
}
```

build with `cargo build --target=wasm32-unknown-unknown --release`.

If the JS bindings were created with `wasm-bindgen` and the `--web` flag then simply load it with:

```typescript
import init, { decode_img_from_url } from '/pkg/png_decoder.js'

async function getImageDataUsingWebAssembly(url) {
 return await decode_img_from_url(url);
}
```

In some browsers (Firefox and Safari) this method might be marginally faster than `OffscreenCanvas`, in others (Chrome and Edge) it might be much slower. Always measure.

[Full source code and benchmark](https://github.com/scristobal/load-imagedata-with-rust-and-web-assembly)
