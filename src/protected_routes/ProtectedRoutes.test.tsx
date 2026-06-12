import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';

jest.mock('src/context/appContext', () => ({
  useAppContext: () => ({ setUserDetails: jest.fn() }),
}));

jest.mock('src/layout', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProtectedRoutes', () => {
  test('renders the outlet content when access is allowed', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
  });
});
