// Fetch the JSON data from the file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching travel data:', error);
    }
}

// Normalize the search keyword (lowercase for uniformity)
function normalizeKeyword(keyword) {
    return keyword.toLowerCase().trim();
}

// Search function based on keyword (for beach, temple, or country)
async function searchTravelData(keyword) {
    const travelData = await fetchTravelData();
    const normalizedKeyword = normalizeKeyword(keyword);

    let results = {
        beaches: [],
        temples: [],
        countries: [],
    };

    // Check if the keyword matches beach, temple, or country
    if (normalizedKeyword.includes("beach")) {
        results.beaches = travelData.beaches.slice(0, 2); // Get two beach recommendations
    }

    if (normalizedKeyword.includes("temple")) {
        results.temples = travelData.temples.slice(0, 2); // Get two temple recommendations
    }

    // Loop through countries to match the keyword
    travelData.countries.forEach(country => {
        if (normalizedKeyword.includes(country.name.toLowerCase())) {
            results.countries.push(country);
        }
    });

    return results;
}

// Display search results
function displayResults(results) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear previous results

    const createCard = (title, imageUrl, description) => `
        <div class="card">
            <img src="${imageUrl}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;

    // Display beaches
    if (results.beaches.length) {
        results.beaches.forEach(beach => {
            main.innerHTML += createCard(beach.name, beach.imageUrl, beach.description);
        });
    }

    // Display temples
    if (results.temples.length) {
        results.temples.forEach(temple => {
            main.innerHTML += createCard(temple.name, temple.imageUrl, temple.description);
        });
    }

    // Display countries (cities within the countries)
    if (results.countries.length) {
        results.countries.forEach(country => {
            country.cities.slice(0, 2).forEach(city => { // Display two cities
                main.innerHTML += createCard(city.name, city.imageUrl, city.description);
            });
        });
    }

    // Handle case where no results are found
    if (!results.beaches.length && !results.temples.length && !results.countries.length) {
        main.innerHTML = `<p>No results found for your search.</p>`;
    }
}

// Start the search when the user submits the keyword
async function searchStart() {
    const searchBar = document.getElementById('searchBar');
    const keyword = searchBar.value.trim();

    // Handle empty search input
    if (!keyword) {
        alert('Please enter a search keyword.');
        return;
    }

    // Perform search based on the keyword and display results
    const results = await searchTravelData(keyword);
    displayResults(results);
}

// Clear search input and reset the display
function clearSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = '';
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="hero-content">
            <h1>EXPLORE <br> DREAM <br> DESTINATION</h1>
            <p>It encourages exploration of unfamiliar territories, embracing diverse cultures and landscapes.</p>
            <a href="#" class="cta-button">BOOK NOW</a>
        </div>
    `;
}

// Attach event listeners for the search and clear buttons
document.getElementById('searchButton').addEventListener('click', searchStart);
document.getElementById('clearButton').addEventListener('click', clearSearch);
