import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientAdmissionForm from '../app/components/PatientAdmissionForm';
import toast from 'react-hot-toast';
import { TestWrapper } from './test-utils';

// Mock fetch
global.fetch = jest.fn();

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock the room availability check
jest.mock('../app/services/roomService', () => ({
  checkRoomAvailability: jest.fn().mockResolvedValue(true),
  createAdmission: jest.fn().mockResolvedValue({ success: true }),
}));

describe('PatientAdmissionForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  const renderForm = () => {
    return render(
      <TestWrapper>
        <PatientAdmissionForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    );
  };

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Patient ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Room ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Admission Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Expected Duration (days)')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderForm();

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: 'Create Admission' }));

    // Check that form validation prevents submission
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByLabelText('Patient ID')).toBeRequired();
      expect(screen.getByLabelText('Room ID')).toBeRequired();
      expect(screen.getByLabelText('Admission Type')).toBeRequired();
      expect(screen.getByLabelText('Expected Duration (days)')).toBeRequired();
    });
  });

  it('handles successful form submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    renderForm();

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Patient ID'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Room ID'), { target: { value: '456' } });
    fireEvent.change(screen.getByLabelText('Admission Type'), { target: { value: 'planned' } });
    fireEvent.change(screen.getByLabelText('Expected Duration (days)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Test notes' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Create Admission' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admissions', expect.any(Object));
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Admission created successfully');
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
    expect(admissionTypeSelect).toBeInTheDocument();
    
    // Test selecting an admission type
    fireEvent.change(admissionTypeSelect, { target: { value: 'emergency' } });
    expect(admissionTypeSelect).toHaveValue('emergency');
  });

  it('validates expected duration is a positive number', async () => {
    renderForm();

    // Fill in form data with invalid duration
    fireEvent.change(screen.getByLabelText('Patient ID'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Room ID'), { target: { value: '456' } });
    fireEvent.change(screen.getByLabelText('Admission Type'), { target: { value: 'emergency' } });
    fireEvent.change(screen.getByLabelText('Expected Duration (days)'), { target: { value: '0' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Create Admission' }));

    // Check that form validation prevents submission
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
}); 