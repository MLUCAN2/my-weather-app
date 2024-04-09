// Set parameters for the API
function getParams(){
    const city= document.getElementById('cityInput').value;
    const apiKey= `86e8829ba67f4ba20d6af1ddf13727ff`
    const url= `api.openweathermap.org/data/2.5/forecast?`

fetch(url)
    .then(response => response.JSON())
    .then(data => {
        const weatherInfo= document.getElementById('weatherInfo')

    })



   






}


// Create a function to search through the API
function searchApi(query, format) {
    const baseUrl =  `api.openweathermap.org/data/2.5/forecast?`;
    const requestUrl= `${baseUrl}q=${query}&appid=${'86e8829ba67f4ba20d6af1ddf13727ff'}`;
    console.log(requestUrl);
}
