# Moofav - Movie Favorites Webapp README

## Projectbeschrijving en functionaliteiten

Een webapplicatie die gebruikers in staat stelt om nieuwe films te ontdekken en hun favoriete films bij te houden. De app maakt gebruik van een externe API om filmgegevens op te halen en biedt een intuïtieve interface voor gebruikers om hun filmcollectie te beheren.

## Gebruikte API's met links
- [The Movie Database (TMDb) API](https://developer.themoviedb.org/docs/getting-started)

## Technische vereisten

Jullie project moet **ALLE** onderstaande JavaScript-concepten demonstreren. Per onderdeel moeten jullie in de README documenteren waar en hoe je deze concepten hebt toegepast:

### DOM manipulatie
- Elementen selecteren
    - main.js:15-37 (querySelector met complexe selectors voor labels en options)
    - main.js:104-122 (language toggle querySelector)
    - main.js:145-161 (querySelectorAll voor dropdown populatie)
    - src/js/fetch.js:45-101 (showMoviePopup)
    - src/js/fetch.js:145-151 (querySelector voor movie matrix)
    - src/js/fetch.js:161-180 (querySelectorAll voor movie items)
- Elementen manipuleren
    - main.js:15-37 (textContent manipulatie met labels)
    - main.js:120-131 (.classList.toggle en .classList.add voor dynamic styling)
    - main.js:203-204 (.style.visibility voor conditional display)
    - src/js/fetch.js:45-101 (createElement en appendChild voor popup)
    - src/js/fetch.js:80 (innerHTML voor popup content)
    - src/js/fetch.js:155 (insertAdjacentHTML voor infinite scroll)
- Events aan elementen koppelen
    - main.js:104 (addEventListener op language toggle)
    - main.js:120 (addEventListener op theme toggle)
    - main.js:196 (addEventListener op search input)
    - main.js:208-224 (addEventListener op alle filter dropdowns)
    - main.js:229 (addEventListener op favorites toggle)
    - src/js/fetch.js:75-90 (onclick handlers op popup buttons)
    - src/js/fetch.js:97 (addEventListener op popup)
    - src/js/fetch.js:165-180 (addEventListener op movie items)

### Modern JavaScript
- Gebruik van constanten
    - main.js:1-6 (const import statements)
    - main.js:8 (let currentLanguage)
    - main.js:105-143 (const querySelector selectors)
    - main.js:185-192 (const state variables voor filters)
- Template literals
    - main.js:43-80 (grote HTML template met backticks)
    - src/js/fetch.js:67-79 (template literal in popup.innerHTML)
    - src/js/fetch.js:107-127 (template literal voor movie items)
    - src/js/fetch.js:265 (template literal in URL construction)
- Iteratie over arrays
    - main.js:138-143 (forEach op genres)
    - main.js:163-170 (for loop op jaren)
    - main.js:174-180 (for loop op ratings)
    - src/js/fetch.js:52-56 (forEach op genre_ids)
    - src/js/fetch.js:108-128 (map op results array)
    - src/js/fetch.js:117-120 (geneste map en filter op genre_ids)
- Array methodes
    - main.js:138-143 (.forEach() op genres array)
    - src/js/fetch.js:23 (.filter() op favorites)
    - src/js/fetch.js:12 (.includes() op array)
    - src/js/fetch.js:108-128 (.map() op results)
    - src/js/fetch.js:117-120 (.map().filter().join())
    - src/js/fetch.js:177 (.find() op data.results)
- Arrow functions
    - main.js:104 (()=>{} in addEventListener)
    - main.js:118-124 (arrow function in addEventListener)
    - main.js:138-143 ((genre)=>{} in forEach)
    - src/js/fetch.js:108 ((movie)=>{} in map)
    - src/js/fetch.js:117 ((id)=>{} in map)
    - src/js/fetch.js:238 ((id)=>{} in map voor favorites)
    - src/js/fetch.js:278 ((morePagesToLoad)=>{} in .then())
- Conditional (ternary) operator (moderne if..else)
    - main.js:110 (ternary in updateLanguage uitvoering)
    - main.js:116 (ternary in language toggle)
    - main.js:120 (ternary in classList.toggle)
    - main.js:131 (ternary voor isLight check)
    - src/js/fetch.js:3 (ternary in getFavorites)
    - src/js/fetch.js:70 (ternary operators in template literal)
    - src/js/fetch.js:115 (ternary in movie details)
- Callback functions
    - main.js:104 (callback in addEventListener voor language toggle)
    - main.js:118 (callback in addEventListener voor theme toggle)
    - main.js:196 (callback in addEventListener voor search input)
    - main.js:208+ (callbacks op alle filter addEventListener calls)
    - src/js/fetch.js:75-90 (onclick callbacks op buttons)
    - src/js/fetch.js:239-240 (.then(response => response.json()))
    - src/js/fetch.js:278-283 (.then() callback chain)
- Promises
    - src/js/fetch.js:245-253 (Promise.all() voor favorites)
    - src/js/fetch.js:270-285 (fetch().then().then().catch() chain)
    - src/js/fetch.js:233 (Promise.resolve(false))
- Async & Await
    - main.js:137 (const genres = await getMovieGenres())
    - src/js/fetch.js:33 (export async function getMovieGenres())
    - src/js/fetch.js:36-37 (await fetch en await response.json())
- Observer API (1 is voldoende)
    - main.js:261-283 (new IntersectionObserver() voor infinite scroll)

### Data & API
- Fetch om data op te halen
    - src/js/fetch.js:36 (fetch() met async/await in getMovieGenres)
    - src/js/fetch.js:238-240 (fetch in map callback voor favorites)
    - src/js/fetch.js:270-285 (fetch().then() chain in fetchIMDBData)
- JSON manipuleren en weergeven
    - main.js:6 (import translationsData van dictionary.json)
    - src/js/fetch.js:3 (JSON.parse() van localStorage)
    - src/js/fetch.js:8 (JSON.stringify() naar localStorage)
    - src/js/fetch.js:37 (await response.json())
    - src/js/fetch.js:108-128 (JSON data transformeren in renderIMDBData)

### Opslag & validatie
- Formulier validatie
    - main.js:196 (search input validation met .trim())
    - src/js/fetch.js:12 (.includes() validatie of favoriet bestaat)
    - src/js/fetch.js:24-25 (.filter() validatie op favorites)
- Gebruik van LocalStorage
    - main.js:110 (localStorage.getItem('language'))
    - main.js:111 (localStorage.setItem('language', newLanguage))
    - main.js:128 (localStorage.getItem('theme'))
    - main.js:135 (localStorage.setItem('theme', isLight ? 'light' : 'dark'))
    - src/js/fetch.js:3 (localStorage.getItem('moofav-favorites'))
    - src/js/fetch.js:8 (localStorage.setItem('moofav-favorites'))

### Styling & layout
- Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt)
    - index.html (basis HTML structuur van de pagina)
- Basis CSS
    - src/css/style.css (algemene styling van de app)
- Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes, ...)
    - src/css/style.css (styling van de movie popup met knoppen en icoontjes)
    - main.js:190-208 (♡ ♥ ● ○ icoontjes voor UI elementen)

### Tooling & structuur
- Project is opgezet met Vite
    - package.json (Vite dependencies)
    - vite.config.js (Vite configuratie)
- Een correcte folderstructuur wordt aangehouden (gescheiden html, css en js files, src folder, dist folder, ...)
    - index.html (HTML bestand)
    - src/css/ (CSS bestanden)
    - src/main.js (JavaScript bestand)
    - src/js/fetch.js (JavaScript bestand voor API calls)


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