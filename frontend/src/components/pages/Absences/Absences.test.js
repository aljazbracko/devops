import React from 'react';
import { render, screen } from '@testing-library/react';
import Absences from './Absences';

describe('Absences Component', () => {
  it('should render the table headers', () => {
    // Preveri, ali so glave tabele pravilno prikazane
    render(<Absences />);
    expect(screen.getByText(/Ime in Priimek/i)).toBeInTheDocument();
    expect(screen.getByText(/Vrsta odsotnosti/i)).toBeInTheDocument();
    expect(screen.getByText(/Datum od/i)).toBeInTheDocument();
    expect(screen.getByText(/Datum do/i)).toBeInTheDocument();
  });

  it('should render all mock absence data', () => {
    // Preveri, ali so vsi podatki iz `mockAbsences` pravilno prikazani
    render(<Absences />);
    expect(screen.getByText(/Janez Novak/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana Kovač/i)).toBeInTheDocument();
    expect(screen.getByText(/Marko Zupan/i)).toBeInTheDocument();
    expect(screen.getByText(/Eva Horvat/i)).toBeInTheDocument();
  });

  it('should render correct absence types', () => {
    // Preveri, ali so vrste odsotnosti pravilno prikazane
    render(<Absences />);
    const absenceTypes = screen.getAllByText(/Dopust|Bolniška/i);
    expect(absenceTypes.length).toBe(4); // Pričakujemo 4 vrstice s tipi odsotnosti
  });
});
