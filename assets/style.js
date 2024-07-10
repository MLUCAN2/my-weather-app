document.getElementById('city-input').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    if (city.trim() !== '') {
        getWeatherData(city);
    } else {
        alert('Enter city name');
    }
});

const apiKey = `86e8829ba67f4ba20d6af1ddf13727ff`;

// Set parameters for the API
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("weather", JSON.stringify(data));
            console.log(data);
            displayWeatherData(data);
            displayForecastData(data);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

// Displays info on page
function displayWeatherData(data) {
    const cityName = data.city.name;
    const icon = data.list[0].weather[0].icon;

    const cityWeatherData = document.getElementById('city-weather-data');
    cityWeatherData.innerHTML = `${cityName} <button id="save-city-btn" class="save-city btn btn-secondary btn-sm">Save</button>`;
    document.getElementById('save-city-btn').addEventListener('click', function () {
        saveCity(cityName);
    });

    document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png">`;

    const weatherData = document.getElementById('weather-data');
    weatherData.innerHTML = "";

    const weatherItem = data.list[0];
    const date = new Date(weatherItem.dt * 1000);
    const temperatureF = convertKToF(weatherItem.main.temp);
    const windSpeedMph = convertMpstoMph(weatherItem.wind.speed);
    const humidity = weatherItem.main.humidity;

    const weatherItemEl = document.createElement("div");
    weatherItemEl.classList.add("weather-item");
    
    weatherItemEl.innerHTML = `
        <div>Date: ${date.toLocaleDateString()}</div>
        <div>Temperature: ${temperatureF} F</div>
        <div>Wind Speed: ${windSpeedMph} m/h</div>
        <div>Humidity: ${humidity} %</div>
    `;

    weatherData.appendChild(weatherItemEl);
}

// 5-Day Forecast Section
function displayForecastData(data) {
    const forecastContainer = document.getElementById('five-day-forecast');
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const forecastCard = data.list[i * 8];
        const date = new Date(forecastCard.dt * 1000);
        const temperatureF = convertKToF(forecastCard.main.temp);
        const windSpeedMph = convertMpstoMph(forecastCard.wind.speed);
        const humidity = forecastCard.main.humidity;
        const icon = forecastCard.weather[0].icon;

        const card = document.createElement('div');
        card.classList.add('card');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        cardBody.innerHTML = `
            <h3 class="card-title">${date.toLocaleDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}.png">
            <p class="card-text">Temperature: ${temperatureF} F</p>
            <p class="card-text">Wind Speed: ${windSpeedMph} m/h</p>
            <p class="card-text">Humidity: ${humidity} %</p>
        `;

        card.appendChild(cardBody);
        forecastContainer.appendChild(card);
    }
}

// Save city to local storage and update saved cities list
function saveCity(cityName) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (!savedCities.includes(cityName)) {
        savedCities.push(cityName);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        updateSavedCitiesList();
    }
}

// Update the saved cities list on the page
function updateSavedCitiesList() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    const savedCitiesList = document.getElementById('saved-cities');
    savedCitiesList.innerHTML = '';

    savedCities.forEach(city => {
        const cityItem = document.createElement('li');
        cityItem.classList.add('saved-city-item');

        const cityNameEl = document.createElement('span');
        cityNameEl.textContent = city;
        cityNameEl.classList.add('city-name');
        cityNameEl.addEventListener('click', function () {
            getWeatherData(city);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteCity(city);
        });

        cityItem.appendChild(cityNameEl);
        cityItem.appendChild(deleteBtn);
        savedCitiesList.appendChild(cityItem);
    });
}

// Delete city from local storage and update saved cities list
function deleteCity(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCities = savedCities.filter(savedCity => savedCity !== city);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    updateSavedCitiesList();
}

// Load saved cities on page load
document.addEventListener('DOMContentLoaded', updateSavedCitiesList);

// Conversions for temp and speed
function convertKToF(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}

function convertMpstoMph(mps) {
    return Math.round(mps * 2.23694);
}
