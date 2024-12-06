import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Notification from './Notification';

describe('Notification Component', () => {
  it('renders the notification list title', () => {
    render(<Notification role="user" />);
    expect(screen.getByText(/Obvestila/i)).toBeInTheDocument();
  });

  it('shows the notification form for admin', () => {
    render(<Notification role="admin" />);
    expect(screen.getByLabelText(/Dodaj novo obvestilo/i)).toBeInTheDocument();
  });

  it('does not show the notification form for non-admin users', () => {
    render(<Notification role="user" />);
    expect(screen.queryByLabelText(/Dodaj novo obvestilo/i)).toBeNull();
  });
});
