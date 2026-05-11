import { resetPagination } from './state.js';

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

export function setupMobileFilters({ filtersToggle, navContainer }) {
  const onMobileScreenQuery = window.matchMedia('(max-width: 768px)');
  let mobileFiltersHidden = onMobileScreenQuery.matches;

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
