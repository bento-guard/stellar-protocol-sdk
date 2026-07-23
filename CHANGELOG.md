# @bentoguard/protocol-sdk

## 0.3.0

### Minor Changes

- ### Features & Enhancements
  - **Security Layer**: Added a comprehensive security layer for robust protection.
  - **Core APIs**: Introduced `getAgentInfo` to seamlessly fetch agent metadata.
  - **Wallet & Authentication**: Renamed `getPosition` to `getWalletBalance` for better API clarity and updated underlying authentication types.
  - **Testing**: Updated testcase logic and improved overall reliability.

## 0.2.0

### Minor Changes

- ### Features
  - Integrated `@changesets/cli` to automate package versioning and changelog generation.
  - Added `getAgentInfo` function to retrieve agent metadata and configuration details.

  ### Breaking Changes
  - Renamed `getPosition` function to `getWalletBalance` for better semantic clarity.
  - Updated authentication types across the SDK to enforce stricter type safety; older custom type definitions may require updates.
