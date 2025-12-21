import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConfirmModal from '../(components)/ConfirmModal';

// Mock ThemeContext
jest.mock('', () => {
  const React = require('react');
  return {
    ThemeContext: React.createContext({
      darkMode: false,
      setDarkMode: jest.fn(),
    }),
  };
});

describe('ConfirmModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // Snapshot tests
  // =========================
  describe('Snapshot tests', () => {
    it('matches snapshot when visible', () => {
      const tree = render(
        <ConfirmModal
          visible={true}
          title="Notice"
          message="Snapshot message"
          onClose={mockOnClose}
        />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('matches snapshot with custom buttons', () => {
      const tree = render(
        <ConfirmModal
          visible={true}
          title="Confirm Action"
          message="Are you sure?"
          buttons={[
            { label: 'Yes', color: 'green', onPress: mockOnPress },
            { label: 'No', color: 'red', onPress: mockOnClose },
          ]}
          onClose={mockOnClose}
        />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  // =========================
  // Rendering tests
  // =========================
  describe('Rendering tests', () => {
    it('renders title and message correctly', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          title="Test Title"
          message="Test message"
          onClose={mockOnClose}
        />
      );

      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('Test message')).toBeTruthy();
    });

    it('renders default OK button when no buttons prop is provided', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          message="Only OK button"
          onClose={mockOnClose}
        />
      );

      expect(getByText('OK')).toBeTruthy();
    });

    it('renders custom buttons when buttons prop is provided', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          title="Custom Buttons"
          message="Choose one"
          buttons={[
            { label: 'Confirm', onPress: mockOnPress },
            { label: 'Cancel', onPress: mockOnClose },
          ]}
          onClose={mockOnClose}
        />
      );

      expect(getByText('Confirm')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('does not render message if message prop is not provided', () => {
      const { queryByText } = render(
        <ConfirmModal
          visible={true}
          title="No Message"
          onClose={mockOnClose}
        />
      );

      expect(queryByText('No Message')).toBeTruthy();
    });
  });

  // =========================
  // Interaction tests
  // =========================
  describe('Interaction tests', () => {
    it('calls onClose when default OK button is pressed', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          message="Press OK"
          onClose={mockOnClose}
        />
      );

      fireEvent.press(getByText('OK'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls custom button onPress and onClose when custom button is pressed', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          message="Confirm action"
          buttons={[
            { label: 'Confirm', onPress: mockOnPress },
          ]}
          onClose={mockOnClose}
        />
      );

      fireEvent.press(getByText('Confirm'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose even if button has no onPress', () => {
      const { getByText } = render(
        <ConfirmModal
          visible={true}
          message="Close only"
          buttons={[
            { label: 'Close' },
          ]}
          onClose={mockOnClose}
        />
      );

      fireEvent.press(getByText('Close'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
