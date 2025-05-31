import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeScreen from '../components/HomeScreen';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../lib/theme';

// Mock the navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock the setTimeout to speed up tests
jest.useFakeTimers();

describe('HomeScreen Component', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  test('displays loading indicator initially', () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('renders welcome message after loading', async () => {
    renderWithTheme(<HomeScreen />);
    
    // Fast-forward through the setTimeout
    jest.advanceTimersByTime(1000);
    
    // Wait for the component to update
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
    
    // Now check for the welcome message
    expect(screen.getByText(/Welcome to ChopNow/i)).toBeInTheDocument();
  });
});
