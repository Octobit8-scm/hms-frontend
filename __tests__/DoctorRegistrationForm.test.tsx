import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DoctorRegistrationForm from '@/app/components/DoctorRegistrationForm';
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

describe('DoctorRegistrationForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockReset();
  });

  const renderForm = () => {
    return render(
      <TestWrapper>
        <DoctorRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    );
  };

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Specialization')).toBeInTheDocument();
    expect(screen.getByLabelText('License Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    mockRegister.mockResolvedValueOnce(true);
    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Specialization'), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'LIC123' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe', 'doctor');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
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
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toBeRequired();
      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
      expect(screen.getByLabelText('Specialization')).toBeRequired();
      expect(screen.getByLabelText('License Number')).toBeRequired();
      expect(screen.getByLabelText('Phone Number')).toBeRequired();
      expect(screen.getByLabelText('Years of Experience')).toBeRequired();
    });
  });

  it('shows loading state during registration', async () => {
    mockRegister.mockImplementationOnce(() => new Promise(() => {}));
    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Specialization'), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'LIC123' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registering/i })).toBeInTheDocument();
    });
  });
}); 