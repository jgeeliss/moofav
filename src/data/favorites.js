/**
 * Reads favorite movie IDs from local storage.
 * @returns {number[]} Array of favorite TMDB movie IDs.
 */
export function getFavorites() {
  const favorites = localStorage.getItem('moofav-favorites');
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Persists favorite movie IDs to local storage.
 * @param {number[]} favorites - Favorite movie ID list.
 * @returns {void}
 */
function saveFavorites(favorites) {
  localStorage.setItem('moofav-favorites', JSON.stringify(favorites));
}

/**
 * Adds a movie ID to favorites when not present yet.
 * @param {{ id: number }} movie - Movie object containing an ID.
 * @returns {void}
 */
export function addToFavorites(movie) {
  const favorites = getFavorites();
  const notFavoriteYet = !favorites.includes(movie.id);
  if (notFavoriteYet) {
    favorites.push(movie.id);
    saveFavorites(favorites);
  }
}

/**
 * Removes a movie ID from favorites.
 * @param {number} movieId - Movie ID to remove.
 * @returns {void}
 */
export function removeFromFavorites(movieId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((favId) => favId !== movieId);
  saveFavorites(updatedFavorites);
}

/**
 * Checks whether a movie is currently marked as favorite.
 * @param {number} movieId - Movie ID to check.
 * @returns {boolean} True when movie ID exists in favorites.
 */
export function isFavorite(movieId) {
  const favorites = getFavorites();
  return favorites.includes(movieId);
}
