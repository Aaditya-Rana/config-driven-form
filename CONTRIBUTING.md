# Developer's Guide & Contributing

Thank you for your interest in contributing to the `config-driven-form` library! This document outlines how we maintain the codebase, our documentation strategy, and how you can get started.

## 1. Local Setup

First, clone the repository and install the dependencies. We use `npm` for package management.

```bash
git clone <repository-url>
cd config-driven-form
npm install
```

## 2. Documentation & Interactive Development (Storybook)

We maintain our documentation and interactive component examples using **Storybook**. Instead of a static `/docs` folder, our documentation lives directly alongside the code via `.stories.tsx` files.

To start the local documentation site:

```bash
npm run storybook
```

This will launch a local server (usually at `http://localhost:6006`).

- When you create a new component or field type (e.g., `DatePickerField`), you **must** create a corresponding `DatePickerField.stories.tsx` file to demonstrate how it works.
- Storybook acts as our interactive Developer Guide. You can test validations, toggle props, and see the UI update in real-time.

## 3. Code Quality & Pre-commit Hooks

We have strict code quality standards enforced via Husky git hooks.
Before you submit a Pull Request, ensure your code passes our automated checks:

- **Linting**: Run `npm run lint` to check for ESLint errors.
- **Formatting**: Run `npm run format` to ensure Prettier code formatting.
- _Note: These commands run automatically on your staged files when you attempt to make a commit._

## 4. Making a Commit

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This allows us to automatically generate `CHANGELOG.md` files and determine semantic version bumps.

Your commit messages MUST be formatted like this:

- `feat: added date picker field support` (For new features)
- `fix: resolved crashing issue on empty schema` (For bug fixes)
- `docs: updated readme with new examples` (For documentation changes)
- `chore: updated dependencies` (For maintenance tasks)

If your commit message is invalid, the Husky `commitlint` hook will reject the commit.

## 5. Adding New Features and Creating Changesets

If your Pull Request introduces a bug fix or a new feature that warrants a version bump, you must include a changeset.

Run the following command and follow the interactive prompts:

```bash
npx changeset
```

This generates a markdown file in the `.changeset` folder. Commit this file along with your code changes. When your PR is merged, the automated release workflow will consume this file to publish the new version and update the changelog.

## 6. Building the Library

To verify that your changes compile successfully into the final ESM and CJS bundles:

```bash
npm run build
```

Verify that there are no TypeScript errors in the output.

---

We look forward to reviewing your Pull Requests!
