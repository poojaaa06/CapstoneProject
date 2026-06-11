# VR Project Component Guidelines

> Version 2.1 | Last Updated: June 2025 | Maintained by: Platform Engineering

---

## Component Structure

All components must follow this exact folder structure:

```
src/components/
└── ComponentName/
    ├── index.tsx              # Main component export
    ├── ComponentName.styled.ts # Styled components
    └── ComponentName.test.tsx  # Unit tests (min 3 cases)
```

---

## Styling Rules

Use **styled-components** for ALL component styles. CSS files are **deprecated** and will be rejected in PR review.

### Creating Styled Components

```typescript
// ComponentName.styled.ts
import styled from 'styled-components';

export const LoginWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  border-radius: 8px;
`;

export const InputField = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 12px;
`;
```

### Usage in Component

```typescript
// index.tsx
import { LoginWrapper, InputField } from './ComponentName.styled';

export const ComponentName = () => {
  return (
    <LoginWrapper>
      <InputField type="text" />
    </LoginWrapper>
  );
};
```

### Theme Access

Always access theme from styled-components context:

```typescript
const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px;
`;
```

---

## Ant Design Rules

- **Always use Ant Design components.** No raw HTML button, input, form, etc.
- Components must come from the `antd` package
- Icons come from `@ant-design/icons`

### Approved Imports

```typescript
// ✅ CORRECT
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// ❌ WRONG
import Button from 'react-bootstrap'; // Use Ant Design instead
```

### Form Example

```typescript
import { Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const LoginForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // API call here
      message.success('Login successful!');
    } catch (error) {
      message.error('Login failed');
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
```

---

## Component Best Practices

### 1. Use TypeScript Interfaces

```typescript
// Define props with interfaces
interface LoginProps {
  onSuccess: (token: string) => void;
  loading?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, loading }) => {
  // Component implementation
};
```

### 2. Memoization for Performance

```typescript
import { memo } from 'react';

export const Card = memo(({ title, content }: CardProps) => {
  return <div>{title}</div>;
});
```

### 3. Custom Hooks for Logic

```typescript
// ✅ Extract complex logic into custom hooks
const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  // Logic here
  return { loading };
};
```

---

## Styling Forbidden Patterns

❌ **NEVER** commit `.css` files — they will be rejected:
```typescript
// WRONG
import './Component.css';
```

❌ **NEVER** use inline styles with hardcoded values:
```typescript
// WRONG
<div style={{ color: '#000', padding: '20px' }}>
```

✅ **ALWAYS** use styled-components:
```typescript
// CORRECT
const StyledDiv = styled.div`
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
`;
```

---

## Reference

- [Ant Design Component Library](https://ant.design/components/overview)
- [styled-components Documentation](https://styled-components.com/docs)
- [React Component Patterns](https://react.dev/reference)
