
// Fetch genres from IMDB API
export async function getMovieGenres() {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=0f0bf386975247347f8ced16ab3804e7';
  try {
    const response = await fetch(url);
    const data = await response.json();
    const genres = data.genres;
    return genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

// Helper to show popup
function showMoviePopup(movie, genres) {
  // first remove existing popup!
  const existingPopup = document.getElementById('movie-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  let genreNames = '';
  movie.genre_ids.forEach(id => {
    const genre = genres.find(g => g.id === id);
    if (genre) {
      genreNames += genre.name + ', ';
    }
  });
  genreNames = genreNames.slice(0, -2); // Remove trailing comma and space
  const popup = document.createElement('div');
  popup.id = 'movie-popup';
  popup.innerHTML = `
    <div id="movie-popup-container">
      <button id="favorite-button" class="heart-button">♥</button>
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

  // Close button handler
  document.getElementById('close-popup-button').onclick = () => popup.remove();

  // Close popup when clicking outside the container
  popup.addEventListener('click', (e) => {
    if (e.target.id === 'movie-popup') {
      popup.remove();
    }
  });
}

// Render function for api data
function renderIMDBData(element, data, genres) {
  if (data && Array.isArray(data.results)) {
    // Show movies in a list with details
    const movieItems = data.results.map(movie => {
      if (movie.poster_path) {
        const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'n/a';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'n/a';

        // Get genre names
        let genreNames = '';
        if (movie.genre_ids && movie.genre_ids.length > 0) {
          genreNames = movie.genre_ids.map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.name : '';
          }).filter(name => name).join(', ');
        }
        if (!genreNames) genreNames = 'n/a';

        const plot = movie.overview || 'n/a`';

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
      }
    }).join('');

    // Get or create movie matrix
    let movieMatrix = element.querySelector('#movie-matrix');

    // start from scratch if no movie matrix
    if (!movieMatrix) {
      const html = `<div id="movie-matrix">${movieItems}</div>`;
      element.innerHTML = html;
      movieMatrix = element.querySelector('#movie-matrix');
      // on first page (=filter change) only replace the old items with the new ones
    } else if (data.page === 1) {
      movieMatrix.innerHTML = movieItems;
    } else {
      // insertAdjacentHTML adds the new HTML without removing existing content
      movieMatrix.insertAdjacentHTML('beforeend', movieItems);
    }

    // Add click event to all movie items
    const movieItemElements = element.querySelectorAll('.movie-item');
    movieItemElements.forEach(item => {
      if (!item.dataset.hasListener) {
        item.dataset.hasListener = 'true';
        item.addEventListener('click', function () {
          const movieId = this.getAttribute('data-id');
          const movie = data.results.find(m => m.id === parseInt(movieId));
          if (movie) {
            showMoviePopup(movie, genres);
          }
        });
      }
    });
  } else {
    // for debugging purposes:
    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

export const fetchIMDBData = (element, page, genres, genre = null, year = null, rating = null, language = null, sort = 'popularity.desc', searchQuery = null) => {

  let url;
  if (searchQuery) {
    url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=0f0bf386975247347f8ced16ab3804e7`;
  } else {
    // set vote_count to min 1.000 and in English to filter out obscure movies with wrong data
    url = 'https://api.themoviedb.org/3/discover/movie?vote_count.gte=1000&with_original_language=en&api_key=0f0bf386975247347f8ced16ab3804e7';
    genre && (url += `&with_genres=${genre}`);
    year && (url += `&primary_release_year=${year}`);
    rating && (url += `&vote_average.gte=${rating}`);
    language && (url += `&with_original_language=${language}`);
    sort && (url += `&sort_by=${sort}`);
  }
  page && (url += `&page=${page}`);

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // append movies to current list unless we're on the first page
      renderIMDBData(element, data, genres);
      const morePagesToLoad = data.page < data.total_pages;
      return morePagesToLoad;
    })
    .catch(error => {
      element.innerHTML = `<span class="error-msg">Error fetching IMDB data: ${error}</span>`;
      return false;
    });
}
