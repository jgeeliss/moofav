import './css/style.css'
import { fetchIMDBData, getMovieGenres } from './js/fetch.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>MooFav, your favorite movies & TV shows</h1>
    <div style="margin-top:1em;">
      <label for="genre-select">Genre: </label>
      <select id="genre-select">
        <option value="">All Genres</option>
      </select>
      <label for="year-select" style="margin-left:1em;">Year: </label>
      <select id="year-select">
        <option value="">All Years</option>
      </select>
    </div>
    <div id="movie-container" style="margin-top:2em;"></div>
  </div>
`

// Populate genre dropdown
getMovieGenres().then(genres => {
  const genreSelect = document.querySelector('#genre-select');
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
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

// Add event listeners for dropdowns
const movieContainer = document.querySelector('#movie-container');
let selectedGenre = null;
let selectedYear = null;

document.querySelector('#genre-select').addEventListener('change', (e) => {
  selectedGenre = e.target.value || null;
  fetchIMDBData(movieContainer, 1, selectedGenre, selectedYear);
});

document.querySelector('#year-select').addEventListener('change', (e) => {
  selectedYear = e.target.value || null;
  fetchIMDBData(movieContainer, 1, selectedGenre, selectedYear);
});

// Initial fetch
fetchIMDBData(movieContainer)