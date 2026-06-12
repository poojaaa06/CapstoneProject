import React from 'react';
import { render, screen } from '@testing-library/react';
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
 
global.fetch = jest.fn(async () => ({
  ok: true,
  json: async () => ({
    success: true,
    data: {
      metrics: [],
      activities: [],
      requests: [],
      trends: [],
      deptStats: [],
      statusData: [],
      quickStats: [],
    },
  }),
})) as unknown as typeof fetch;
 
describe('Dashboard', () => {
  test('renders the dashboard screen', async () => {
    render(<Dashboard />);
 
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
 
 