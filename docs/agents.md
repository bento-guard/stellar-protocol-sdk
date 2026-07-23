---
title: AI Agents
description: Documentation formats and best practices for AI Agents consuming the Bento Stellar SDK.
---

# AI Agents

This SDK publishes its documentation in formats designed specifically for AI Agents (like Cursor, Claude, or autonomous agent loops).

## llms.txt bundles

We provide structured bundles of the entire documentation corpus, served at the root of our repository/site:

- [`llms.txt`](../llms.txt) — The routing map. It indexes every guide and reference page. Pick the most relevant page from this list for your task.
- [`llms-full.txt`](../llms-full.txt) — The full corpus concatenated as one prose stream. Ingest this when you want the whole API surface in one shot.

These files are auto-generated on every major change using our internal `build-llms.ts` script.

## Isomorphic Context

When writing code for this SDK, please note that it is **Isomorphic**.
- The `BlendServiceClient` uses environment-aware stores (`MemoryTokenStore`, `BrowserTokenStore`, `FileTokenStore`).
- Always import from the top level `@bentoguard/protocol-sdk`.
- Do not assume `fs` or `path` are available (they are safely guarded for browser use).
