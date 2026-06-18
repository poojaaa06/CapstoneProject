import React from 'react';
import { render, screen } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

jest.mock('./components/Login/index', () => () => <div>Login Page</div>);
jest.mock('./components/Register/index', () => () => <div>Register Page</div>);
jest.mock('src/components/ForgotPassword', () => () => <div>Forgot Password Page</div>);
jest.mock('./protected_routes/ProtectedRoutes', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('./utils/404', () => () => <div>Not Found Page</div>);
jest.mock('./components/Dashboard/index', () => () => <div>Dashboard Page</div>);
jest.mock('./components/Assets/index', () => () => <div>Assets Page</div>);
jest.mock('./components/MaintenanceOrders/index', () => () => <div>Maintenance Orders Page</div>);
jest.mock('./components/WorkInstructions/index', () => () => <div>Work Instructions Page</div>);
jest.mock('./components/MyRequests/index', () => () => <div>My Requests Page</div>);
jest.mock('./components/Profile/index', () => ({ Profile: () => <div>Profile Page</div> }));
jest.mock('./components/Products/index', () => ({ Products: () => <div>Products Page</div> }));
jest.mock('./components/Inventory/index', () => ({ Inventory: () => <div>Inventory Page</div> }));
jest.mock('./components/UserServices/index', () => ({ UserServices: () => <div>User Services</div> }));
jest.mock('./theme/antdTheme', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

const App = require('./App').default;

describe('App', () => {
  test('renders the login route by default', () => {
    render(<App />);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('includes the offline fallback page content', () => {
    const offlineHtmlPath = path.join(__dirname, '..', 'public', 'offline.html');
    const html = fs.readFileSync(offlineHtmlPath, 'utf8');

    expect(html).toContain('You are Offline');
    expect(html).toContain('Offline Mode');
    expect(html).toContain('Retry');
  });
});