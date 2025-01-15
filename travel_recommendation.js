// Fetch data from the JSON file
async function fetchTravelData() {
  try {
      const response = await fetch('travel_recommendation_api.json');
      const data = await response.json();
      console.log('Travel Data:', data); // Check if data is fetched correctly
      return data;
  } catch (error) {
      console.error('Error fetching travel data:', error);
  }
}

// Normalize search keyword
function normalizeKeyword(keyword) {
  return keyword.toLowerCase();
}

// Search function
function searchTravelData(keyword, data) {
  const normalizedKeyword = normalizeKeyword(keyword);

  // Filter results for countries, cities, temples, and beaches
  const results = {
      countries: data.countries.filter(country =>
          normalizeKeyword(country.name).includes(normalizedKeyword) ||
          country.cities.some(city => normalizeKeyword(city.name).includes(normalizedKeyword))
      ),
      temples: data.temples.filter(temple =>
          normalizeKeyword(temple.name).includes(normalizedKeyword)
      ),
      beaches: data.beaches.filter(beach =>
          normalizeKeyword(beach.name).includes(normalizedKeyword)
      ),
  };

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

  // Display countries and cities
  results.countries.forEach(country => {
      country.cities.forEach(city => {
          main.innerHTML += createCard(city.name, city.imageUrl, city.description);
      });
  });

  // Display temples
  results.temples.forEach(temple => {
      main.innerHTML += createCard(temple.name, temple.imageUrl, temple.description);
  });

  // Display beaches
  results.beaches.forEach(beach => {
      main.innerHTML += createCard(beach.name, beach.imageUrl, beach.description);
  });
}

// Search Start function
async function searchStart() {
  const searchBar = document.getElementById('searchBar');
  const keyword = searchBar.value.trim();

  if (!keyword) {
      alert('Please enter a search keyword.');
      return;
  }

  const travelData = await fetchTravelData();
  const results = searchTravelData(keyword, travelData);
  displayResults(results);
}

// Clear Search
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


const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
const newYorkTime = new Date().toLocaleTimeString('en-US', options);
console.log("Current time in New York:", newYorkTime);