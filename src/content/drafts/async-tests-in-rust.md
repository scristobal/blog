---
title: How to ensure your `asserts` are asserted on async tests using static atomics in Rust
description: A few notes on how to tests concurrent code in Rust
publication: 12-29-2023
---
## Introduction

assert the number of assertions using static atomic counters, maybe use a `counted_assert!` and something at the beginning of the function `num_asserts=`

alternative use wait groups

```rust
 struct WaitForTest<const N: usize>(AtomicU16);

    impl<const N: usize> Future for WaitForTest<N> {
        type Output = ();

        fn poll(
            self: std::pin::Pin<&mut Self>,
            cx: &mut std::task::Context<'_>,
        ) -> std::task::Poll<Self::Output> {
            if self.0.load(Ordering::Relaxed) == N as u16 {
                std::task::Poll::Ready(())
            } else {
                cx.waker().wake_by_ref();
                std::task::Poll::Pending
            }
        }
    }
```
