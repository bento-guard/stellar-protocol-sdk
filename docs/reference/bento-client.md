---
title: Bento Client API
description: Reference documentation for the BlendServiceClient and Token Stores.
---

# BlendServiceClient

The core HTTP client that connects your agent to the Bento backend. It is isomorphic and supports automatic token persistence out-of-the-box.

## Constructor

```typescript
import { BlendServiceClient } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient({
  baseURL: 'http://localhost:3000', // Optional
  timeout: 10000 // Optional: Request timeout in ms
});
```

## Token Stores

The SDK uses specialized Token Stores to persist the Agent's identity (`agentId` and `apiKey`). The `BlendServiceClient` automatically selects the appropriate store based on the environment:

1. **BrowserTokenStore**: Used in browser environments (`window` is defined). Saves credentials in `localStorage`.
2. **FileTokenStore**: Used in Node.js environments. Saves credentials in `.bento-credentials` at the project root.
3. **MemoryTokenStore**: Used as a fallback if the environment does not support file systems or local storage. Credentials are wiped when the process exits.
