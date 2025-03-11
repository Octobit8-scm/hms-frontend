import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientRegistrationForm from '../app/components/PatientRegistrationForm';
import toast from 'react-hot-toast';

// Mock the dependencies
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('PatientRegistrationForm', () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<PatientRegistrationForm onCancel={mockOnCancel} />);

    // Check for section headings
    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Medical Information')).toBeInTheDocument();

    // Check for required input fields
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /gender/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /blood group/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<PatientRegistrationForm onCancel={mockOnCancel} />);
    
    // Fill in the form
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
    await userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await userEvent.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /gender/i }), 'male');
    await userEvent.type(screen.getByRole('textbox', { name: /phone number/i }), '1234567890');
    await userEvent.type(screen.getByRole('textbox', { name: /address/i }), '123 Main St');
    await userEvent.type(screen.getByRole('textbox', { name: /city/i }), 'Anytown');
    await userEvent.type(screen.getByRole('textbox', { name: /state/i }), 'State');
    await userEvent.type(screen.getByRole('textbox', { name: /zip code/i }), '12345');
    await userEvent.type(screen.getByRole('textbox', { name: /emergency contact name/i }), 'Jane Doe');
    await userEvent.type(screen.getByRole('textbox', { name: /emergency contact phone/i }), '0987654321');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /blood group/i }), 'O+');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /register/i });
    await userEvent.click(submitButton);

    // Check if success toast was shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please login.');
    });

    // Check if onCancel was called (to return to login)
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    render(<PatientRegistrationForm onCancel={mockOnCancel} />);
    
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'differentpassword');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await userEvent.click(submitButton);

    // Fill in required fields to allow form submission
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await userEvent.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /gender/i }), 'male');
    await userEvent.type(screen.getByRole('textbox', { name: /phone number/i }), '1234567890');
    await userEvent.type(screen.getByRole('textbox', { name: /address/i }), '123 Main St');
    await userEvent.type(screen.getByRole('textbox', { name: /city/i }), 'Anytown');
    await userEvent.type(screen.getByRole('textbox', { name: /state/i }), 'State');
    await userEvent.type(screen.getByRole('textbox', { name: /zip code/i }), '12345');
    await userEvent.type(screen.getByRole('textbox', { name: /emergency contact name/i }), 'Jane Doe');
    await userEvent.type(screen.getByRole('textbox', { name: /emergency contact phone/i }), '0987654321');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /blood group/i }), 'O+');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<PatientRegistrationForm onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 