// DOM Element Selectors
const themeToggleBtn = document.getElementById('theme-toggle');
const locationBtn = document.getElementById('location-btn');
const searchBtn = document.getElementById('search-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');

// Saved list elements
const favoritesContainer = document.getElementById('favorites-container');
const favoritesItems = document.getElementById('favorites-items');
const recentsContainer = document.getElementById('recents-container');
const recentsItems = document.getElementById('recents-items');

// Core Card Elements
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-description');

// Sub Metrics Elements
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// Advanced Metrics Elements
const aqiLevel = document.getElementById('aqi-level');
const aqiDesc = document.getElementById('aqi-desc');
const uvValue = document.getElementById('uv-value');
const uvStatus = document.getElementById('uv-status');
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');

// Carousels and Forecast containers
const hourlyCarousel = document.getElementById('hourly-carousel');
const dailyList = document.getElementById('daily-list');

// API Configuration
const API_KEY = 'bdc083837e979d0ee858d7df90fde8dd';
let currentCityName = ''; // Tracks the active search target

// Storage State Pools
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recents = JSON.parse(localStorage.getItem('recents')) || [];

// 1. Dark Mode / Light Mode Control
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme choice
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

// 2. Format Dates
function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    currentDate.textContent = new Date().toLocaleDateString('en-US', options);
}
updateDate();

// 3. Mapping standard icons smoothly
function getFontAwesomeIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun', '01n': 'fa-moon',
        '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud', '03n': 'fa-cloud',
        '04d': 'fa-cloud', '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy', '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt', '11n': 'fa-bolt',
        '13d': 'fa-snowflake', '13n': 'fa-snowflake',
        '50d': 'fa-smog', '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-cloud';
}

// 4. Geolocation Detection
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, () => {
            alert('Location access denied. Please search manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// 5. Fetch Weather and coordinates
async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        errorMessage.classList.add('hidden');
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        updateUI(data);
        fetchForecastAndPollution(lat, lon);
    } catch {
        errorMessage.classList.remove('hidden');
    }
}

async function fetchWeatherByCity(city) {
    if (!city.trim()) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    try {
        errorMessage.classList.add('hidden');
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        updateUI(data);
        fetchForecastAndPollution(data.coord.lat, data.coord.lon);
        addToRecents(data.name);
    } catch {
        errorMessage.classList.remove('hidden');
    }
}

// 6. Fetch Forecast & AQI
async function fetchForecastAndPollution(lat, lon) {
    // 5-Day / 3-Hour Forecast Data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    // Air Quality Index Data
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const [forecastRes, pollutionRes] = await Promise.all([
            fetch(forecastUrl),
            fetch(pollutionUrl)
        ]);

        if (forecastRes.ok) {
            const forecastData = await forecastRes.json();
            renderForecast(forecastData.list);
        }
        if (pollutionRes.ok) {
            const pollutionData = await pollutionRes.json();
            updateAQI(pollutionData.list[0]);
        }
    } catch (err) {
        console.error("Failed to load secondary details: ", err);
    }
}

// 7. Update UI Layout Elements
function updateUI(data) {
    currentCityName = data.name;
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;

    const description = data.weather[0].description;
    weatherDesc.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    weatherIcon.className = `fas ${getFontAwesomeIcon(data.weather[0].icon)}`;

    // Sun Cycles Formatting
    const sunOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    sunriseTime.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], sunOptions);
    sunsetTime.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString([], sunOptions);

    // Dynamic UV Index Estimation based on Clouds & Sunset parameters
    calculateUVEstimate(data);
    updateFavoriteButtonState();
}

// 8. Dynamic AQI Meter
function updateAQI(aqiObj) {
    const level = aqiObj.main.aqi;
    const aqiLevels = {
        1: { text: "Good", color: "#22c55e", desc: "Air quality is satisfactory." },
        2: { text: "Fair", color: "#84cc16", desc: "Acceptable quality." },
        3: { text: "Moderate", color: "#eab308", desc: "Mild irritation possible." },
        4: { text: "Poor", color: "#f97316", desc: "Unhealthy for sensitive groups." },
        5: { text: "Very Poor", color: "#ef4444", desc: "Dangerous health alert levels." }
    };

    const target = aqiLevels[level];
    aqiLevel.textContent = target.text;
    aqiLevel.style.backgroundColor = target.color;
    aqiDesc.textContent = target.desc;
}

// Helper to estimate safe UV Index
function calculateUVEstimate(data) {
    const cloudCover = data.clouds.all; // 0 to 100
    const now = Math.floor(Date.now() / 1000);
    const isDaylight = now > data.sys.sunrise && now < data.sys.sunset;

    if (!isDaylight) {
        uvValue.textContent = "0";
        uvStatus.textContent = "Nighttime";
        return;
    }

    // Rough calculation matching general daylight parameters
    let baseUV = 10 - (cloudCover / 10);
    baseUV = Math.max(1, Math.min(11, baseUV));
    const finalUV = Math.round(baseUV);

    uvValue.textContent = finalUV;
    if (finalUV <= 2) uvStatus.textContent = "Low";
    else if (finalUV <= 5) uvStatus.textContent = "Moderate";
    else if (finalUV <= 7) uvStatus.textContent = "High";
    else uvStatus.textContent = "Very High";
}

// 9. Process and Render Carousels
function renderForecast(forecastList) {
    hourlyCarousel.innerHTML = '';
    dailyList.innerHTML = '';

    // A. Hourly Carousel (Next 8 chunks = 24 Hours)
    for (let i = 0; i < 8; i++) {
        const item = forecastList[i];
        const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = `${Math.round(item.main.temp)}°`;
        const iconClass = getFontAwesomeIcon(item.weather[0].icon);

        const card = document.createElement('div');
        card.className = 'hour-card';
        card.innerHTML = `
            <span>${time}</span>
            <i class="fas ${iconClass}"></i>
            <span>${temp}</span>
        `;
        hourlyCarousel.appendChild(card);
    }

    // B. Group Forecast items into unique days (5-Day Layout Map)
    const uniqueDays = {};
    forecastList.forEach(item => {
        const dateStr = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'long' });
        const todayStr = new Date().toLocaleDateString([], { weekday: 'long' });
        
        if (dateStr === todayStr) return; // Skip today's list array

        if (!uniqueDays[dateStr]) {
            uniqueDays[dateStr] = [];
        }
        uniqueDays[dateStr].push(item);
    });

    // Render each day row
    Object.keys(uniqueDays).slice(0, 5).forEach(day => {
        const readings = uniqueDays[day];
        // Calculate max temperature
        const maxTemp = Math.round(Math.max(...readings.map(r => r.main.temp)));
        const condition = readings[Math.floor(readings.length / 2)].weather[0]; // mid-day preview

        const row = document.createElement('div');
        row.className = 'day-row';
        row.innerHTML = `
            <span class="day-name">${day}</span>
            <span class="day-cond">
                <i class="fas ${getFontAwesomeIcon(condition.icon)}"></i>
                ${condition.main}
            </span>
            <span class="day-temp">${maxTemp}°C</span>
        `;
        dailyList.appendChild(row);
    });
}

// 10. Favorites & Recent List System
favoriteBtn.addEventListener('click', () => {
    if (!currentCityName) return;
    if (favorites.includes(currentCityName)) {
        favorites = favorites.filter(c => c !== currentCityName);
    } else {
        favorites.push(currentCityName);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderSavedLists();
    updateFavoriteButtonState();
});

function addToRecents(city) {
    if (recents.includes(city)) {
        recents = recents.filter(c => c !== city);
    }
    recents.unshift(city);
    if (recents.length > 5) recents.pop(); // Max 5 items
    localStorage.setItem('recents', JSON.stringify(recents));
    renderSavedLists();
}

function updateFavoriteButtonState() {
    const icon = favoriteBtn.querySelector('i');
    if (favorites.includes(currentCityName)) {
        icon.className = 'fas fa-star';
    } else {
        icon.className = 'far fa-star';
    }
}

function renderSavedLists() {
    // Render Favorites
    if (favorites.length > 0) {
        favoritesContainer.classList.remove('hidden');
        favoritesItems.innerHTML = '';
        favorites.forEach(city => {
            const badge = document.createElement('span');
            badge.className = 'list-badge';
            badge.textContent = city;
            badge.addEventListener('click', () => fetchWeatherByCity(city));
            favoritesItems.appendChild(badge);
        });
    } else {
        favoritesContainer.classList.add('hidden');
    }

    // Render Recents
    if (recents.length > 0) {
        recentsContainer.classList.remove('hidden');
        recentsItems.innerHTML = '';
        recents.forEach(city => {
            const badge = document.createElement('span');
            badge.className = 'list-badge';
            badge.textContent = city;
            badge.addEventListener('click', () => fetchWeatherByCity(city));
            recentsItems.appendChild(badge);
        });
    } else {
        recentsContainer.classList.add('hidden');
    }
}

// Search Inputs triggers
searchBtn.addEventListener('click', () => fetchWeatherByCity(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeatherByCity(cityInput.value);
});

// Startup Defaults (Loads Lucknow)
window.addEventListener('DOMContentLoaded', () => {
    renderSavedLists();
    fetchWeatherByCity('Lucknow');
});