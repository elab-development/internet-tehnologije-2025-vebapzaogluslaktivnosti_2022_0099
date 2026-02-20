/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('trebalo bi da renderuje naslov platforme', async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    
    const heading = screen.getByText(/Dobrodošli na platformu za usluge/i);
    
    expect(heading).toBeInTheDocument();
  });
});