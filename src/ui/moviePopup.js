import { addToFavorites, isFavorite, removeFromFavorites } from '../data/favorites.js';

/**
 * Renders and opens a popup with detailed movie information.
 * @param {{
 *   id: number,
 *   title?: string,
 *   poster_path?: string,
 *   release_date?: string,
 *   vote_average?: number,
 *   overview?: string,
 *   genre_ids?: number[]
 * }} movie - Movie to display.
 * @param {Array<{ id: number, name: string }>} genres - Full genre lookup list.
 * @returns {void}
 */
export function showMoviePopup(movie, genres) {
  const existingPopup = document.getElementById('movie-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  let genreNames = '';
  const movieGenreIds = movie.genre_ids || [];
  movieGenreIds.forEach((id) => {
    const genre = genres.find((g) => g.id === id);
    if (genre) {
      genreNames += `${genre.name}, `;
    }
  });

  genreNames = genreNames.slice(0, -2);

  const popup = document.createElement('div');
  popup.id = 'movie-popup';

  const isFav = isFavorite(movie.id);
  popup.innerHTML = `
    <div id="movie-popup-container">
      <button id="favorite-button" class="heart-button ${isFav ? 'favorite' : ''}">♥</button>
      <img id="movie-popup-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h2>${movie.title || ''}</h2>
      <p><strong>Year:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'n/a'}</p>
      <p><strong>Genres:</strong> ${genreNames || 'n/a'}</p>
      <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'n/a'}</p>
      <p><strong>Plot:</strong> ${movie.overview || 'n/a'}</p>
      <button id="close-popup-button" class="nav-button">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  const favoriteButton = document.getElementById('favorite-button');
  favoriteButton.onclick = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
      favoriteButton.classList.remove('favorite');
    } else {
      addToFavorites(movie);
      favoriteButton.classList.add('favorite');
    }
  };

  document.getElementById('close-popup-button').onclick = () => popup.remove();

  popup.addEventListener('click', (e) => {
    if (e.target.id === 'movie-popup') {
      popup.remove();
    }
  });
}
