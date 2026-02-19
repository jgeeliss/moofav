
// Fetch from IMDB API

// Keep a stack of next-page tokens to support previous/next navigation
let imdbPageTokenStack = [];

export const fetchIMDBData = (element, nextPageToken = null) => {
  let url = 'https://api.imdbapi.dev/titles';

  if (nextPageToken) {
    url += `?pageToken=${nextPageToken}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.titles)) {
        // Build the table rows
        const allMovieRows = data.titles.map(title => `
          <tr>
            <td><img src="${title.primaryImage?.url || ''}" alt="${title.primaryTitle}" style="max-width:60px;max-height:80px;"></td>
            <td>${title.primaryTitle || ''}</td>
            <td>${title.startYear || ''}</td>
            <td>${title.genres ? title.genres.join(', ') : ''}</td>
            <td>${title.rating?.aggregateRating || ''}</td>
            <td>${title.plot ? title.plot.substring(0, 100) + (title.plot.length > 100 ? '...' : '') : ''}</td>
          </tr>
        `).join(''); // needed to join the array of movie rows into a single string

        // insert all movie rows into the table
        let html = `
          <table border="1" style="border-collapse:collapse;width:100%;font-size:0.95em;">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Year</th>
                <th>Genres</th>
                <th>Rating</th>
                <th>Plot</th>
              </tr>
            </thead>
            <tbody>
              ${allMovieRows}
            </tbody>
          </table>
        `;

        // Add previous button if there are tokens in the stack
        if (imdbPageTokenStack.length > 0) {
          html += `<button id="prev-button" style="margin:1em 0 1em 0.5em;">Previous</button>`;
        }
        // Add next button if nextPageToken exists
        if (data.nextPageToken) {
          html += `<button id="next-button" style="margin:1em 0 1em 0.5em;">Next</button>`;
        }
        element.innerHTML = html;

        // Add event listeners for navigation buttons
        if (data.nextPageToken) {
          const nextBtn = document.getElementById('next-button');
          if (nextBtn) {
            nextBtn.onclick = () => {
              // add next page to the stack and go to next page
              imdbPageTokenStack.push(data.nextPageToken);
              fetchIMDBData(element, data.nextPageToken);
            }
          }
        }
        if (imdbPageTokenStack.length > 0) {
          const prevBtn = document.getElementById('prev-button');
          if (prevBtn) {
            prevBtn.onclick = () => {
              // Pop the current token, then use the new top as previous
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
    })
    .catch(error => {
      element.innerHTML = `<span style="color:red;">Error fetching IMDB data: ${error}</span>`;
    });
}