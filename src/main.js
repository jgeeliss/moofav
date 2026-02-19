import './css/style.css'
import { fetchIMDBData } from './js/fetch.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>MooFav, your favorite movies & TV shows</h1>
    <div id="imdb-response" style="margin-top:2em;"></div>
  </div>
`

// setupCounter(document.querySelector('#counter'))
fetchIMDBData(document.querySelector('#imdb-response'))