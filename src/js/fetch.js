
// Fetch from IMDB API
export const fetchIMDBData = (element) => {
  fetch('https://api.imdbapi.dev/titles')
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
        element.innerHTML = `
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
      } else {
        // for debugging purposes:
        element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    })
    .catch(error => {
      element.innerHTML = `<span style="color:red;">Error fetching IMDB data: ${error}</span>`;
    });
}