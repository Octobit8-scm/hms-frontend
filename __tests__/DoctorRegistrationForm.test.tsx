import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DoctorRegistrationForm from '../app/components/DoctorRegistrationForm';
import toast from 'react-hot-toast';

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

describe('DoctorRegistrationForm', () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () => {
    return render(<DoctorRegistrationForm onCancel={mockOnCancel} />);
  };

  it('renders all form sections', () => {
    renderForm();

    // Check section headings
    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Professional Information')).toBeInTheDocument();
  });

  it('renders all required fields', () => {
    renderForm();

    // Account Information
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

    // Personal Information
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();

    // Professional Information
    expect(screen.getByLabelText('Specialization')).toBeInTheDocument();
    expect(screen.getByLabelText('License Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Consultation Fee')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    renderForm();

    // Fill in different passwords
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('handles successful form submission', async () => {
    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'doctor@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText('Specialization'), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText('License Number'), { target: { value: 'DOC123' } });
    fireEvent.change(screen.getByLabelText('Years of Experience'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText('Consultation Fee'), { target: { value: '100' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please login.');
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    renderForm();

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    // Check that form validation prevents submission
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();

    // Check for HTML5 validation messages
    expect(screen.getByLabelText('Email')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
    expect(screen.getByLabelText('First Name')).toBeInvalid();
    // ... add more field validations as needed
  });

  it('allows selecting department from predefined list', () => {
    renderForm();
    
    const departmentSelect = screen.getByLabelText('Department');
    
    // Check if all departments are available
    ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 
     'Dermatology', 'Psychiatry', 'General Medicine', 'Emergency Medicine', 'Surgery']
      .forEach(dept => {
        expect(screen.getByRole('option', { name: dept })).toBeInTheDocument();
      });

    // Test selecting a department
    fireEvent.change(departmentSelect, { target: { value: 'Cardiology' } });
    expect(departmentSelect).toHaveValue('Cardiology');
  });
}); 