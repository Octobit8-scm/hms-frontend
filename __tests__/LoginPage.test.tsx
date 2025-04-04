import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { TestWrapper } from './test-utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock AuthContext
const mockLogin = jest.fn();
jest.mock('@/app/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
    register: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderLoginPage = () => {
    return render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
  };

  it('renders login form', () => {
    renderLoginPage();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce(true);
    renderLoginPage();

    // Fill in form data
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith('Login successful');
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValueOnce(error);
    renderLoginPage();

    // Fill in form data
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });

    // Submit form
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('shows loading state during login', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(() => {}));
    renderLoginPage();

    // Fill in form data
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-button')).toHaveTextContent('Signing in...');
    });
  });
}); 