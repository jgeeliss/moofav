import { resetPagination } from './state.js';

/**
 * Initializes the theme toggle and persists user theme preference.
 * @param {HTMLElement} themeToggle - Theme toggle button element.
 * @returns {void}
 */
export function setupThemeToggle(themeToggle) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '○';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '○' : '●';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/**
 * Sets up mobile filter collapse/expand behavior based on viewport width.
 * @param {{ filtersToggle: HTMLElement, navContainer: HTMLElement }} params - UI refs.
 * @returns {void}
 */
export function setupMobileFilters({ filtersToggle, navContainer }) {
  const onMobileScreenQuery = window.matchMedia('(max-width: 768px)');
  let mobileFiltersHidden = onMobileScreenQuery.matches;

  /**
   * Synchronizes filter container visibility with current viewport and toggle state.
   * @returns {void}
   */
  function updateMobileFiltersVisibility() {
    if (onMobileScreenQuery.matches) {
      navContainer.classList.toggle('mobile-collapsed', mobileFiltersHidden);
    } else {
      navContainer.classList.remove('mobile-collapsed');
    }
  }

  filtersToggle.addEventListener('click', () => {
    mobileFiltersHidden = !mobileFiltersHidden;
    updateMobileFiltersVisibility();
  });

  onMobileScreenQuery.addEventListener('change', (onMobile) => {
    mobileFiltersHidden = onMobile.matches;
    updateMobileFiltersVisibility();
  });

  updateMobileFiltersVisibility();
}

/**
 * Configures favorites-only toggle and triggers refresh when changed.
 * @param {{
 *   favoritesToggle: HTMLElement,
 *   filtersContainer: HTMLElement,
 *   searchContainer: HTMLElement,
 *   state: {
 *     showFavoritesOnly: boolean,
 *     currentPage: number,
 *     hasMorePagesToLoad: boolean
 *   },
 *   refreshMovies: (page: number) => Promise<boolean>
 * }} params - Required UI refs and state handlers.
 * @returns {void}
 */
export function setupFavoritesToggle({
  favoritesToggle,
  filtersContainer,
  searchContainer,
  state,
  refreshMovies,
}) {
  favoritesToggle.addEventListener('click', () => {
    state.showFavoritesOnly = !state.showFavoritesOnly;
    favoritesToggle.textContent = state.showFavoritesOnly ? '♥' : '♡';
    favoritesToggle.classList.toggle('favorite', state.showFavoritesOnly);

    resetPagination(state);

    filtersContainer.style.display = state.showFavoritesOnly ? 'none' : '';
    searchContainer.style.display = state.showFavoritesOnly ? 'none' : '';

    refreshMovies(1);
  });
}

/**
 * Binds search and dropdown filters to state updates and first-page reloads.
 * @param {{
 *   searchInput: HTMLInputElement,
 *   filtersContainer: HTMLElement,
 *   genreSelect: HTMLSelectElement,
 *   yearSelect: HTMLSelectElement,
 *   ratingSelect: HTMLSelectElement,
 *   sortSelect: HTMLSelectElement,
 *   languageSelect: HTMLSelectElement,
 *   state: {
 *     searchQuery: string | null,
 *     selectedGenre: string | null,
 *     selectedYear: string | null,
 *     selectedRating: string | null,
 *     selectedSort: string,
 *     selectedLanguage: string | null,
 *     currentPage: number,
 *     hasMorePagesToLoad: boolean
 *   },
 *   refreshMovies: (page: number) => Promise<boolean>
 * }} params - UI refs, state object and refresh callback.
 * @returns {void}
 */
export function setupSearchAndFilterListeners({
  searchInput,
  filtersContainer,
  genreSelect,
  yearSelect,
  ratingSelect,
  sortSelect,
  languageSelect,
  state,
  refreshMovies,
}) {
  /**
   * Applies a filter mutation and refreshes results from page 1.
   * @param {() => void} updateCallback - State mutation callback.
   * @returns {void}
   */
  function applyFilterChange(updateCallback) {
    updateCallback();
    resetPagination(state);
    refreshMovies(1);
  }

  searchInput.addEventListener('input', (e) => {
    applyFilterChange(() => {
      state.searchQuery = e.target.value.trim() || null;
      filtersContainer.style.display = state.searchQuery ? 'none' : '';
    });
  });

  genreSelect.addEventListener('change', (e) => {
    applyFilterChange(() => {
      state.selectedGenre = e.target.value || null;
    });
  });

  yearSelect.addEventListener('change', (e) => {
    applyFilterChange(() => {
      state.selectedYear = e.target.value || null;
    });
  });

  ratingSelect.addEventListener('change', (e) => {
    applyFilterChange(() => {
      state.selectedRating = e.target.value || null;
    });
  });

  sortSelect.addEventListener('change', (e) => {
    applyFilterChange(() => {
      state.selectedSort = e.target.value;
    });
  });

  languageSelect.addEventListener('change', (e) => {
    applyFilterChange(() => {
      state.selectedLanguage = e.target.value || null;
    });
  });
}
