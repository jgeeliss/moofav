import './css/style.css'
import './css/dark-theme.css'
import './css/light-theme.css'
import { fetchIMDBData, getMovieGenres } from './js/fetch.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div style="text-align: right; margin-bottom: 1em;">
      <p style="display: inline; margin-right: 0.5em;">Theme:</p>
      <button id="theme-toggle" class="theme-toggle">Dark</button>
    </div>
    <h1>MooFav</h1>
    <h2>Your favorite movies & TV shows</h2>
    <div id="nav-container">
      <div class="filter-item">
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

// Theme toggle functionality
const themeToggle = document.querySelector('#theme-toggle');

// get user's saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  // add light theme class to body
  document.body.classList.add('light-theme');
  themeToggle.textContent = 'Light';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.textContent = isLight ? 'Light' : 'Dark';
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
let selectedGenre = null;
let selectedYear = null;
let selectedRating = null;
let selectedLanguage = null;
let selectedSort = 'popularity.desc';
let searchQuery = null;
let currentPage = 1;
let hasMorePagesToLoad = true;
let isLoading = false;

document.querySelector('#search-input').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim() || null;
  currentPage = 1;
  hasMorePagesToLoad = true;

  // Hide filters when searching, show when cleared
  const filtersContainer = document.querySelector('#filters-container');
  filtersContainer.style.visibility = searchQuery ? 'hidden' : 'visible';
  // const searchBox = document.querySelector('#search-input');
  // searchBox.style.width = searchQuery ? '50%' : 'auto';

  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
});

document.querySelector('#genre-select').addEventListener('change', (e) => {
  selectedGenre = e.target.value || null;
  // reset page to 1 on genre change
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
});

document.querySelector('#year-select').addEventListener('change', (e) => {
  selectedYear = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
});

document.querySelector('#rating-select').addEventListener('change', (e) => {
  selectedRating = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
});

document.querySelector('#sort-select').addEventListener('change', (e) => {
  selectedSort = e.target.value;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
});

document.querySelector('#language-select').addEventListener('change', (e) => {
  selectedLanguage = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery);
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
    fetchIMDBData(movieContainer, currentPage, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery)
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
fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating, selectedLanguage, selectedSort, searchQuery).then((hasMore) => {
  isLoading = false;
  hasMorePagesToLoad = hasMore;
});