import translationsData from '../dictionary.json';

let currentLanguage = 'en';

export function updateLanguage(lang) {
  currentLanguage = lang;
  const t = translationsData[lang];

  document.querySelector('label[for="search-input"]').textContent = t.search;
  document.querySelector('#search-input').placeholder = t.searchPlaceholder;
  document.querySelector('label[for="genre-select"]').textContent = t.genre;
  document.querySelector('label[for="year-select"]').textContent = t.year;
  document.querySelector('label[for="rating-select"]').textContent = t.rating;
  document.querySelector('label[for="language-select"]').textContent = t.language;
  document.querySelector('label[for="sort-select"]').textContent = t.sortBy;

  document.querySelector('#genre-select option[value=""]').textContent = t.allGenres;
  document.querySelector('#year-select option[value=""]').textContent = t.allYears;
  document.querySelector('#rating-select option[value=""]').textContent = t.allRatings;
  document.querySelector('#language-select option[value=""]').textContent = t.allLanguages;

  const sortSelect = document.querySelector('#sort-select');
  sortSelect.querySelector('option[value="popularity.desc"]').textContent = t.popularity;
  sortSelect.querySelector('option[value="vote_average.desc"]').textContent = t.ratingHighLow;
  sortSelect.querySelector('option[value="vote_average.asc"]').textContent = t.ratingLowHigh;
  sortSelect.querySelector('option[value="release_date.desc"]').textContent = t.releaseDateNewest;
  sortSelect.querySelector('option[value="release_date.asc"]').textContent = t.releaseDateOldest;
  sortSelect.querySelector('option[value="title.asc"]').textContent = t.titleAZ;
  sortSelect.querySelector('option[value="title.desc"]').textContent = t.titleZA;

  document.querySelector('#favorites-toggle').title = t.showFavorites;
  document.querySelector('#theme-toggle').title = t.toggleTheme;
  document.querySelector('#filters-toggle').textContent = t.filters;
}

export function setupLanguageToggle(languageToggle) {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    languageToggle.textContent = savedLanguage;
  }

  updateLanguage((savedLanguage || 'EN').toLowerCase());

  languageToggle.addEventListener('click', () => {
    const activeLanguage = languageToggle.textContent;
    const newLanguage = activeLanguage === 'EN' ? 'NL' : 'EN';
    languageToggle.textContent = newLanguage;
    localStorage.setItem('language', newLanguage);
    updateLanguage(newLanguage.toLowerCase());
  });
}

export function getCurrentLanguage() {
  return currentLanguage;
}
