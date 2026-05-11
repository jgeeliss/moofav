import './css/style.css'
import './css/dark-theme.css'
import './css/light-theme.css'
import './css/mobile.css'
import { fetchIMDBData, getMovieGenres } from './js/fetch.js'
import {
  renderEmptyFavoritesMessage,
  renderErrorMessage,
  renderMovies,
} from './js/movieRenderer.js'
import { setupLanguageToggle } from './js/i18n.js'
import { createInitialAppState } from './js/state.js'
import {
  getAppElements,
  populateGenreOptions,
  populateLanguageOptions,
  populateRatingOptions,
  populateYearOptions,
  renderApp,
} from './js/ui.js'
import {
  setupFavoritesToggle,
  setupMobileFilters,
  setupSearchAndFilterListeners,
  setupThemeToggle,
} from './js/filters.js'
import { setupInfiniteScroll } from './js/scrolling.js'

renderApp()

const elements = getAppElements()
const state = createInitialAppState()

setupLanguageToggle(elements.languageToggle)
setupThemeToggle(elements.themeToggle)
setupMobileFilters({
  filtersToggle: elements.filtersToggle,
  navContainer: elements.navContainer,
})

const genres = await getMovieGenres()
populateGenreOptions(elements.genreSelect, genres)
populateYearOptions(elements.yearSelect)
populateRatingOptions(elements.ratingSelect)
populateLanguageOptions(elements.languageSelect)

/**
 * Fetches movie payload for current state and delegates rendering to UI module.
 * @param {number} [page=1] - Page number to request from the API.
 * @returns {Promise<boolean>} Resolves to whether more pages are available.
 */
const refreshMovies = async (page = 1) => {
  const result = await fetchIMDBData(
    page,
    state.selectedGenre,
    state.selectedYear,
    state.selectedRating,
    state.selectedLanguage,
    state.selectedSort,
    state.searchQuery,
    state.showFavoritesOnly
  )

  if (result.errorMessage) {
    renderErrorMessage(elements.movieContainer, result.errorMessage)
    return false
  }

  if (result.emptyFavorites) {
    renderEmptyFavoritesMessage(elements.movieContainer)
    return false
  }

  renderMovies(elements.movieContainer, result.data, genres)
  return result.hasMorePagesToLoad
}

setupFavoritesToggle({
  favoritesToggle: elements.favoritesToggle,
  filtersContainer: elements.filtersContainer,
  searchContainer: elements.searchContainer,
  state,
  refreshMovies,
})

setupSearchAndFilterListeners({
  searchInput: elements.searchInput,
  filtersContainer: elements.filtersContainer,
  genreSelect: elements.genreSelect,
  yearSelect: elements.yearSelect,
  ratingSelect: elements.ratingSelect,
  sortSelect: elements.sortSelect,
  languageSelect: elements.languageSelect,
  state,
  refreshMovies,
})

/**
 * Loads the next page when infinite scroll requests more content.
 * @returns {Promise<boolean>} Resolves to whether more pages are available.
 */
const loadMoreMovies = () => {
  state.currentPage++
  return refreshMovies(state.currentPage)
}

setupInfiniteScroll({
  sentinel: elements.sentinel,
  state,
  onLoadMore: loadMoreMovies,
})

refreshMovies(1).then((hasMore) => {
  state.isLoading = false
  state.hasMorePagesToLoad = hasMore
})