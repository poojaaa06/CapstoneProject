# VR Project Testing Guide

> Version 2.1 | Last Updated: June 2025 | Maintained by: Platform Engineering

---

## Testing Requirements

Every component and feature must include unit tests with a **minimum of 3 test cases**.

---

## Test File Structure

```
src/components/YourFeature/
├── index.tsx
├── YourFeature.styled.ts
└── YourFeature.test.tsx
```

---

## Testing Setup

VR Project uses React Testing Library and Jest for unit testing.

### Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Test File Configuration

```typescript
// YourFeature.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { YourFeature } from './index';

describe('YourFeature Component', () => {
  // Test cases here
});
```

---

## Testing Patterns

### Pattern 1: Component Rendering

```typescript
describe('YourFeature Component', () => {
  test('should render without crashing', () => {
    render(<YourFeature />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

### Pattern 2: User Interaction

```typescript
test('should call onSubmit when form is submitted', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  const button = screen.getByRole('button', { name: /login/i });
  fireEvent.click(button);

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Pattern 3: Props Validation

```typescript
test('should display user name from props', () => {
  const user = { id: 1, name: 'John Doe' };
  render(<UserCard user={user} />);

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Pattern 4: Conditional Rendering

```typescript
test('should show loading state when loading prop is true', () => {
  render(<DataList loading={true} />);
  
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('should show data when loading is false', () => {
  const items = [{ id: 1, name: 'Item 1' }];
  render(<DataList loading={false} items={items} />);
  
  expect(screen.getByText('Item 1')).toBeInTheDocument();
});
```

---

## Complete Example: Login Form Testing

```typescript
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './index';

describe('LoginForm Component', () => {
  // Test 1: Component renders correctly
  test('should render login form with username and password inputs', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // Test 2: Form validation works
  test('should show validation error when form is submitted empty', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  // Test 3: Form submission handler is called with correct data
  test('should call onSubmit with form data when submitted', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });
});
```

---

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ GOOD - Tests behavior
test('should call onClick when button is clicked', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(onClick).toHaveBeenCalled();
});

// ❌ BAD - Tests implementation details
test('should have onClick prop', () => {
  const onClick = jest.fn();
  const { container } = render(<Button onClick={onClick} />);
  expect(container.querySelector('button')).toHaveAttribute('onClick');
});
```

### 2. Use Meaningful Test Names

```typescript
// ✅ GOOD - Clear intention
test('should disable submit button when form has validation errors', () => {
  // Test implementation
});

// ❌ BAD - Unclear
test('should work correctly', () => {
  // Test implementation
});
```

### 3. Arrange, Act, Assert Pattern

```typescript
test('should update user profile', async () => {
  // Arrange - Set up test data
  const user = { id: 1, name: 'John' };
  
  // Act - Perform the action
  render(<ProfileForm user={user} />);
  fireEvent.change(screen.getByDisplayValue('John'), {
    target: { value: 'Jane' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  // Assert - Verify the result
  await waitFor(() => {
    expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
  });
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run a specific test file
npm test LoginForm.test.tsx
```

---

## Common Testing Utilities

```typescript
// Querying elements
screen.getByRole('button', { name: /submit/i })
screen.getByText('Text content')
screen.getByPlaceholderText('placeholder text')
screen.getByTestId('unique-id')
screen.getByLabelText('Label text')

// Waiting for elements
waitFor(() => expect(...).toBeInTheDocument())
waitForElementToBeRemoved(() => screen.queryByTestId('loading'))

// User interactions
fireEvent.click(element)
userEvent.type(input, 'text')
userEvent.selectOptions(select, ['option1', 'option2'])
```

---

## Reference

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Best Practices for Testing](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
