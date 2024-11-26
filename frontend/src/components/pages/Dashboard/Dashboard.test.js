import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  it('should render the employees table with correct headers', () => {
    // Preveri, ali so pravilno prikazane glave tabele za pregled zaposlenih  -- test za workflow
    render(<Dashboard />);
    expect(screen.getByText(/Ime/i)).toBeInTheDocument();
    expect(screen.getByText(/Skupno število ur/i)).toBeInTheDocument();
    expect(screen.getByText(/Nadure/i)).toBeInTheDocument();
  });


});
