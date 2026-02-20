
// Fetch from IMDB API

// Keep a stack of next-page tokens to support previous/next navigation
let imdbPageTokenStack = [];

// Render function for api data
function renderIMDBData(element, data) {
  if (data && Array.isArray(data.titles)) {
    // Show only movie images in a flex container
    const images = data.titles.map(title => {
      const imgUrl = title.primaryImage?.url;
      return imgUrl ? `<div class="movie-img"><img src="${imgUrl}" style="width:120px;height:180px;"></div>` : '';
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
