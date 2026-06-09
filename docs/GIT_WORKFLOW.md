# VR Project Git Workflow Guide

> Version 2.1 | Last Updated: June 2025 | Maintained by: Platform Engineering

---

## Overview

This guide establishes the Git workflow standards for all VR Project development. Consistency in branching, commits, and pull requests ensures code quality and maintainability.

---

## Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<description>

Examples:
- feature/user-authentication
- bugfix/login-form-validation
- refactor/api-client-optimization
- docs/architecture-guide
- test/add-component-tests
```

### Branch Types

| Type | Purpose | Example |
|---|---|---|
| `feature/` | New features | `feature/dashboard-charts` |
| `bugfix/` | Bug fixes | `bugfix/auth-token-expiry` |
| `refactor/` | Code refactoring | `refactor/styled-components` |
| `docs/` | Documentation | `docs/component-guidelines` |
| `test/` | Test additions | `test/login-component` |
| `chore/` | Maintenance | `chore/update-dependencies` |

---

## Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```
feat(auth): add JWT token refresh mechanism
  - Implement automatic token refresh on 401 response
  - Add token expiry validation before API calls
  
Fixes #123

---

fix(login): correct password validation regex
  - Update regex to match password requirements
  - Add unit tests for edge cases
  
---

docs(guide): update component guidelines
  
---

refactor(api): simplify error handling in useApiClient hook
  - Remove redundant error types
  - Add consistent error response format
```

### Commit Types

| Type | Purpose |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code refactoring (no feature change) |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `style` | Formatting changes (not content) |
| `chore` | Build, dependencies, tooling |
| `perf` | Performance improvements |

### Commit Best Practices

- Write commits in **present tense**: "add feature" not "added feature"
- Keep commits **atomic** - one logical change per commit
- Include **issue references** in the footer: `Fixes #123` or `Closes #456`
- Write meaningful commit messages - others should understand the "why"

---

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with the latest main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests locally:**
   ```bash
   npm test
   ```

3. **Check linting:**
   ```bash
   npm run lint
   ```

### PR Title Format

```
[TYPE] Brief description

Examples:
[FEATURE] Add user profile page
[BUGFIX] Fix authentication token expiry
[REFACTOR] Simplify API client hook
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Refactoring

## Related Issue
Fixes #123

## Testing
- [ ] Added unit tests (min 3 test cases)
- [ ] Tested in development environment
- [ ] All tests pass

## Checklist
- [ ] Component in `src/components/YourFeature/` folder
- [ ] Styles in `YourFeature.styled.ts` (styled-components only)
- [ ] No `.css` files
- [ ] State via Redux Toolkit only
- [ ] No Context API usage
- [ ] All UI uses Ant Design
- [ ] Auth token via localStorage key `VR Project_auth_token`
- [ ] HTTP via useApiClient hook only
- [ ] Tests with minimum 3 test cases
- [ ] Code follows project conventions
- [ ] Documentation updated

## Screenshots (if applicable)
Include screenshots of UI changes
```

---

## Code Review Standards

### What Reviewers Check

✅ **Code Quality**
- Follows project conventions and patterns
- No deprecated code or Context API usage
- Proper error handling
- TypeScript types properly defined

✅ **Testing**
- Minimum 3 test cases per component
- Tests cover happy path and edge cases
- All tests pass

✅ **Styling**
- Uses styled-components exclusively
- No `.css` files
- No inline styles with hardcoded values

✅ **State Management**
- Uses Redux Toolkit for global state
- No localStorage beyond auth token
- Proper slice structure

✅ **Documentation**
- Clear commit messages
- PR description complete
- Code comments for complex logic
- Updated relevant docs

### Common Rejection Reasons

❌ `.css` files committed
❌ Context API usage in new code
❌ Missing or incomplete tests
❌ axios imported directly (not via useApiClient)
❌ Hardcoded values in styled-components
❌ Using raw HTML instead of Ant Design

---

## Deployment Workflow

### Pre-Deployment Checklist

```bash
# 1. Update dependencies
npm install

# 2. Run full test suite
npm test -- --coverage

# 3. Build for production
npm run build

# 4. Check bundle size
npm run analyze
```

### Version Management

Use semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: v1.2.3

---

## Hotfix Workflow

For critical production issues:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# 2. Make fix and test thoroughly
# ... code changes ...
npm test

# 3. Create PR with [HOTFIX] prefix
# ... create pull request ...

# 4. After merge, update develop
git checkout develop
git pull origin main
```

---

## Branch Protection Rules

The `main` branch has these protections:

1. **Require pull request reviews** - Minimum 1 approval
2. **Require status checks to pass** - All tests must pass
3. **Require branches to be up to date** - Before merging
4. **Require code review from owners** - Platform Engineering team
5. **Dismiss stale pull request approvals** - When new commits pushed
6. **Require conversation resolution** - All comments must be resolved

---

## Useful Git Commands

```bash
# Update with latest main
git fetch origin
git rebase origin/main

# View branch history
git log --graph --oneline --all

# Stash changes temporarily
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Interactive rebase to clean up commits
git rebase -i origin/main

# View what changed in a commit
git show <commit-hash>

# Cherry-pick a commit from another branch
git cherry-pick <commit-hash>
```

---

## Reference

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
