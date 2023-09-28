// Your Marvel API keys
const publicKey = '2fa67806bf7bd1ad2ff370f90ace1da4';
const privateKey = '03a37db41107980f71e54000a03e988e2cac147d';

// Function to generate MD5 hash
function generateMD5Hash(ts, privateKey, publicKey) {
    const stringToHash = ts + privateKey + publicKey;
    const hash = CryptoJS.MD5(stringToHash).toString();
    return hash;
}

// Function to fetch superheroes based on user search
function fetchSuperheroes(query) {
    const ts = new Date().getTime();
    const hash = generateMD5Hash(ts, privateKey, publicKey);

    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${query}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const superheroesData = data.data.results;
            displaySuperheroes(superheroesData);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Function to display superheroes in the UI
function displaySuperheroes(superheroes) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; // Clear previous content

    superheroes.forEach((superhero) => {
        const superheroCard = createSuperheroCard(superhero);
        searchResults.appendChild(superheroCard);
    });
}

// Function to create a superhero card element
function createSuperheroCard(superhero) {
    const superheroCard = document.createElement('div');
    superheroCard.classList.add('superhero-card'); // Add a class for styling
    superheroCard.innerHTML = `
        <div>
            <img src="${superhero.thumbnail.path}/standard_fantastic.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h2>${superhero.name}</h2>
            <button onclick="viewSuperheroDetails(${superhero.id})">View Details</button>
            <button onclick="addToFavorites(${superhero.id})">Add to Favorites</button>
        </div>
    `;
    return superheroCard;
}

// Function to view superhero details
function viewSuperheroDetails(superheroId) {
    const ts = new Date().getTime();
    const hash = generateMD5Hash(ts, privateKey, publicKey);
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const superhero = data.data.results[0];
            
            // Extract additional information (comics, series, stories) from the superhero data
            const comicsCount = superhero.comics.available;
            const seriesCount = superhero.series.available;
            const storiesCount = superhero.stories.available;

            // Display superhero details including comics, series, and stories counts
            alert(`Name: ${superhero.name}\nDescription: ${superhero.description}\nComics: ${comicsCount}\nSeries: ${seriesCount}\nStories: ${storiesCount}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Function to manage favorite superheroes
const favorites = [];

function addToFavorites(superheroId) {
    if (!favorites.includes(superheroId)) {
        favorites.push(superheroId);
        displayFavorites();
    }
}

function removeFromFavorites(superheroId) {
    const index = favorites.indexOf(superheroId);
    if (index !== -1) {
        favorites.splice(index, 1);
        displayFavorites();
    }
}

// Function to fetch superhero details
function fetchSuperheroDetails(superheroId, callback) {
    const ts = new Date().getTime();
    const hash = generateMD5Hash(ts, privateKey, publicKey);
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const superhero = data.data.results[0];
            callback(superhero);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Function to display favorites in the footer bar
function displayFavorites() {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = ''; // Clear previous content

    favorites.forEach((superheroId) => {
        fetchSuperheroDetails(superheroId, (superhero) => {
            const favoriteCard = createFavoriteCard(superhero);
            favoritesList.appendChild(favoriteCard);
        });
    });
}

// Function to create a favorite card element
function createFavoriteCard(superhero) {
    const favoriteCard = document.createElement('div');
    favoriteCard.classList.add('favorite-card'); // Add a class for styling
    favoriteCard.innerHTML = `
        <div>
            <img src="${superhero.thumbnail.path}/standard_fantastic.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h2>${superhero.name}</h2>
            <button onclick="viewSuperheroDetails(${superhero.id})">View Details</button>
            <button onclick="removeFromFavorites(${superhero.id})">Remove from Favorites</button>
        </div>
    `;
    return favoriteCard;
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    fetchSuperheroes(query);
});

// Initial load - display favorite superheroes
displayFavorites();

function displaySuggestedSuperheroes() {
    const ts = new Date().getTime();
    const hash = generateMD5Hash(ts, privateKey, publicKey);

    // You can customize this API request to fetch suggested superheroes
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=8`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const superheroesData = data.data.results;
            displaySuperheroes(superheroesData, 'Suggested Superheroes');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// ... (Rest of your JavaScript code, including the functions for searching, adding to favorites, etc.)

// Initial load - display suggested superheroes
displaySuggestedSuperheroes();

// Function to show the background overlay
function showBackground() {
    const backgroundOverlay = document.getElementById('background-overlay');
    backgroundOverlay.style.opacity = '1';
}

// Initial load - show background overlay and then display suggested superheroes
showBackground();

setTimeout(() => {
    displaySuggestedSuperheroes();
}, 2000);