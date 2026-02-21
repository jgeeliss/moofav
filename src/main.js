import './css/style.css'
import { fetchIMDBData, getMovieGenres } from './js/fetch.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>MooFav, your favorite movies & TV shows</h1>
    <div>
      <label for="genre-select">Genre: </label>
      <select id="genre-select">
        <option value="">All Genres</option>
      </select>
      <label for="year-select">Year: </label>
      <select id="year-select">
        <option value="">All Years</option>
      </select>
      <label for="rating-select">Rating: </label>
      <select id="rating-select">
        <option value="">All Ratings</option>
      </select>
    </div>
    <div id="movie-container"></div>
  </div>
`

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

// Add event listeners for dropdowns
const movieContainer = document.querySelector('#movie-container');
let selectedGenre = null;
let selectedYear = null;
let selectedRating = null;
let currentPage = 1;
let hasMorePagesToLoad = true;
let isLoading = false;

document.querySelector('#genre-select').addEventListener('change', (e) => {
  selectedGenre = e.target.value || null;
  // reset page to 1 on genre change
  currentPage = 1;
  hasMorePagesToLoad = true;
  movieContainer.innerHTML = '';
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating);
});

document.querySelector('#year-select').addEventListener('change', (e) => {
  selectedYear = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  movieContainer.innerHTML = '';
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating);
});

document.querySelector('#rating-select').addEventListener('change', (e) => {
  selectedRating = e.target.value || null;
  currentPage = 1;
  hasMorePagesToLoad = true;
  movieContainer.innerHTML = '';
  fetchIMDBData(movieContainer, 1, genres, selectedGenre, selectedYear, selectedRating);
});

// Infinite scroll listener
window.addEventListener('scroll', () => {
  // don't load more if already loading or no more pages to load
  if (isLoading || !hasMorePagesToLoad) return;
  
  // scroll event listener detects when user is near bottom (500px threshold)
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 500;
  
  if (scrollPosition >= threshold) {
    isLoading = true;
    currentPage++;
    fetchIMDBData(movieContainer, currentPage, genres, selectedGenre, selectedYear, selectedRating)
      .then((morePagesToLoad) => {
        // loading is done, we can load some more on scroll
        isLoading = false;
        // update hasMorePagesToLoad based on API response
        hasMorePagesToLoad = morePagesToLoad;
      });
  }
});

// Initial fetch
fetchIMDBData(movieContainer, 1).then((hasMore) => {
  isLoading = false;
  hasMorePagesToLoad = hasMore;
});