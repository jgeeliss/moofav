import { getFavorites } from './favorites.js';
import { fetchMovieGenres, fetchMovies, fetchMoviesByIds } from './moviesApi.js';

/**
 * Fetches available movie genres from the TMDB API.
 * @returns {Promise<Array<{ id: number, name: string }>>} Genre objects.
 */
export async function getMovieGenres() {
  try {
    return await fetchMovieGenres();
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

/**
 * Fetches movie data (all movies, search results, or favorites) and resolves
 * payload metadata for the UI layer to render.
 * @param {number} page - API page number.
 * @param {string | null} [genre=null] - Selected genre filter.
 * @param {string | null} [year=null] - Selected release year filter.
 * @param {string | null} [rating=null] - Minimum rating filter.
 * @param {string | null} [language=null] - Original language filter.
 * @param {string} [sort='popularity.desc'] - TMDB sort key.
 * @param {string | null} [searchQuery=null] - Search query.
 * @param {boolean} [favoritesOnly=false] - Whether to load favorites only.
 * @returns {Promise<boolean>} True when additional pages can be loaded.
 */
export async function fetchIMDBData(page, genre = null, year = null, rating = null, language = null, sort = 'popularity.desc', searchQuery = null, favoritesOnly = false) {
  if (favoritesOnly) {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      return {
        data: {
          results: [],
          page: 1,
          total_pages: 1,
        },
        hasMorePagesToLoad: false,
        emptyFavorites: true,
      };
    }

    try {
      const movies = await fetchMoviesByIds(favorites);
      return {
        data: {
          results: movies,
          page: 1,
          total_pages: 1,
        },
        hasMorePagesToLoad: false,
      };
    } catch (error) {
      return {
        data: null,
        hasMorePagesToLoad: false,
        errorMessage: `Error fetching favorite movies: ${error}`,
      };
    }
  }

  try {
    const data = await fetchMovies({
      page,
      genre,
      year,
      rating,
      language,
      sort,
      searchQuery,
    });

    return {
      data,
      hasMorePagesToLoad: data.page < data.total_pages,
    };
  } catch (error) {
    return {
      data: null,
      hasMorePagesToLoad: false,
      errorMessage: `Error fetching IMDB data: ${error}`,
    };
  }
}
