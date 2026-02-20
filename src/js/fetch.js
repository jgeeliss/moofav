
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
    <div style="text-align:center">
      <img src="${movie.primaryImage?.url || ''}" alt="${movie.primaryTitle}" style="max-width:120px;max-height:160px;">
      <h2>${movie.primaryTitle || ''}</h2>
      <p><strong>Year:</strong> ${movie.startYear || ''}</p>
      <p><strong>Genres:</strong> ${movie.genres ? movie.genres.join(', ') : ''}</p>
      <p><strong>Rating:</strong> ${movie.rating?.aggregateRating || ''}</p>
      <p><strong>Plot:</strong> ${movie.plot || ''}</p>
      <button id="close-popup-button" style="margin-top:1em;padding:0.5em 2em;">Close</button>
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
      return imgUrl ? `<div class="movie-img" id=${title.id}><img src="${imgUrl}" style="width:120px;height:180px;"></div>` : '';
    }).join('');

    let html = `
      <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-start;">
        ${images}
      </div>
    `;

    if (imdbPageTokenStack.length > 0) {
      html += `<button id="prev-button" style="margin:1em 0 1em 0.5em;">Previous</button>`;
    }
    if (data.nextPageToken) {
      html += `<button id="next-button" style="margin:1em 0 1em 0.5em;">Next</button>`;
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
      element.innerHTML = `<span style="color:red;">Error fetching IMDB data: ${error}</span>`;
    });
}
