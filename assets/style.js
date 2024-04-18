// Set functionality for button
document.getElementById('city-input').addEventListener('submit', function(event){
    event.preventDefault();
    const city= document.getElementById('city').value;
    if (city.trim()!== ''){
        getWeatherData(city);

    }else{
        alert('Enter city name');
    }
})
// Set parameters for the API
function getWeatherData(city){
    const apiKey= `86e8829ba67f4ba20d6af1ddf13727ff`
    const url= `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

fetch(url)
    .then(response =>{
        if(!response.ok){
            throw new Error ('bad network response');
        }
        return response.json();
    })
    // Ensure info gets passed to the right functions
    .then(data => {
        localStorage.setItem("weather",JSON.stringify(data));
        console.log(data);
        displayWeatherData(data);
        displayForecastData(data);
        })
    
    .catch (error =>{
        console.error("bad fetch", error);
    });

}  

// Displays info on page
function displayWeatherData(data){
    const cityName= data.city.name;
    const icon= data.list[0].weather[0].icon;

    const cityWeatherData= document.getElementById('city-weather-data');
    cityWeatherData.textContent= `${cityName}`

    const weatherIcon= document.getElementById('weather-icon');
    weatherIcon.innerHTML= `<img src= "https://openweathermap.org/img/wn/${icon}.png">`;

    const weatherData= document.getElementById('weather-data');
    weatherData.innerHTML="";
   
    data.list.slice(0,1).forEach(weatherItem => {
        const date = new Date(weatherItem.dt * 1000);
        const temperatureK = weatherItem.main.temp;
        const temperatureF= convertKToF(temperatureK)
        console.log (temperatureK + 'K')
        const milesPerS = weatherItem.wind.speed;
        const milesPerH= convertMpstoMph(milesPerS);
        console.log (milesPerS + 'm/s')
        const humidity = weatherItem.main.humidity;

        const weatherItemEl = document.createElement("div");
        weatherItemEl.classList.add("weather-item");
        const dateEl = document.createElement("div");
        dateEl.textContent = `Date: ${date.toLocaleDateString()}`;
        const temperatureEl = document.createElement("div");
        temperatureEl.textContent = `Temperature: ${temperatureF} F`;
        const windSpeedEl = document.createElement("div");
        windSpeedEl.textContent = `Wind Speed: ${milesPerH} m/h`;
        const humidityEl = document.createElement("div");
        humidityEl.textContent = `Humidity: ${humidity} %`;
        weatherItemEl.appendChild(dateEl);
        weatherItemEl.appendChild(temperatureEl);
        weatherItemEl.appendChild(windSpeedEl);
        weatherItemEl.appendChild(humidityEl);

        weatherData.appendChild(weatherItemEl);
    });
}

// 5-Day Forecast Section (wanted to try writing in the actual html in this script)
function displayForecastData(data){
    console.log('Forecast data:', data)
    const forecastContainer= document.getElementById('five-day-forecast');
    forecastContainer.innerHTML= "";



    for (let i= 0; i < 5; i++){
        const forecastItem= data.list[i * 8];
        console.log('Forecast item', i +1, ':', forecastItem);
        const date = new Date(forecastItem.dt * 1000);
        const temperatureK = (forecastItem.main.temp);
        const temperatureF= convertKToF(temperatureK)
        console.log (temperatureK + 'K')
        const milesPerS = forecastItem.wind.speed;
        const milesPerH= convertMpstoMph(milesPerS);
        console.log (milesPerS + 'm/s')
        const humidity = forecastItem.main.humidity;
        const icon= forecastItem.weather[0].icon;

        const card=document.createElement('div')
        card.classList.add ('card');

        const cardBody= document.createElement('div');
        cardBody.classList.add('card-body');

        cardBody.innerHTML= `
            <h3 class= "card-title">${date.toLocaleDateString()}</h3>
            <img src= "https://openweathermap.org/img/wn/${icon}.png">
            <p class= "card-text">Temperature: ${temperatureF} F</p>
            <p class= "card-text"> Wind Speed: ${milesPerH} m/h
            <p class= "card-text">Humidity: ${humidity} %</p>`;

        card.appendChild(cardBody);
        forecastContainer.appendChild(card);
        

    }
}

// Conversions for temp and speed
function convertKToF(kelvin){
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}
function convertMpstoMph(mps){
    return Math.round(mps * 2.23694)
}

