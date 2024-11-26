// Header.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter as Router } from 'react-router-dom';
import { auth } from '../../firebase';

// Mockiramo `auth.signOut` funkcijo, da preprečimo dejanski odjavni postopek
jest.mock('../../firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe('Header Component', () => {
  const mockSetRole = jest.fn(); // Mock funkcija za nastavljanje vloge uporabnika
  const mockSetIsAuthenticated = jest.fn(); // Mock funkcija za preverjanje pristnosti uporabnika

  afterEach(() => {
    jest.clearAllMocks(); // Po vsakem testu počistimo vse mock funkcije
  });

  it('should render all links for admin role', () => {
    // Preveri, ali so vsi povezovalni elementi vidni za admina
    render(
      <Router>
        <Header role="admin" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated} />
      </Router>
    );
    expect(screen.getByText(/Nadzorna plošča/i)).toBeInTheDocument(); // Povezava za nadzorno ploščo
    expect(screen.getByText(/Moje ure/i)).toBeInTheDocument(); // Povezava za "Moje ure"
    expect(screen.getByText(/Moji dopusti\/bolniške/i)).toBeInTheDocument(); // Povezava za "Moji dopusti/bolniške"
    expect(screen.getByText(/Odjava/i)).toBeInTheDocument(); // Gumb za odjavo
  });

  it('should not render admin link for non-admin role', () => {
    // Preveri, ali povezava za nadzorno ploščo NI vidna za uporabnika
    render(
      <Router>
        <Header role="user" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated} />
      </Router>
    );
    expect(screen.queryByText(/Nadzorna plošča/i)).not.toBeInTheDocument(); // Povezava za nadzorno ploščo ne obstaja
  });

  it('should call logout functions on logout button click', () => {
    // Preveri, ali se klici funkcij za odjavo sprožijo ob kliku na gumb "Odjava"
    render(
      <Router>
        <Header role="admin" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated} />
      </Router>
    );
    fireEvent.click(screen.getByText(/Odjava/i)); // Simuliraj klik na gumb "Odjava"
    expect(auth.signOut).toHaveBeenCalledTimes(1); // Preveri, ali je `auth.signOut` poklican enkrat
    expect(mockSetRole).toHaveBeenCalledWith(null); // Preveri, ali je `setRole` poklican z `null`
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false); // Preveri, ali je `setIsAuthenticated` poklican z `false`
  });

  it('should render the application title', () => {
    // tttPreveri, ali se naslov aplikacije pravilno izriše
    render(
      <Router>
        <Header role="user" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated} />
      </Router>
    );
    expect(screen.getByText(/Aplikacija/i)).toBeInTheDocument(); // Naslov aplikacije "Aplikacija"
  });
});
