// set initial state for the app, and helper function to reset pagination when filters change
/**
 * Creates the initial mutable UI state for filtering and pagination.
 * @returns {{
 *   selectedGenre: string | null,
 *   selectedYear: string | null,
 *   selectedRating: string | null,
 *   selectedLanguage: string | null,
 *   selectedSort: string,
 *   searchQuery: string | null,
 *   showFavoritesOnly: boolean,
 *   currentPage: number,
 *   hasMorePagesToLoad: boolean,
 *   isLoading: boolean
 * }} Initial app state object.
 */
export function createInitialAppState() {
  return {
    selectedGenre: null,
    selectedYear: null,
    selectedRating: null,
    selectedLanguage: null,
    selectedSort: 'popularity.desc',
    searchQuery: null,
    showFavoritesOnly: false,
    currentPage: 1,
    hasMorePagesToLoad: true,
    isLoading: false,
  };
}

/**
 * Resets pagination fields when filters or query change.
 * @param {{ currentPage: number, hasMorePagesToLoad: boolean }} state - App state.
 * @returns {void}
 */
export function resetPagination(state) {
  state.currentPage = 1;
  state.hasMorePagesToLoad = true;
}
