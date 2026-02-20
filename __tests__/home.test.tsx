/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

// MOCK-ujemo komponente koje koriste mape i grafikone da ne bi pucao test
jest.mock('@/components/ReservationChart', () => () => <div data-testid="chart">Chart</div>);
jest.mock('@/components/MapSection', () => () => <div data-testid="map">Map</div>);

describe('Home Page', () => {
  it('trebalo bi da renderuje glavni naslov platforme', async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    
    const heading = screen.getByText(/Sve usluge na/i);
    expect(heading).toBeInTheDocument();
  });
});