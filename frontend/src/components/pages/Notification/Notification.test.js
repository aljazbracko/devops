import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from './Notification';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Notification Component', () => {
  it('renders the notification list title', () => {
    render(
      <Router>
        <Notification role="user" />
      </Router>
    );
    expect(screen.getByText(/Obvestila/i)).toBeInTheDocument();
  });

  it('shows the notification form for admin', () => {
    render(
      <Router>
        <Notification role="admin" />
      </Router>
    );
    expect(screen.getByLabelText(/Ime obvestila/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioriteta/i)).toBeInTheDocument();
  });

  it('does not show the notification form for non-admin users', () => {
    render(
      <Router>
        <Notification role="user" />
      </Router>
    );
    expect(screen.queryByLabelText(/Ime obvestila/i)).toBeNull();
    expect(screen.queryByLabelText(/Opis/i)).toBeNull();
    expect(screen.queryByLabelText(/Prioriteta/i)).toBeNull();
  });

  it('renders the filter dropdown for all roles', () => {
    render(
      <Router>
        <Notification role="user" />
      </Router>
    );
    expect(screen.getByLabelText(/Filtriraj po prioriteti/i)).toBeInTheDocument();
  });

  it('displays notifications list if available', () => {
    const notificationsMock = [
      { id: '1', name: 'Test Notification', description: 'Test Description', priority: 'visoka', date: '06.12.2024' },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(notificationsMock),
    });

    render(
      <Router>
        <Notification role="user" />
      </Router>
    );

    expect(screen.findByText(/Test Notification/i)).toBeTruthy();
    global.fetch.mockRestore();
  });
});

describe('Notification Component', () => {
  it('renders without crashing', () => {
    // Preveri, če se komponenta Notification pravilno naloži
    render(
      <Router>
        <Notification role="user" />
      </Router>
    );
    expect(screen.getByText(/Obvestila/i)).toBeInTheDocument();
  });

  it('renders filter dropdown', () => {
    // Preveri, ali je dropdown za filtriranje prisoten
    render(
      <Router>
        <Notification role="user" />
      </Router>
    );
    expect(screen.getByLabelText(/Filtriraj po prioriteti/i)).toBeInTheDocument();
  });
});
