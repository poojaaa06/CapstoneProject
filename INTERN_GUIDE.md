| # | Task |
|---|---|
| 1 | Login & Registration Page |
| 2 | Profile Page with CRUD |
| 3 | PWA Setup |
| 4 | React Version Upgrade + Tests |
| 5 | Dashboard + 404 Page |
| 6 | GitHub Project Setup |



1. TypeScript
All files must be written in strict TypeScript. Define explicit types and interfaces for all props, state, context values, API responses, and function signatures. No use of any.

2. Component Library
Use Ant Design (antd) v5 exclusively for all UI components. Do not use raw HTML form elements, buttons, or inputs.

3. Styling
Use external .css files scoped to each component. No inline styles, no styled-components, no CSS-in-JS of any kind.

4. Accessibility
All components must meet WCAG AAA standards. This includes proper ARIA labels, keyboard navigation, sufficient color contrast, focus management, and screen reader compatibility.

5. Component Architecture
Every component must be independently written, self-contained, and reusable. No business logic inside shared/UI components. Follow the folder convention:
src/components/FeatureName/
├── index.tsx
└── FeatureName.css

6. Mock Data
All mock/stub data must be placed inside src/stubs/. No hardcoded data inside components. Stubs must match the TypeScript interface of the actual API response.

7. HTTP Client
Use axios for all API calls. Centralise the axios instance with base URL and interceptors in src/api/axiosInstance.ts. No direct fetch calls.

8. State Management
Use React Context API exclusively for global state. No Redux, no Zustand, no third-party state libraries. Extend the existing AppContext and ThemeContext — do not create redundant contexts.

9. Responsive Design
All components must be fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+). Use Ant Design's Row, Col, and Grid breakpoints. Test on all three viewports before raising a PR.

10. Code Quality
Review and correct all existing code before building on top of it. Fix type errors, prop drilling issues, missing error boundaries, and inconsistent patterns. Do not carry forward existing mistakes.

11. Dependencies
Do not install any package without justification. Every new dependency must solve a problem that cannot be reasonably solved with the existing stack. Raise it for review before installing.

12. Testing 
Write unit and integration tests using React Testing Library and Jest.

13. Assets
Do not use any image, icon, font, or media asset sourced from the internet without a verified open-source or royalty-free license. Use Ant Design icons (@ant-design/icons) for all iconography.