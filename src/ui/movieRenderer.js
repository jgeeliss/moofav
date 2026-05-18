import { showMoviePopup } from './moviePopup.js';

/**
 * Renders API movie results into the grid and wires item click handlers.
 * @param {HTMLElement} element - Container where movies are rendered.
 * @param {{ results?: Array<any>, page?: number, total_pages?: number }} data - API payload.
 * @param {Array<{ id: number, name: string }>} genres - Full genre lookup list.
 * @returns {void}
 */
export function renderMovies(element, data, genres) {
  if (!data || !Array.isArray(data.results)) {
    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    return;
  }

  const movieItems = data.results
    .map((movie) => {
      if (!movie.poster_path) {
        return '';
      }

      const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      const year = movie.release_date ? movie.release_date.split('-')[0] : 'n/a';
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'n/a';

      // get genre names for each movie by matching its genre_ids to the full genre list
      let genreNames = '';
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        genreNames = movie.genre_ids
          .map((id) => {
            const genre = genres.find((g) => g.id === id);
            return genre ? genre.name : '';
          })
          .filter((name) => name)
          .join(', ');
      }

      if (!genreNames) {
        genreNames = 'n/a';
      }

      return `
        <div class="movie-item" data-id="${movie.id}">
          <img class="movie-img" src="${imgUrl}" alt="${movie.title}">
          <div class="movie-details">
            <h2 class="movie-title">${movie.title}</h2>
            <div class="movie-meta">
              <span><strong>Year:&nbsp;</strong> ${year}</span>
              <span><strong>Rating:&nbsp;</strong> ${rating}</span>
              <span><strong>Vote Count:&nbsp;</strong> ${movie.vote_count}</span>
              <span><strong>Language:&nbsp;</strong> ${movie.original_language}</span>
            </div>
            <span><strong>Genres:</strong> ${genreNames}</span>
          </div>
        </div>
      `;
    })
    .join('');

  let movieMatrix = element.querySelector('#movie-matrix');
  if (!movieMatrix) {
    element.innerHTML = `<div id="movie-matrix">${movieItems}</div>`;
    movieMatrix = element.querySelector('#movie-matrix');
  } else if (data.page === 1) {
    movieMatrix.innerHTML = movieItems;
  } else {
    movieMatrix.insertAdjacentHTML('beforeend', movieItems);
  }

  const movieItemElements = element.querySelectorAll('.movie-item');
  movieItemElements.forEach((item) => {
    if (!item.dataset.hasListener) {
      item.dataset.hasListener = 'true';
      item.addEventListener('click', function () {
        const movieId = this.getAttribute('data-id');
        const movie = data.results.find((m) => m.id === parseInt(movieId, 10));
        if (movie) {
          showMoviePopup(movie, genres);
        }
      });
    }
  });
}

/**
 * Renders the empty state for favorites-only mode.
 * @param {HTMLElement} element - Container where movies are rendered.
 * @returns {void}
 */
export function renderEmptyFavoritesMessage(element) {
  element.innerHTML = '<div id="movie-matrix"><p>No favorite movies yet. Click the heart on any movie to add it to your favorites!</p></div>';
}

/**
 * Renders a generic inline error message.
 * @param {HTMLElement} element - Container where movies are rendered.
 * @param {string} message - Message to display.
 * @returns {void}
 */
export function renderErrorMessage(element, message) {
  element.innerHTML = `<span class="error-msg">${message}</span>`;
}
