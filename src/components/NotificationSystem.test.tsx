import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotification } from './NotificationSystem';

// Test component that uses the notification hook
function TestComponent() {
  const { success, error, warning, info, notifications } = useNotification();

  return (
    <div>
      <button onClick={() => success('Success Title', 'Success message')}>
        Show Success
      </button>
      <button onClick={() => error('Error Title', 'Error message')}>
        Show Error
      </button>
      <button onClick={() => warning('Warning Title', 'Warning message')}>
        Show Warning
      </button>
      <button onClick={() => info('Info Title', 'Info message')}>
        Show Info
      </button>
      <div data-testid="notification-count">{notifications.length}</div>
    </div>
  );
}

describe('NotificationSystem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should render children', () => {
    render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should show success notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should show error notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show warning notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Warning'));

    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should show info notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));

    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should auto-dismiss notification after duration', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success Title')).toBeInTheDocument();

    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText('Success Title')).not.toBeInTheDocument();
    });
  });

  it('should manually dismiss notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success Title')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Success Title')).not.toBeInTheDocument();
  });

  it('should show multiple notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));
    fireEvent.click(screen.getByText('Show Warning'));

    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Warning Title')).toBeInTheDocument();

    expect(screen.getByTestId('notification-count').textContent).toBe('3');
  });

  it('should throw error when useNotification is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useNotification must be used within NotificationProvider');

    consoleError.mockRestore();
  });
});
