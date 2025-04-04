import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PharmacistRegistrationForm from '@/app/components/PharmacistRegistrationForm';
import { TestWrapper } from './test-utils';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock AuthContext
const mockRegister = jest.fn();
jest.mock('@/app/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    register: mockRegister,
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
}));

describe('PharmacistRegistrationForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockReset();
  });

  const renderForm = () => {
    return render(
      <TestWrapper>
        <PharmacistRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    );
  };

  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('License Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Education')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    mockRegister.mockResolvedValueOnce(true);

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'LIC123' } });
    fireEvent.change(screen.getByLabelText('Education'), { target: { value: 'PharmD' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe', 'pharmacist');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state during registration', async () => {
    mockRegister.mockImplementationOnce(() => new Promise(() => {}));

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'LIC123' } });
    fireEvent.change(screen.getByLabelText('Education'), { target: { value: 'PharmD' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registering/i })).toBeInTheDocument();
    });
  });

  it('handles registration failure', async () => {
    const error = new Error('Registration failed');
    mockRegister.mockRejectedValueOnce(error);

    // Mock console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'LIC123' } });
    fireEvent.change(screen.getByLabelText('Education'), { target: { value: 'PharmD' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Registration error:', error);
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });

    consoleSpy.mockRestore();
  });
});