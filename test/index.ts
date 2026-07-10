import { runUnitTests } from './unit/unit.test';
import { runIntegrationTests } from './integration/integration.test';
import { runE2ETests } from './e2e/e2e.test';

async function main(): Promise<void> {
  await runUnitTests();
  await runIntegrationTests();
  await runE2ETests();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
