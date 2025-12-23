import type { Movie, MovieDetails } from '../types/movie.ts';

// Mock data for development when TMDB API is not available
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2010-07-16',
    vote_average: 8.8,
    vote_count: 34495,
    popularity: 29.108,
  },
  {
    id: 2,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    release_date: '2008-07-18',
    vote_average: 9.0,
    vote_count: 30619,
    popularity: 37.518,
  },
  {
    id: 3,
    title: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-07',
    vote_average: 8.4,
    vote_count: 32571,
    popularity: 28.649,
  },
  {
    id: 4,
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
    vote_count: 24269,
    popularity: 32.063,
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    overview: 'The lives of two mob hitmen, a boxer, and others intertwine.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-10-14',
    vote_average: 8.5,
    vote_count: 25893,
    popularity: 25.423,
  },
  {
    id: 6,
    title: 'Spider-Man: No Way Home',
    overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.',
    poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdrop_path: '/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    release_date: '2021-12-15',
    vote_average: 8.0,
    vote_count: 18452,
    popularity: 58.123,
  },
  {
    id: 7,
    title: 'The Avengers',
    overview: 'Earth\'s mightiest heroes must come together and learn to fight as a team.',
    poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    backdrop_path: '/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
    release_date: '2012-04-25',
    vote_average: 7.7,
    vote_count: 29166,
    popularity: 45.234,
  },
  {
    id: 8,
    title: 'Avatar',
    overview: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders.',
    poster_path: '/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2009-12-15',
    vote_average: 7.6,
    vote_count: 30788,
    popularity: 40.567,
  },
];

const mockMovieDetails: MovieDetails = {
  ...mockMovies[0],
  genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
  runtime: 148,
  status: 'Released',
  tagline: 'Your mind is the scene of the crime.',
  budget: 160000000,
  revenue: 836836967,
};

export const mockMovieApi = {
  getPopularMovies: async (): Promise<{ results: Movie[]; total_pages: number }> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      results: mockMovies,
      total_pages: 1,
    };
  },

  searchMovies: async (query: string): Promise<{ results: Movie[]; total_pages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const filtered = mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    return {
      results: filtered,
      total_pages: 1,
    };
  },

  getMovieDetails: async (): Promise<MovieDetails> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMovieDetails;
  },

  getMovieVideos: async (): Promise<{ results: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  }> }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      results: [
        {
          id: 'mock-trailer',
          key: 'YoHD9XEInc0',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ],
    };
  },

  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
