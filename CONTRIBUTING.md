# Contributing to Bento Stellar SDK

First off, thank you for considering contributing to the Bento Stellar SDK! It's people like you that make this SDK such a great tool for building secure AI Agents on Stellar.

## Workflow

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes (`npm test`).
4. Format your code (`npm run fmt`).
5. If you've changed APIs, update the documentation in `docs/`.
6. Ensure the docs snippets check passes (`npm run docs:check`).
7. Ensure your code passes the linter.

## Development Setup

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run unit and integration tests
npm test

# Check docs snippets
npm run docs:check
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Reporting Bugs

Bugs are tracked as GitHub issues. When creating an issue, please explain the problem and include additional details to help maintainers reproduce the problem.
