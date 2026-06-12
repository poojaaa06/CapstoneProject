import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './index';

jest.mock('formik', () => ({
  useFormik: () => ({
    values: { user_unique_id: '', user_password: '', remember: true },
    touched: {},
    errors: {},
    isSubmitting: false,
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    handleSubmit: jest.fn(),
  }),
}));

jest.mock('crypto-js', () => ({
  AES: { encrypt: () => ({ toString: () => 'encrypted' }) },
}));

jest.mock('antd', () => {
  const InputComponent = (props: any) => <input {...props} />;
  (InputComponent as any).Password = (props: any) => <input type="password" {...props} />;

  return {
    Card: ({ children }: any) => <div>{children}</div>,
    Form: Object.assign(({ children }: any) => <form>{children}</form>, {
      Item: ({ children }: any) => <div>{children}</div>,
    }),
    Input: InputComponent,
    Checkbox: ({ children, ...props }: any) => <label><input type="checkbox" {...props} />{children}</label>,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
    Typography: { Title: ({ children }: any) => <h1>{children}</h1> },
    notification: { error: jest.fn() },
  };
});

jest.mock('@ant-design/icons', () => ({
  UserOutlined: () => <span />,
  LockOutlined: () => <span />,
}));

jest.mock('src/context/appContext', () => ({
  useAppContext: () => ({ setUserDetails: jest.fn() }),
}));

jest.mock('src/validations/loginSchema', () => ({
  loginSchema: {},
}));

jest.mock('src/services/loginApi', () => ({
  loginAPI: jest.fn(),
}));

jest.mock('src/services/summaryAPi', () => ({
  getSummaryAPI: jest.fn(),
}));

describe('LoginPage', () => {
  test('renders the login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeInTheDocument();
  });
});
