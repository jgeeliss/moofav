
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
      <img id="movie-popup-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h2>${movie.title || ''}</h2>
      <p><strong>Year:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'n/a'}</p>
      <p><strong>Genres:</strong> ${genreNames || 'n/a'}</p>
      <p><strong>Rating:</strong> ${movie.vote_average || 'n/a'}</p>
      <p><strong>Plot:</strong> ${movie.overview || 'n/a'}</p>
      <button id="close-popup-button" class="nav-button">Close</button>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('close-popup-button').onclick = () => popup.remove();
}

// Render function for api data
function renderIMDBData(element, data, genres) {
  if (data && Array.isArray(data.results)) {
    // Show only movie images in a flex container
    const images = data.results.map(title => {
      if (title.poster_path) {
        const imgUrl = `https://image.tmdb.org/t/p/w500${title.poster_path}`;
        return `<div><img id="${title.id}" class="movie-img" src="${imgUrl}" alt="${title.title}"></div>`;
      }
    }).join('');

    // Get or create movie matrix
    let movieMatrix = element.querySelector('#movie-matrix');

    // start from scratch if no movie matrix
    if (!movieMatrix) {
      const html = `<div id="movie-matrix">${images}</div>`;
      element.innerHTML = html;
      movieMatrix = element.querySelector('#movie-matrix');
    // on first page (=filter change) only replace the old images with the new ones 
    } else if (data.page === 1) {
      movieMatrix.innerHTML = images;
    } else {
      // insertAdjacentHTML adds the new HTML without removing existing content
      movieMatrix.insertAdjacentHTML('beforeend', images);
    }

    // Add click event to newly added movie images
    const newImages = element.querySelectorAll('.movie-img');
    newImages.forEach(img => {
      if (!img.dataset.hasListener) {
        img.dataset.hasListener = 'true';
        img.addEventListener('click', function () {
          // get id from element
          const movieId = this.getAttribute('id');
          const movie = data.results.find(title => title.id === parseInt(movieId));
          showMoviePopup(movie, genres);
        });
      }
    });
  } else {
    // for debugging purposes:
    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

export const fetchIMDBData = (element, page = 1, genres, genre = null, year = null, rating = null) => {
  let url = 'https://api.themoviedb.org/3/discover/movie?api_key=0f0bf386975247347f8ced16ab3804e7';

  page && (url += `&page=${page}`);
  genre && (url += `&with_genres=${genre}`);
  year && (url += `&primary_release_year=${year}`);
  rating && (url += `&vote_average.gte=${rating}`);

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
