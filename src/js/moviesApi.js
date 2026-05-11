const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = '0f0bf386975247347f8ced16ab3804e7';

/**
 * Builds a TMDB URL with API key and query parameters.
 * @param {string} path - TMDB endpoint path.
 * @param {Record<string, string | number | null | undefined>} params - Query params.
 * @returns {string} Fully-qualified URL.
 */
function buildTmdbUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Fetches JSON and throws on non-2xx responses.
 * @param {string} url - Endpoint URL.
 * @returns {Promise<any>} Parsed JSON payload.
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches available movie genres from TMDB.
 * @returns {Promise<Array<{ id: number, name: string }>>} Genre objects.
 */
export async function fetchMovieGenres() {
  const url = buildTmdbUrl('/genre/movie/list');
  const data = await fetchJson(url);
  return Array.isArray(data.genres) ? data.genres : [];
}

/**
 * Fetches movie results from search or discover endpoints.
 * @param {{
 *   page: number,
 *   genre?: string | null,
 *   year?: string | null,
 *   rating?: string | null,
 *   language?: string | null,
 *   sort?: string,
 *   searchQuery?: string | null
 * }} params - Query options.
 * @returns {Promise<{ results: Array<any>, page: number, total_pages: number }>}
 */
export async function fetchMovies(params) {
  if (params.searchQuery) {
    const searchUrl = buildTmdbUrl('/search/movie', {
      query: params.searchQuery,
      page: params.page,
    });
    return fetchJson(searchUrl);
  }

  const discoverUrl = buildTmdbUrl('/discover/movie', {
    'vote_count.gte': 1000,
    with_original_language: params.language || 'en',
    with_genres: params.genre,
    primary_release_year: params.year,
    'vote_average.gte': params.rating,
    sort_by: params.sort || 'popularity.desc',
    page: params.page,
  });

  return fetchJson(discoverUrl);
}

/**
 * Fetches full movie records for the provided TMDB IDs.
 * @param {number[]} ids - Favorite movie IDs.
 * @returns {Promise<Array<any>>} Movie detail payloads.
 */
export function fetchMoviesByIds(ids) {
  return Promise.all(
    ids.map((id) => {
      const url = buildTmdbUrl(`/movie/${id}`);
      return fetchJson(url);
    })
  );
}
