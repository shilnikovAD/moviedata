import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar.tsx';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', () => {
    let searchQuery = '';
    const handleSearch = (query: string) => {
      searchQuery = query;
    };

    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'test movie' } });
    fireEvent.click(button);

    expect(searchQuery).toBe('test movie');
  });

  it('disables button when input is empty', () => {
    render(<SearchBar onSearch={() => {}} />);
    const button = screen.getByText('Search');
    expect(button).toBeDisabled();
  });
});
