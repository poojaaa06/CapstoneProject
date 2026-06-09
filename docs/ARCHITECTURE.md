# VR Project Architecture Guide

> Version 2.1 | Last Updated: June 2025 | Maintained by: Platform Engineering

---

## Project Overview

VR Project is a production-grade React TypeScript application. This guide documents the architectural principles and structure for all development work.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| UI Library | Ant Design v5 |
| State Management | Redux Toolkit (@reduxjs/toolkit) |
| Styling | styled-components v6 |
| Routing | React Router DOM v6 |
| HTTP Client | axios via useApiClient() custom hook |
| Auth | Token stored in localStorage under key `VR Project_auth_token` |
| Theme | Ant Design ConfigProvider |

> **Note:** The project uses Redux Toolkit for all global state. Context API is present in legacy files — do NOT use it for new features.

---

## Folder Structure

Every new feature/screen must follow this exact structure:

```
src/
└── components/
    └── YourFeature/
        ├── index.tsx
        ├── YourFeature.styled.ts
        └── YourFeature.test.tsx
```

### Directory Organization

- **src/components/** - All UI components organized by feature
- **src/store/** - Redux Toolkit slices and store configuration
- **src/hooks/** - Custom React hooks (useApiClient, etc.)
- **src/services/** - API service functions
- **src/context/** - Legacy context files (avoid for new work)
- **src/interfaces/** - TypeScript interfaces and types
- **src/utils/** - Utility functions and constants
- **public/stubs/** - Mock API responses for development

---

## State Management Architecture

VR Project uses Redux Toolkit for all global state management.

### Store Location
```
src/store/
├── store.ts
├── userSlice.ts
├── themeSlice.ts
└── [feature]Slice.ts
```

### Usage Pattern

```typescript
// ✅ CORRECT
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const MyComponent = () => {
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  return <div>{userDetails.name}</div>;
};
```

### What NOT to Do

```typescript
// ❌ WRONG - Context API is banned for new features
import { useAppContext } from '../../context/AppContext';
```

---

## Theme Integration

Access theme via Redux store — NOT via useTheme() context.

```typescript
// ✅ CORRECT
import { useSelector } from 'react-redux';
const { isDarkMode } = useSelector((state) => state.theme);

// ❌ WRONG
import { useTheme } from '../../context/ThemeContext'; // BANNED
```

---

