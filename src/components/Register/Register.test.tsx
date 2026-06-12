import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './index';

jest.mock('formik', () => ({
  Formik: ({ children }: any) => children({
    values: {},
    errors: {},
    touched: {},
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    submitForm: jest.fn(),
  }),
}));

jest.mock('antd', () => {
  const mockReact = require('react');

  const Form = Object.assign(
    ({ children, ...props }: any) => <form {...props}>{children}</form>,
    {
      Item: ({ children, label, required }: any) => {
        const child = mockReact.Children.only(children);
        const childProps = mockReact.isValidElement(child) ? child.props : {};

        return (
          <div>
            {label ? <label htmlFor={childProps.id}>{required ? `${label} *` : label}</label> : null}
            {children}
          </div>
        );
      },
    }
  );

  return {
    Card: ({ title, children }: any) => <section><div>{title}</div>{children}</section>,
    Form,
    Input: (props: any) => <input {...props} />,
    Select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
    DatePicker: (props: any) => <input {...props} />,
    Checkbox: ({ children, ...props }: any) => <label><input type="checkbox" {...props} />{children}</label>,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
    Steps: ({ items }: any) => <div>{items.map((item: any, index: number) => <div key={index}>{item.title}</div>)}</div>,
    Typography: { Title: ({ children }: any) => <h3>{children}</h3> },
    message: { error: jest.fn(), success: jest.fn() },
  };
});

jest.mock('src/services/registerAPI', () => ({ registerAPI: jest.fn() }));
jest.mock('src/services/validateUsernameAPI', () => ({ validateUsername: jest.fn() }));
jest.mock('src/services/validateEmailAPI', () => ({ validateEmail: jest.fn() }));
jest.mock('src/services/validatePhoneAPI', () => ({ validatePhone: jest.fn() }));

describe('RegisterPage', () => {
  test('renders the registration form and key actions', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
