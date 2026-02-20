/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

// MOCK-ujemo komponente koje bi mogle da prave problem u test okruženju
jest.mock('@/components/ReservationChart', () => {
  return function MockChart() { return <div data-testid="chart">Chart</div>; };
});
jest.mock('@/components/MapSection', () => {
  return function MockMap() { return <div data-testid="map">Map</div>; };
});

jest.mock('@/components/Navbar', () => {
  return function MockNavbar() { return <nav data-testid="navbar">Navbar Mock</nav>; };
});

describe('Home Page', () => {
  it('trebalo bi da renderuje glavni naslov platforme', async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    
    const heading = screen.getByText(/Sve usluge na/i);
    expect(heading).toBeInTheDocument();
  });
});