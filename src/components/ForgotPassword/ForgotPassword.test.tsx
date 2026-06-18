import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../Login';

const mockFormik = {
  values: { user_unique_id: '', user_password: '', remember: true },
  touched: {},
  errors: {},
  isSubmitting: false,
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setFieldValue: jest.fn(),
  handleSubmit: jest.fn(),
};

jest.mock('formik', () => ({
  useFormik: () => mockFormik,
  Formik: ({ children }: any) => children(mockFormik),
  Form: ({ children }: any) => <form>{children}</form>,
}));

jest.mock('crypto-js', () => ({
  AES: { encrypt: () => ({ toString: () => 'encrypted' }) },
}));

jest.mock('antd', () => {
  const InputComponent = (props: any) => <input {...props} />;
  (InputComponent as any).Password = (props: any) => <input type="password" {...props} />;

  return {
    App: {
      useApp: () => ({
        notification: {
          success: jest.fn(),
          error: jest.fn(),
          warning: jest.fn(),
          info: jest.fn(),
        },
      }),
    },
    Card: ({ children }: any) => <div>{children}</div>,
    Form: Object.assign(({ children }: any) => <form>{children}</form>, {
      Item: ({ children }: any) => <div>{children}</div>,
    }),
    Input: InputComponent,
    Checkbox: ({ children, ...props }: any) => (
      <label>
        <input type="checkbox" {...props} />
        {children}
      </label>
    ),
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

describe('ForgotPassword flow', () => {
  test('shows the forgot password link on the login screen', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeInTheDocument();
  });
});