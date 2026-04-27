import './css/style.css'
import './css/dark-theme.css'
import './css/light-theme.css'
import './css/mobile.css'
import { fetchIMDBData, getMovieGenres } from './js/fetch.js'
import translationsData from './dictionary.json'

let currentLanguage = 'en';

function updateLanguage(lang) {
  currentLanguage = lang;
  const t = translationsData[lang];
  
  // Update labels
  document.querySelector('label[for="search-input"]').textContent = t.search;
  document.querySelector('#search-input').placeholder = t.searchPlaceholder;
  document.querySelector('label[for="genre-select"]').textContent = t.genre;
  document.querySelector('label[for="year-select"]').textContent = t.year;
  document.querySelector('label[for="rating-select"]').textContent = t.rating;
  document.querySelector('label[for="language-select"]').textContent = t.language;
  document.querySelector('label[for="sort-select"]').textContent = t.sortBy;
  
  // Update dropdown default options
  document.querySelector('#genre-select option[value=""]').textContent = t.allGenres;
  document.querySelector('#year-select option[value=""]').textContent = t.allYears;
  document.querySelector('#rating-select option[value=""]').textContent = t.allRatings;
  document.querySelector('#language-select option[value=""]').textContent = t.allLanguages;
  
  // Update sort options
  const sortSelect = document.querySelector('#sort-select');
  sortSelect.querySelector('option[value="popularity.desc"]').textContent = t.popularity;
  sortSelect.querySelector('option[value="vote_average.desc"]').textContent = t.ratingHighLow;
  sortSelect.querySelector('option[value="vote_average.asc"]').textContent = t.ratingLowHigh;
  sortSelect.querySelector('option[value="release_date.desc"]').textContent = t.releaseDateNewest;
  sortSelect.querySelector('option[value="release_date.asc"]').textContent = t.releaseDateOldest;
  sortSelect.querySelector('option[value="title.asc"]').textContent = t.titleAZ;
  sortSelect.querySelector('option[value="title.desc"]').textContent = t.titleZA;
  
  // Update button titles
  document.querySelector('#favorites-toggle').title = t.showFavorites;
  document.querySelector('#theme-toggle').title = t.toggleTheme;
  document.querySelector('#filters-toggle').textContent = t.filters;
}

document.querySelector('#app').innerHTML = `
  <div>
    <div id="toggles-bar">
      <button id="favorites-toggle" class="toggle-button" title="Show favorites">♡</button>
      <button id="language-toggle" class="toggle-button" title="Language">EN</button>
      <button id="theme-toggle" class="toggle-button" title="Toggle theme">●</button>
    </div>
    <img id="logo_icon" src="./moofav_icon.png" alt="MooFav"/>
    <img id="logo_title" src="./moofav_title.png" alt="Movie Database"/>
    <div style="height: 1em;"></div>
    <button id="filters-toggle" class="toggle-button" type="button">Filters</button>
    <div id="nav-container">
      <div id="search-container" class="filter-item">
        <label for="search-input">Search: </label>
        <input type="text" id="search-input" placeholder="Search movies...">
      </div>
      <div id="filters-container">
        <div class="filter-item">
          <label for="genre-select">Genre: </label>
          <select id="genre-select">
            <option value="">All Genres</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="year-select">Year: </label>
          <select id="year-select">
            <option value="">All Years</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="rating-select">Rating: </label>
          <select id="rating-select">
            <option value="">All Ratings</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="language-select">Language: </label>
          <select id="language-select">
            <option value="">All Languages</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="sort-select">Sort by: </label>
          <select id="sort-select">
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating (High to Low)</option>
          <option value="vote_average.asc">Rating (Low to High)</option>
          <option value="release_date.desc">Release Date (Newest)</option>
          <option value="release_date.asc">Release Date (Oldest)</option>
          <option value="title.asc">Title (A-Z)</option>
          <option value="title.desc">Title (Z-A)</option>
        </select>
        </div>
      </div>
    </div>
    <div id="movie-container"></div>
    <div id="sentinel" style="height: 1px;"></div>
  </div>
`

// Language toggle functionality
const languageToggle = document.querySelector('#language-toggle');

// get user's saved language on load
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
  languageToggle.textContent = savedLanguage;
}

// set initial language based on saved preference or default to English
updateLanguage((savedLanguage || 'EN').toLowerCase());

languageToggle.addEventListener('click', () => {
  const currentLanguage = languageToggle.textContent;
  const newLanguage = currentLanguage === 'EN' ? 'NL' : 'EN'; // Toggle between English and Dutch
  languageToggle.textContent = newLanguage;
  localStorage.setItem('language', newLanguage);
  updateLanguage(newLanguage.toLowerCase());
});

// Theme toggle functionality
const themeToggle = document.querySelector('#theme-toggle');

// get user's saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  // add light theme class to body
  document.body.classList.add('light-theme');
  themeToggle.textContent = '○';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.textContent = isLight ? '○' : '●';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Populate genre dropdown
const genres = await getMovieGenres();
const genreSelect = document.querySelector('#genre-select');
genres.forEach(genre => {
  const option = document.createElement('option');
  option.value = genre.id;
  option.textContent = genre.name;
  genreSelect.appendChild(option);
});

// Populate year dropdown (current year down to 1900)
const yearSelect = document.querySelector('#year-select');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1900; year--) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Populate minimum rating dropdown (6 to 9)
const ratingSelect = document.querySelector('#rating-select');
for (let rating = 6; rating <= 9; rating++) {
  const option = document.createElement('option');
  option.value = rating;
  option.textContent = `${rating}+`;
  ratingSelect.appendChild(option);
}

// Populate language dropdown with hardcoded list
// fetching from https://api.themoviedb.org/3/configuration/languages turns up way too many hits!
const languageSelect = document.querySelector('#language-select');
const languages = [{"en":"English"},{"es":"Spanish"},{"fr":"French"},{"de":"German"},{"nl":"Dutch"},{"it":"Italian"},{"ja":"Japanese"},{"ko":"Korean"},{"zh":"Chinese"}];
languages.forEach(lang => {
  const option = document.createElement('option');
  option.value = Object.keys(lang)[0];
  option.textContent = Object.values(lang)[0];
  languageSelect.appendChild(option);
});

// Add event listeners for dropdowns
const movieContainer = document.querySelector('#movie-container');
const filtersToggle = document.querySelector('#filters-toggle');
const navContainer = document.querySelector('#nav-container');
// check to see if we're on mobile to decide whether to show filters or not
const onMobileScreenQuery = window.matchMedia('(max-width: 768px)');
let selectedGenre = null;
let selectedYear = null;
let selectedRating = null;
let selectedLanguage = null;
let selectedSort = 'popularity.desc';
let searchQuery = null;
let showFavoritesOnly = false;
let currentPage = 1;
let hasMorePagesToLoad = true;
let isLoading = false;
let mobileFiltersHidden;

function updateMobileFiltersVisibility() {
  // on mobile (mobileFiltersHidden=true), we want to hide the filters
  if (onMobileScreenQuery.matches) {
    // on mobile, toggle visibility based on state of the filters toggle
    navContainer.classList.toggle('mobile-collapsed', mobileFiltersHidden);
  } else {
    navContainer.classList.remove('mobile-collapsed');
  }
}

filtersToggle.addEventListener('click', () => {
  mobileFiltersHidden = !mobileFiltersHidden;
  updateMobileFiltersVisibility();
});

// add listener to handle screen size changes
onMobileScreenQuery.addEventListener('change', (onMobile) => {
  mobileFiltersHidden = onMobile.matches;
  updateMobileFiltersVisibility();
});

mobileFiltersHidden = onMobileScreenQuery.matches;
updateMobileFiltersVisibility();

// Favorites toggle functionality
const favoritesToggle = document.querySelector('#favorites-toggle');
favoritesToggle.addEventListener('click', () => {
  showFavoritesOnly = !showFavoritesOnly;
  favoritesToggle.textContent = showFavoritesOnly ? '♥' : '♡';
  favoritesToggle.classList.toggle('favorite', showFavoritesOnly);
  currentPage = 1;
  hasMorePagesToLoad = true;

  // Hide filters and search when showing favorites
  const filtersContainer = document.querySelector('#filters-container');
  const searchContainer = document.querySelector('#search-container');
  filtersContainer.style.display = showFavoritesOnly ? 'none' : '';
  searchContainer.style.display = showFavoritesOnly ? 'none' : '';

  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#search-input').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim() || null;
  currentPage = 1;
  hasMorePagesToLoad = true;

  // Hide filters when searching, show when cleared
  const filtersContainer = document.querySelector('#filters-container');
  filtersContainer.style.display = searchQuery ? 'none' : '';
  // const searchBox = document.querySelector('#search-input');
  // searchBox.style.width = searchQuery ? '50%' : 'auto';

  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#genre-select').addEventListener('change', (e) => {
  selectedGenre = e.target.value || null;
  // reset page to 1 on genre change
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#year-select').addEventListener('change', (e) => {
  selectedYear = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#rating-select').addEventListener('change', (e) => {
  selectedRating = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#sort-select').addEventListener('change', (e) => {
  selectedSort = e.target.value;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

document.querySelector('#language-select').addEventListener('change', (e) => {
  selectedLanguage = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly);
});

// Intersection Observer for infinite scroll
// source: https://preparefrontend.com/blog/blog/mastering-intersection-observer-in-javascript
function createInfiniteScroll(callback) {
  const sentinel = document.querySelector('#sentinel');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // don't load more if already loading or no more pages to load
      if (isLoading || !hasMorePagesToLoad) return;
      callback(entry);
    });
  }, {
    threshold: 0.1, // trigger when 10% of the sentinel is visible
    rootMargin: '500px' // trigger 500px before the sentinel enters viewport
  });

  observer.observe(sentinel);
  return observer;
}

const loadMoreContent = (entry) => {
  // when sentinel comes into view, load more movies
  if (entry.isIntersecting) {
    isLoading = true;
    currentPage++;
    fetchIMDBData(movieContainer, currentPage, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly)
      .then((morePagesToLoad) => {
        // loading is done, we can load some more on scroll
        isLoading = false;
        // update hasMorePagesToLoad based on API response
        hasMorePagesToLoad = morePagesToLoad;
      });
  }
};

createInfiniteScroll(loadMoreContent);

// Initial fetch
fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery, showFavoritesOnly).then((hasMore) => {
  isLoading = false;
  hasMorePagesToLoad = hasMore;
});