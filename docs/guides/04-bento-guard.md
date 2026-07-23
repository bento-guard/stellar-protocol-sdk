---
title: Bento Guard
description: Understanding the Secure Execution Pipeline that protects your Agent's assets.
---

# Bento Guard

Bento Guard is the built-in risk engine for the Bento backend. Because AI Agents are autonomous, they carry a high risk of executing incorrect or malicious transactions if their prompts are manipulated (e.g., prompt injection) or if their logic fails.

To protect against this, **all Write Operations in the SDK are automatically routed through a 3-step secure execution pipeline.**

## The 3-Step Secure Pipeline

When your agent calls a write method (like `transferAsset` or `deposit`), the SDK does *not* broadcast the transaction directly to the Stellar network. Instead:

1. **Draft Creation:** The SDK contacts the Bento backend to draft a transaction. A `draftId` is returned.
2. **Risk Evaluation:** The SDK submits the `draftId` to the Bento Guard API. The Risk Engine analyzes the transaction context (amount, destination, historical behavior, agent profile).
3. **Decision & Action:**
    - If the Risk Engine determines the transaction is safe, it returns `ALLOWED`. The SDK immediately instructs the backend to approve and broadcast the transaction.
    - If the Risk Engine flags the transaction as risky, it returns `ESCALATED`. The SDK returns a "Held for Human Review" status.

## Handling the Output

Every Write Operation in the SDK returns a standardized response type indicating the outcome.

```typescript
type SecureActionResponse = 
  | { status: 'ALLOWED'; transactionHash: string }
  | { status: 'ESCALATED'; draftId: string };
```

Your agent should be programmed to understand these two states:
- **ALLOWED**: The task succeeded. The agent can confidently tell the user that the transfer or deposit is complete.
- **ESCALATED**: The task is paused. The agent should inform the user: *"I have drafted the transaction, but it requires your manual approval in the Bento Dashboard due to security limits."*

## Dashboard Approval

Once a transaction is `ESCALATED`, a Human Admin must log into the Bento UI to review it. They can either Approve or Reject the draft. If approved, the backend signs and broadcasts the transaction to the Stellar network asynchronously.
