import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientRegistrationForm from '@/app/components/PatientRegistrationForm';
import toast from 'react-hot-toast';
import { TestWrapper } from './test-utils';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/app/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    register: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
}));

describe('PatientRegistrationForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <TestWrapper>
        <PatientRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    );
  };

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    renderForm();

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check that form validation prevents submission
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toBeRequired();
      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
      expect(screen.getByLabelText('Date of Birth')).toBeRequired();
      expect(screen.getByLabelText('Gender')).toBeRequired();
      expect(screen.getByLabelText('Phone Number')).toBeRequired();
      expect(screen.getByLabelText('Address')).toBeRequired();
    });
  });

  it('shows loading state during registration', async () => {
    // Mock the auth context with a never-resolving register function
    jest.mock('@/app/context/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        register: () => new Promise(() => {}), // Never resolves
        login: jest.fn(),
        logout: jest.fn(),
        isLoading: true,
      }),
    }));

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registering/i })).toBeInTheDocument();
    });
  });
}); 