---
title: The simplest GitHub action to deploy Trunk applications
description: How to deploy Trunk applications directly using GitHub actions. No need to deploy from a branch on a separate workflow.
publication: 09-23-2023
---
## Introduction

Lately, I have been playing around with Web Assembly and Rust, but haven't found a way to easily build and share my projects. That's until now.

### Config

Go to your repo &rightarrow; Settings &rightarrow; Pages &rightarrow; Build and deployment &rightarrow; Source and choose `GitHub Actions`

Then create a file under `.github/workflows/trunk-deploy.yml`

```yaml
name: Build and deploy to gh pages with Trunk

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      - uses: jetli/trunk-action@v0.1.0
      - uses: jetli/wasm-bindgen-action@v0.1.0
      - uses: actions/checkout@v2
      - run: trunk build --release
      - uses: actions/upload-pages-artifact@v2
        with:
          path: dist

  deploy:
    runs-on: ubuntu-latest

    needs: build

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

That's it, the project will be build and deployed with every push to `main`

### Troubleshooting

By default pages are under `https://<github-user>.github.io/<repo-name>` that means your assets will fail to load due to relative urls. One option is to [specify a base URL](https://vitejs.dev/config/shared-options.html#base). Alternatively, you can [configure a custom domain on GitHub](https://docs.github.com/articles/using-a-custom-domain-with-github-pages/).
