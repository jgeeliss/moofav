# Moofav - Movie Favorites Webapp README

## Projectbeschrijving en functionaliteiten

Een webapplicatie die gebruikers in staat stelt om nieuwe films te ontdekken en hun favoriete films bij te houden. De app maakt gebruik van een externe API om filmgegevens op te halen en biedt een intuïtieve interface voor gebruikers om hun filmcollectie te beheren.

## Gebruikte API's met links
- [The Movie Database (TMDb) API](https://developer.themoviedb.org/docs/getting-started)

## Technische vereisten

Jullie project moet **ALLE** onderstaande JavaScript-concepten demonstreren. Per onderdeel moeten jullie in de README documenteren waar en hoe je deze concepten hebt toegepast:

### DOM manipulatie
- Elementen selecteren
    - src/js/ui.js:75-92 (getAppElements: querySelector voor alle hoofd-UI elementen)
    - src/js/i18n.js:5-33 (updateLanguage: querySelector voor labels, placeholders en sort options)
    - src/js/fetch.js:47-50 (showMoviePopup: getElementById voor popup cleanup)
    - src/js/fetch.js:145-151 (renderIMDBData: querySelector voor movie matrix)
    - src/js/fetch.js:161-162 (renderIMDBData: querySelectorAll voor movie items)
- Elementen manipuleren
    - src/js/i18n.js:5-33 (updateLanguage: textContent manipulatie voor meertalige labels en opties)
    - src/js/filters.js:3-15 (setupThemeToggle: classList en textContent voor dynamic styling)
    - src/js/filters.js:43-61 (setupFavoritesToggle: style.display voor conditioneel tonen/verbergen)
    - src/js/fetch.js:47-79 (showMoviePopup: createElement, innerHTML en appendChild)
    - src/js/fetch.js:157 (renderIMDBData: insertAdjacentHTML voor infinite scroll)
- Events aan elementen koppelen
    - src/js/i18n.js:36-50 (setupLanguageToggle: addEventListener op language toggle)
    - src/js/filters.js:3-15 (setupThemeToggle: addEventListener op theme toggle)
    - src/js/filters.js:64-117 (setupSearchAndFilterListeners: addEventListener op search en filter dropdowns)
    - src/js/filters.js:43-61 (setupFavoritesToggle: addEventListener op favorites toggle)
    - src/js/fetch.js:83-94 (showMoviePopup: onclick handlers op popup buttons)
    - src/js/fetch.js:97-101 (showMoviePopup: addEventListener op popup backdrop)
    - src/js/fetch.js:165-171 (renderIMDBData: addEventListener op movie items)

### Modern JavaScript
- Gebruik van constanten
    - src/main.js:1-22 (module imports en constante module-wiring)
    - src/main.js:26-27 (const elements en const state)
    - src/js/state.js:2-14 (createInitialAppState: state object met vaste properties)
- Template literals
    - src/js/ui.js:13-73 (renderApp: grote HTML template)
    - src/js/fetch.js:67-79 (showMoviePopup: template literal in popup.innerHTML)
    - src/js/fetch.js:126-140 (renderIMDBData: template literal voor movie items)
    - src/js/fetch.js:214 (fetchIMDBData: template literal in URL construction)
- Iteratie over arrays
    - src/js/ui.js:95-102 (populateGenreOptions: forEach op genres)
    - src/js/ui.js:104-112 (populateYearOptions: for loop op jaren)
    - src/js/ui.js:114-121 (populateRatingOptions: for loop op ratings)
    - src/js/fetch.js:54-56 (showMoviePopup: forEach op genre_ids)
    - src/js/fetch.js:108-142 (renderIMDBData: map op results array)
    - src/js/fetch.js:117-120 (renderIMDBData: geneste map en filter op genre_ids)
- Array methodes
    - src/js/ui.js:95-102 (populateGenreOptions: .forEach() op genres array)
    - src/js/fetch.js:23 (removeFromFavorites: .filter() op favorites)
    - src/js/fetch.js:14 (addToFavorites/isFavorite: .includes() op array)
    - src/js/fetch.js:108-142 (renderIMDBData: .map() op results)
    - src/js/fetch.js:117-120 (renderIMDBData: .map().filter().join())
    - src/js/fetch.js:167 (renderIMDBData: .find() op data.results)
- Arrow functions
    - src/main.js:42-55 (refreshMovies: arrow function als helper)
    - src/js/filters.js:10-15 (setupThemeToggle: arrow function in addEventListener)
    - src/js/ui.js:96 (populateGenreOptions: (genre) => {} in forEach)
    - src/js/fetch.js:108 (renderIMDBData: (movie) => {} in map)
    - src/js/fetch.js:117 (renderIMDBData: (id) => {} in map)
    - src/js/fetch.js:191 (fetchIMDBData: (id) => {} in map voor favorites)
    - src/js/scrolling.js:12 (setupInfiniteScroll: (morePagesToLoad) => {} in .then())
- Conditional (ternary) operator (moderne if..else)
    - src/js/i18n.js:46 (setupLanguageToggle: ternary in language toggle)
    - src/js/filters.js:13-14 (setupThemeToggle: ternary voor isLight check en localStorage)
    - src/js/filters.js:52 (setupFavoritesToggle: ternary voor favorites icon)
    - src/js/fetch.js:4 (getFavorites: ternary met fallback)
    - src/js/fetch.js:69-75 (showMoviePopup: ternary operators in template literal)
    - src/js/fetch.js:111-112 (renderIMDBData: ternary in movie details)
- Callback functions
    - src/js/i18n.js:44-50 (setupLanguageToggle: callback in addEventListener)
    - src/js/filters.js:10-15 (setupThemeToggle: callback in addEventListener)
    - src/js/filters.js:81-115 (setupSearchAndFilterListeners: callbacks op input/select listeners)
    - src/js/fetch.js:83-90 (showMoviePopup: onclick callbacks op buttons)
    - src/js/fetch.js:193 (fetchIMDBData: .then(response => response.json()))
    - src/js/fetch.js:227-235 (fetchIMDBData: .then() callback chain)
- Promises
    - src/js/fetch.js:196-209 (fetchIMDBData: Promise.all() voor favorites)
    - src/js/fetch.js:226-237 (fetchIMDBData: fetch().then().then().catch() chain)
    - src/js/fetch.js:187 (fetchIMDBData: Promise.resolve(false))
    - src/js/scrolling.js:11-17 (setupInfiniteScroll: Promise.resolve en .then/.finally rond infinite scroll)
- Async & Await
    - src/main.js:36 (bootstrap in main: const genres = await getMovieGenres())
    - src/js/fetch.js:33-44 (getMovieGenres: async functie)
    - src/js/fetch.js:36-37 (getMovieGenres: await fetch en await response.json())
- Observer API (1 is voldoende)
    - src/js/scrolling.js:1-29 (setupInfiniteScroll: new IntersectionObserver() voor infinite scroll)

### Data & API
- Fetch om data op te halen
    - src/js/fetch.js:33-44 (getMovieGenres: fetch() met async/await)
    - src/js/fetch.js:191-193 (fetchIMDBData: fetch in map callback voor favorites)
    - src/js/fetch.js:226-237 (fetchIMDBData: fetch().then() chain)
- JSON manipuleren en weergeven
    - src/js/i18n.js:1 (translationsData import uit dictionary.json)
    - src/js/fetch.js:3-4 (getFavorites: JSON.parse() van localStorage)
    - src/js/fetch.js:7-8 (saveFavorites: JSON.stringify() naar localStorage)
    - src/js/fetch.js:37 (getMovieGenres: await response.json())
    - src/js/fetch.js:105-142 (renderIMDBData: JSON data transformeren naar UI)

### Opslag & validatie
- Formulier validatie
    - src/js/filters.js:83 (setupSearchAndFilterListeners: search input validatie met .trim())
    - src/js/fetch.js:14-18 (addToFavorites: .includes() validatie of favoriet bestaat)
    - src/js/fetch.js:23-24 (removeFromFavorites: .filter() validatie op favorites)
- Gebruik van LocalStorage
    - src/js/i18n.js:37 (setupLanguageToggle: localStorage.getItem('language'))
    - src/js/i18n.js:48 (setupLanguageToggle: localStorage.setItem('language', newLanguage))
    - src/js/filters.js:4 (setupThemeToggle: localStorage.getItem('theme'))
    - src/js/filters.js:14 (setupThemeToggle: localStorage.setItem('theme', isLight ? 'light' : 'dark'))
    - src/js/fetch.js:3 (getFavorites: localStorage.getItem('moofav-favorites'))
    - src/js/fetch.js:8 (saveFavorites: localStorage.setItem('moofav-favorites'))

### Styling & layout
- Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt)
    - index.html (basis HTML structuur van de pagina)
- Basis CSS
    - src/css/style.css (algemene styling van de app)
- Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes, ...)
    - src/css/style.css (styling van de movie popup met knoppen en icoontjes)
    - src/js/ui.js:13-20 (renderApp: ♡ en ●/○ icoontjes voor UI toggles)
    - src/js/filters.js:50-53 (setupFavoritesToggle: ♥/♡ icoon bij favorieten)

### Tooling & structuur
- Project is opgezet met Vite
    - package.json (Vite dependencies)
    - src/main.js:1-22 (Vite entrypoint met ES module imports)
- Een correcte folderstructuur wordt aangehouden (gescheiden html, css en js files, src folder, dist folder, ...)
    - index.html (HTML bestand)
    - src/css/ (CSS bestanden)
    - src/main.js:24-89 (orchestrator / bootstrap)
    - src/js/ui.js:13-130 (UI rendering + element access)
    - src/js/state.js:1-19 (centrale state)
    - src/js/i18n.js:1-55 (taalbeheer)
    - src/js/filters.js:1-117 (filters + toggles)
    - src/js/scrolling.js:1-29 (infinite scroll)
    - src/js/fetch.js:2-239 (API calls + data rendering)


## Installatiehandleiding

1. Clone de repository: `git clone <repository-url>`
2. Navigeer naar de projectmap: `cd moofav`
3. Installeer de dependencies: `npm install`
4. Start de ontwikkelserver: `npm run dev`
5. Open de applicatie in je browser via de gegeven localhost URL (meestal http://localhost:5173)

voor een productie build:
1. Bouw de applicatie: `npm run build`
2. Preview de productie build: `npm run preview`

## Screenshots van de applicatie


## Gebruikte bronnen
- [chatlog met AI](./chatbot-conversation.md)
- [Detect browser viewport size change using JavaScript's matchMedia method](https://stackoverflow.com/questions/76639699/how-to-detect-browser-viewport-size-change-using-javascripts-matchmedia-method)