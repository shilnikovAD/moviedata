import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { WatchPartyPage } from './WatchPartyPage';
import watchPartyReducer from '../features/watchParty/watchPartySlice';
import moviesReducer from '../features/movies/moviesSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const meta = {
  title: 'Pages/WatchPartyPage',
  component: WatchPartyPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          movies: moviesReducer,
          favorites: favoritesReducer,
          watchParty: watchPartyReducer,
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
} satisfies Meta<typeof WatchPartyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRoomId: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Watch Party page with a room ID in the URL',
      },
    },
  },
};

