import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice.ts';
import favoritesReducer from '../features/favorites/favoritesSlice.ts';
import { MovieCard } from './MovieCard.tsx';

const mockStore = configureStore({
  reducer: {
    movies: moviesReducer,
    favorites: favoritesReducer,
  },
});

const meta = {
  title: 'Components/MovieCard',
  component: MovieCard,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <div style={{ maxWidth: '250px' }}>
            <Story />
          </div>
        </BrowserRouter>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movie: {
      id: 1,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets through the use of dream-sharing technology',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2010-07-16',
      vote_average: 8.8,
      vote_count: 35000,
      popularity: 150.5,
    },
  },
};

export const HighRating: Story = {
  args: {
    movie: {
      id: 2,
      title: 'The Shawshank Redemption',
      overview: 'Two imprisoned men bond over a number of years',
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '1994-09-23',
      vote_average: 9.3,
      vote_count: 25000,
      popularity: 200,
    },
  },
};

export const LowRating: Story = {
  args: {
    movie: {
      id: 3,
      title: 'Low Rated Movie',
      overview: 'Not a great movie',
      poster_path: null,
      backdrop_path: null,
      release_date: '2023-01-01',
      vote_average: 3.2,
      vote_count: 100,
      popularity: 10,
    },
  },
};
