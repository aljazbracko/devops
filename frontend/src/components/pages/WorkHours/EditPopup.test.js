import React from 'react';
import { render, screen } from '@testing-library/react';
import EditPopup from './EditPopup';

describe('EditPopup Component', () => {
  it('should render the popup title', () => {
    // Preveri, ali se naslov "Edit Work Hours" pravilno prikazuje
    render(
      <EditPopup
        workDay={{ date: '2023-12-25', hours: 8, overtime: 2 }}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByText(/Edit Work Hours/i)).toBeInTheDocument();
  });

  it('should display the Save and Cancel buttons', () => {
    // Preveri, ali se gumba "Save" in "Cancel" pravilno izrisujeta
    render(
      <EditPopup
        workDay={{ date: '2023-12-25', hours: 8, overtime: 2 }}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });
});
