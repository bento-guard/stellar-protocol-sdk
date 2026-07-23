---
title: Error Handling
description: Reference for errors thrown by the Bento Stellar SDK.
---

# Error Handling

The SDK exposes custom error classes to help you distinguish between different failure modes.

```typescript
import { BentoError, BentoAPIError, BentoAuthError } from '@bentoguard/protocol-sdk';
```

### `BentoError`
The base class for all SDK-specific errors.

### `BentoAPIError`
Thrown when the Bento backend returns an HTTP error.

**Properties:**
- `status`: The HTTP status code (e.g. 400, 500).
- `data`: The raw JSON payload returned by the server, useful for parsing validation errors.

### `BentoAuthError`
Thrown when there is a problem with the Agent's identity or credentials. Examples include:
- Missing `.bento-credentials` file.
- Corrupted credentials structure.
- The Token Store failing to save or retrieve the keys.
