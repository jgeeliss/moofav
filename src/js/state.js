// set initial state for the app, and helper function to reset pagination when filters change
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

export function resetPagination(state) {
  state.currentPage = 1;
  state.hasMorePagesToLoad = true;
}
