const languageOptions = [
  { en: 'English' },
  { es: 'Spanish' },
  { fr: 'French' },
  { de: 'German' },
  { nl: 'Dutch' },
  { it: 'Italian' },
  { ja: 'Japanese' },
  { ko: 'Korean' },
  { zh: 'Chinese' },
];

export function renderApp() {
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
  `;
}

export function getAppElements() {
  return {
    movieContainer: document.querySelector('#movie-container'),
    languageToggle: document.querySelector('#language-toggle'),
    themeToggle: document.querySelector('#theme-toggle'),
    favoritesToggle: document.querySelector('#favorites-toggle'),
    filtersToggle: document.querySelector('#filters-toggle'),
    navContainer: document.querySelector('#nav-container'),
    filtersContainer: document.querySelector('#filters-container'),
    searchContainer: document.querySelector('#search-container'),
    searchInput: document.querySelector('#search-input'),
    genreSelect: document.querySelector('#genre-select'),
    yearSelect: document.querySelector('#year-select'),
    ratingSelect: document.querySelector('#rating-select'),
    sortSelect: document.querySelector('#sort-select'),
    languageSelect: document.querySelector('#language-select'),
    sentinel: document.querySelector('#sentinel'),
  };
}

export function populateGenreOptions(genreSelect, genres) {
  genres.forEach((genre) => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

export function populateYearOptions(yearSelect, startYear = 1900) {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

export function populateRatingOptions(ratingSelect, min = 6, max = 9) {
  for (let rating = min; rating <= max; rating++) {
    const option = document.createElement('option');
    option.value = rating;
    option.textContent = `${rating}+`;
    ratingSelect.appendChild(option);
  }
}

export function populateLanguageOptions(languageSelect) {
  languageOptions.forEach((lang) => {
    const option = document.createElement('option');
    option.value = Object.keys(lang)[0];
    option.textContent = Object.values(lang)[0];
    languageSelect.appendChild(option);
  });
}
