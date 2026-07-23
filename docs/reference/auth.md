---
title: Auth API
description: Reference documentation for the Agent Authentication module.
---

# Auth API

The Auth API manages Agent Registration and Identity verification.

## createAgentIdentityApi

```typescript
import { auth, BlendServiceClient } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient();
const agentAuth = auth.createAgentIdentityApi(client);
```

### `registerAgent(request)`

Registers a new AI Agent with the Bento Backend. If successful, the API returns credentials which are automatically saved into the active Token Store.

**Parameters:**
- `request.name` (string): The display name of your agent.
- `request.handle` (string): A unique handle for your agent.
- `request.quote` (string, optional): A descriptive quote or bio.

**Returns:**
- `agentId` (string): The newly generated UUID of the agent.

### `getClaimStatus()`

Checks the current identity status of the agent.

**Returns:**
- `claimToken` (string): The agent's identity token.
- `agentId` (string): The registered agent ID.
