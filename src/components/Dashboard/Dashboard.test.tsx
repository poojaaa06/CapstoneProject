import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './index';

jest.mock('antd', () => ({
  Row: ({ children }: any) => <div>{children}</div>,
  Col: ({ children }: any) => <div>{children}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
  Typography: { Title: ({ children }: any) => <h3>{children}</h3>, Text: ({ children }: any) => <span>{children}</span> },
  Table: ({ children }: any) => <table>{children}</table>,
  Button: ({ children }: any) => <button>{children}</button>,
  Space: ({ children }: any) => <div>{children}</div>,
  List: ({ children }: any) => <ul>{children}</ul>,
  Avatar: ({ children }: any) => <div>{children}</div>,
  Modal: ({ children }: any) => <div>{children}</div>,
  Descriptions: ({ children }: any) => <div>{children}</div>,
  message: { error: jest.fn(), success: jest.fn() },
  Grid: { useBreakpoint: () => ({ md: true }) },
  Drawer: ({ children }: any) => <div>{children}</div>,
  Segmented: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('echarts', () => ({
  init: () => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { metrics: [], activities: [], requests: [], trends: [], deptStats: [], statusData: [], quickStats: [] } }),
  }) as jest.Mock
) as jest.Mock;

describe('Dashboard', () => {
  test('renders the dashboard shell after loading data', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
