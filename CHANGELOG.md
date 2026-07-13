# @bentoguard/protocol-sdk

## 0.2.0

### Minor Changes

- ### Features
  - Integrated `@changesets/cli` to automate package versioning and changelog generation.
  - Added `getAgentInfo` function to retrieve agent metadata and configuration details.

  ### Breaking Changes
  - Renamed `getPosition` function to `getWalletBalance` for better semantic clarity.
  - Updated authentication types across the SDK to enforce stricter type safety; older custom type definitions may require updates.
