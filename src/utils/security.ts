import { buildEndpoint, Version, Module } from "../constants";
import { approveTransaction } from "../modules/embedded_wallet/approve-transaction";
import type { RequestClient } from "./request";
import { postJson } from "./request";

export interface SecurityActionConfig {
  url: string;
  body: any;
  fallbackMessage: string;
}

export async function executeSecureAgentAction(
  client: RequestClient,
  config: SecurityActionConfig,
) {
  const { url, body, fallbackMessage } = config;

  // Step 1: Create Draft (returns transaction_id)
  console.log(`\n[SDK] 🔄 Step 1: Requesting Transaction Draft for ${url}...`);
  const draftResult: any = await postJson(client, url, body, fallbackMessage);

  const transaction_id =
    draftResult?.transaction_id || draftResult?.data?.transaction_id;

  if (!transaction_id) {
    // If it's not a draft (e.g. instruction missing or normal user), return directly
    return draftResult;
  }

  console.log(
    `[SDK] ✅ Step 1 Success - Created Draft TxID: ${transaction_id}`,
  );

  // If the user provided instruction, we run the security gate
  if (body.instruction) {
    console.log(`[SDK] 🛡️ Step 2: Running Bento Guard Risk Engine...`);
    const analyzePayload = {
      instruction: body.instruction,
      transaction_id,
      resolvedTargets: body.resolvedTargets || {},
      amount: body.amount,
      value: body.amount || body.value,
      targetProgram: body.targetPubkey || body.targetProgram,
    };

    let riskResult: any;
    try {
      riskResult = await postJson(
        client,
        buildEndpoint(Version.Version2, Module.RISK_ENGINE, "analyzeAction"),
        analyzePayload,
        "Failed to execute security gate analysis",
      );
    } catch (e: any) {
      console.log(`[SDK] ❌ Step 2 Failed - Risk Engine Error: ${e.message}`);
      throw e;
    }

    // Support nested data structure from NestJS response
    const status =
      riskResult?.status ||
      riskResult?.data?.decision ||
      riskResult?.data?.status;
    const reason =
      riskResult?.reason || riskResult?.data?.reasoning || "Unknown";

    if (status === "BLOCKED") {
      console.log(
        `[SDK] ❌ Step 2 Failed - Security Gate Blocked Action: ${reason}`,
      );
      throw new Error(`Security Gate Blocked Action: ${reason}`);
    }

    console.log(`[SDK] ✅ Step 2 Success - Verdict: ${status}`);

    if (status === "ESCALATED") {
      console.log(
        `[SDK] ⚠️ Step 3: Transaction Escalated. Awaiting manual review.`,
      );
      return { status: "escalated", transaction_id, reason };
    }

    // Step 3: Approve if ALLOWED
    console.log(`[SDK] 🚀 Step 3: Approving Transaction Draft...`);
    const approveResult: any = await approveTransaction(client, {
      txId: transaction_id,
    });

    console.log(`[SDK] ✅ Step 3 Success - Transaction Broadcasted!`);

    return approveResult;
  }

  // If no instruction, just return the draft id for manual approval
  return draftResult;
}
