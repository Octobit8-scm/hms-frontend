import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../app/page';
import { AuthProvider } from '../app/context/AuthContext';
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

// Mock the registration form components
jest.mock('../app/components/PatientRegistrationForm', () => {
  return function MockPatientRegistrationForm({ onCancel }: { onCancel: () => void }) {
    return <div data-testid="patient-registration-form"><button onClick={onCancel}>Cancel</button></div>;
  };
});

jest.mock('../app/components/DoctorRegistrationForm', () => {
  return function MockDoctorRegistrationForm({ onCancel }: { onCancel: () => void }) {
    return <div data-testid="doctor-registration-form"><button onClick={onCancel}>Cancel</button></div>;
  };
});

jest.mock('../app/components/PharmacistRegistrationForm', () => {
  return function MockPharmacistRegistrationForm({ onCancel }: { onCancel: () => void }) {
    return <div data-testid="pharmacist-registration-form"><button onClick={onCancel}>Cancel</button></div>;
  };
});

describe('LoginPage', () => {
  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with role selection', () => {
    renderLoginPage();
    
    expect(screen.getByText('MediHub')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByText('Select your role')).toBeInTheDocument();
    
    // Check if all role buttons are present
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Doctor')).toBeInTheDocument();
    expect(screen.getByText('Nurse')).toBeInTheDocument();
    expect(screen.getByText('Pharmacist')).toBeInTheDocument();
    expect(screen.getByText('Receptionist')).toBeInTheDocument();
    expect(screen.getByText('Patient')).toBeInTheDocument();
  });

  it('shows login form when a role is selected', async () => {
    renderLoginPage();
    
    // Click on doctor role
    fireEvent.click(screen.getByText('Doctor'));
    
    // Check if login form is displayed
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('pre-fills credentials when selecting a role', () => {
    renderLoginPage();
    
    // Click on doctor role
    fireEvent.click(screen.getByText('Doctor'));
    
    // Check if credentials are pre-filled
    expect(screen.getByPlaceholderText('Email address')).toHaveValue('doctor@hospital.com');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('doctor123');
  });

  it('shows patient registration form when clicking patient registration link', () => {
    renderLoginPage();
    
    fireEvent.click(screen.getByText('New patient? Register here'));
    
    expect(screen.getByTestId('patient-registration-form')).toBeInTheDocument();
    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
  });

  it('shows doctor registration form when clicking doctor registration link', () => {
    renderLoginPage();
    
    fireEvent.click(screen.getByText('Doctor registration'));
    
    expect(screen.getByTestId('doctor-registration-form')).toBeInTheDocument();
    expect(screen.getByText('Doctor Registration')).toBeInTheDocument();
  });

  it('shows pharmacist registration form when clicking pharmacist registration link', () => {
    renderLoginPage();
    
    fireEvent.click(screen.getByText('Pharmacist registration'));
    
    expect(screen.getByTestId('pharmacist-registration-form')).toBeInTheDocument();
    expect(screen.getByText('Pharmacist Registration')).toBeInTheDocument();
  });

  it('returns to role selection when clicking back button', () => {
    renderLoginPage();
    
    // First select a role
    fireEvent.click(screen.getByText('Doctor'));
    
    // Click back button
    fireEvent.click(screen.getByText('Back to role selection'));
    
    // Check if we're back to role selection
    expect(screen.getByText('Select your role')).toBeInTheDocument();
  });

  it('returns to login page when canceling registration', () => {
    renderLoginPage();
    
    // Go to patient registration
    fireEvent.click(screen.getByText('New patient? Register here'));
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if we're back to role selection
    expect(screen.getByText('Select your role')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    renderLoginPage();
    
    // Select role and submit form
    fireEvent.click(screen.getByText('Doctor'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  it('handles login failure', async () => {
    const mockLogin = jest.fn().mockResolvedValue(false);
    jest.spyOn(require('../app/context/AuthContext'), 'useAuth').mockImplementation(() => ({
      login: mockLogin,
    }));

    renderLoginPage();
    
    // Select role and modify credentials
    fireEvent.click(screen.getByText('Doctor'));
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'wrong@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
}); 