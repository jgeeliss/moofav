
// Fetch from IMDB API

// Keep a stack of next-page tokens to support previous/next navigation
let imdbPageTokenStack = [];

// Helper to show popup
function showMoviePopup(movie) {
  // first remove existing popup!
  const existingPopup = document.getElementById('movie-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  const popup = document.createElement('div');
  popup.id = 'movie-popup';
  popup.innerHTML = `
    <div id="movie-popup-container">
      <img id="movie-popup-image" src="${movie.primaryImage?.url || ''}" alt="${movie.primaryTitle}">
      <h2>${movie.primaryTitle || ''}</h2>
      <p><strong>Year:</strong> ${movie.startYear || ''}</p>
      <p><strong>Genres:</strong> ${movie.genres ? movie.genres.join(', ') : ''}</p>
      <p><strong>Rating:</strong> ${movie.rating?.aggregateRating || ''}</p>
      <p><strong>Plot:</strong> ${movie.plot || ''}</p>
      <button id="close-popup-button" class="nav-button">Close</button>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('close-popup-button').onclick = () => popup.remove();
}

// Render function for api data
function renderIMDBData(element, data) {
  if (data && Array.isArray(data.titles)) {
    // Show only movie images in a flex container
    const images = data.titles.map(title => {
      const imgUrl = title.primaryImage?.url;
      return imgUrl ? `<div><img id="${title.id}" class="movie-img" src="${imgUrl}" alt="${title.primaryTitle}"></div>` : '';
    }).join('');

    let html = `
      <div id="movie-matrix">
        ${images}
      </div>
    `;

    if (imdbPageTokenStack.length > 0) {
      html += `<button class="nav-button" id="prev-button">Previous</button>`;
    }
    if (data.nextPageToken) {
      html += `<button class="nav-button" id="next-button">Next</button>`;
    }
    element.innerHTML = html;

    // Add click event to all of the movie images
    document.querySelectorAll('.movie-img').forEach(img => {
      img.addEventListener('click', function () {
        // get id from element
        const movieId = this.getAttribute('id');
        const movie = data.titles.find(title => title.id === movieId);
        showMoviePopup(movie);
      });
    });

    // Add event listeners for navigation buttons
    if (data.nextPageToken) {
      const nextBtn = document.getElementById('next-button');
      if (nextBtn) {
        nextBtn.onclick = () => {
          imdbPageTokenStack.push(data.nextPageToken);
          fetchIMDBData(element, data.nextPageToken);
        }
      }
    }
    if (imdbPageTokenStack.length > 0) {
      const prevBtn = document.getElementById('prev-button');
      if (prevBtn) {
        prevBtn.onclick = () => {
          imdbPageTokenStack.pop();
          const previousPageToken = imdbPageTokenStack[imdbPageTokenStack.length - 1] || null;
          fetchIMDBData(element, previousPageToken);
        }
      }
    }
  } else {
    // for debugging purposes:
    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

export const fetchIMDBData = (element, nextPageToken = null) => {
  let url = 'https://api.imdbapi.dev/titles';

  nextPageToken && (url += `?pageToken=${nextPageToken}`);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      renderIMDBData(element, data);
    })
    .catch(error => {
      element.innerHTML = `<span class="error-msg">Error fetching IMDB data: ${error}</span>`;
    });
}
