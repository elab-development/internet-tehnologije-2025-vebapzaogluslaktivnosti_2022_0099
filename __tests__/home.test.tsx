/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

// MOCK-ujemo komponente tako da vraćaju jednostavan string umesto JSX-a u samom mock pozivu
jest.mock('@/components/ReservationChart', () => {
  return function MockChart() { return <div data-testid="chart">Chart</div>; };
});
jest.mock('@/components/MapSection', () => {
  return function MockMap() { return <div data-testid="map">Map</div>; };
});

describe('Home Page', () => {
  it('trebalo bi da renderuje glavni naslov platforme', async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    
    const heading = screen.getByText(/Sve usluge na/i);
    expect(heading).toBeInTheDocument();
  });
});