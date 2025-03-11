import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientAdmissionForm from '../app/components/PatientAdmissionForm';
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

// Mock the room availability check
jest.mock('../app/services/roomService', () => ({
  checkRoomAvailability: jest.fn(),
}));

describe('PatientAdmissionForm', () => {
  const mockOnCancel = jest.fn();
  const mockPatient = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    phoneNumber: '1234567890',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () => {
    return render(<PatientAdmissionForm patient={mockPatient} onCancel={mockOnCancel} />);
  };

  it('renders all form sections', () => {
    renderForm();

    // Check section headings
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Admission Details')).toBeInTheDocument();
    expect(screen.getByText('Room Selection')).toBeInTheDocument();
    expect(screen.getByText('Insurance Information')).toBeInTheDocument();
  });

  it('displays patient information correctly', () => {
    renderForm();

    // Check if patient information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders all required admission fields', () => {
    renderForm();

    // Admission Details
    expect(screen.getByLabelText('Admission Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Reason for Admission')).toBeInTheDocument();
    expect(screen.getByLabelText('Expected Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Primary Doctor')).toBeInTheDocument();

    // Room Selection
    expect(screen.getByLabelText('Room Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Floor')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Number')).toBeInTheDocument();

    // Insurance Information
    expect(screen.getByLabelText('Insurance Provider')).toBeInTheDocument();
    expect(screen.getByLabelText('Policy Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Group Number')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderForm();

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: 'Admit Patient' }));

    // Check that form validation prevents submission
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();

    // Check for HTML5 validation messages
    expect(screen.getByLabelText('Admission Type')).toBeInvalid();
    expect(screen.getByLabelText('Reason for Admission')).toBeInvalid();
    expect(screen.getByLabelText('Room Type')).toBeInvalid();
  });

  it('handles successful form submission', async () => {
    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Admission Type'), { target: { value: 'emergency' } });
    fireEvent.change(screen.getByLabelText('Reason for Admission'), { target: { value: 'Heart attack' } });
    fireEvent.change(screen.getByLabelText('Expected Duration'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Primary Doctor'), { target: { value: 'Dr. Smith' } });
    fireEvent.change(screen.getByLabelText('Room Type'), { target: { value: 'private' } });
    fireEvent.change(screen.getByLabelText('Floor'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Room Number'), { target: { value: '201' } });
    fireEvent.change(screen.getByLabelText('Insurance Provider'), { target: { value: 'Blue Cross' } });
    fireEvent.change(screen.getByLabelText('Policy Number'), { target: { value: 'BC123456' } });
    fireEvent.change(screen.getByLabelText('Group Number'), { target: { value: 'GROUP789' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Admit Patient' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Patient admitted successfully!');
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('allows selecting admission type from predefined options', () => {
    renderForm();
    
    const admissionTypeSelect = screen.getByLabelText('Admission Type');
    
    // Check if all admission types are available
    ['emergency', 'elective', 'transfer', 'observation'].forEach(type => {
      expect(screen.getByRole('option', { name: type })).toBeInTheDocument();
    });

    // Test selecting an admission type
    fireEvent.change(admissionTypeSelect, { target: { value: 'emergency' } });
    expect(admissionTypeSelect).toHaveValue('emergency');
  });

  it('allows selecting room type from predefined options', () => {
    renderForm();
    
    const roomTypeSelect = screen.getByLabelText('Room Type');
    
    // Check if all room types are available
    ['private', 'semi-private', 'ward', 'icu'].forEach(type => {
      expect(screen.getByRole('option', { name: type })).toBeInTheDocument();
    });

    // Test selecting a room type
    fireEvent.change(roomTypeSelect, { target: { value: 'private' } });
    expect(roomTypeSelect).toHaveValue('private');
  });

  it('validates room availability before submission', async () => {
    const { checkRoomAvailability } = require('../app/services/roomService');
    checkRoomAvailability.mockResolvedValue(false);

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Room Type'), { target: { value: 'private' } });
    fireEvent.change(screen.getByLabelText('Floor'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Room Number'), { target: { value: '201' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Admit Patient' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Selected room is not available');
    });
  });

  it('handles insurance information validation', async () => {
    renderForm();

    // Fill in form data with invalid insurance information
    fireEvent.change(screen.getByLabelText('Insurance Provider'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Policy Number'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Group Number'), { target: { value: '' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Admit Patient' }));

    // Check that form validation prevents submission
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();

    // Check for HTML5 validation messages
    expect(screen.getByLabelText('Insurance Provider')).toBeInvalid();
    expect(screen.getByLabelText('Policy Number')).toBeInvalid();
    expect(screen.getByLabelText('Group Number')).toBeInvalid();
  });

  it('allows entering expected duration in days', () => {
    renderForm();
    
    const durationInput = screen.getByLabelText('Expected Duration');
    
    // Test entering valid duration
    fireEvent.change(durationInput, { target: { value: '5' } });
    expect(durationInput).toHaveValue(5);

    // Test entering invalid duration
    fireEvent.change(durationInput, { target: { value: '-1' } });
    expect(durationInput).toBeInvalid();
  });
}); 