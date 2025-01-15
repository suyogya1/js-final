async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching travel data:', error);
    }
}

function normalizeKeyword(keyword) {
    return keyword.toLowerCase().trim();
}

async function searchTravelData(keyword) {
    const travelData = await fetchTravelData();
    const normalizedKeyword = normalizeKeyword(keyword);

    let results = {
        beaches: [],
        temples: [],
        countries: [],
    };

    if (normalizedKeyword.includes("beach")) {
        results.beaches = travelData.beaches.slice(0, 2); 
    }

    if (normalizedKeyword.includes("temple")) {
        results.temples = travelData.temples.slice(0, 2); 
    }

    travelData.countries.forEach(country => {
        if (normalizedKeyword.includes(country.name.toLowerCase())) {
            results.countries.push(country);
        }
    });

    return results;
}

function displayResults(results) {
    const main = document.querySelector('main');
    main.innerHTML = ''; 

    const createCard = (title, imageUrl, description) => `
        <div class="card">
            <img src="${imageUrl}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;

    if (results.beaches.length) {
        results.beaches.forEach(beach => {
            main.innerHTML += createCard(beach.name, beach.imageUrl, beach.description);
        });
    }

    if (results.temples.length) {
        results.temples.forEach(temple => {
            main.innerHTML += createCard(temple.name, temple.imageUrl, temple.description);
        });
    }

    if (results.countries.length) {
        results.countries.forEach(country => {
            country.cities.slice(0, 2).forEach(city => { 
                main.innerHTML += createCard(city.name, city.imageUrl, city.description);
            });
        });
    }

    if (!results.beaches.length && !results.temples.length && !results.countries.length) {
        main.innerHTML = `<p>No results found for your search.</p>`;
    }
}

async function searchStart() {
    const searchBar = document.getElementById('searchBar');
    const keyword = searchBar.value.trim();

    if (!keyword) {
        alert('Please enter a search keyword.');
        return;
    }

    const results = await searchTravelData(keyword);
    displayResults(results);
}

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

document.getElementById('searchButton').addEventListener('click', searchStart);
document.getElementById('clearButton').addEventListener('click', clearSearch);
