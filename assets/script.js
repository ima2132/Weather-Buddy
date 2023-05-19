const apiKey = '07bd71159fe7fdd73dfe6ac22f6b44ef';
console.log("hello....")

// function to fetch coordinates of the respective city
function getCoords(city) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      getWeather(data[0].lat, data[0].lon, city)
    });
}

function getWeather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        
 // show current weather forecast 
    const currentWeather = data.list[0];
    let weatherIcon = getWeatherIcon(currentWeather.weather[0].main);
     document.getElementById('current-weather').innerHTML = `
    <h2>${city} <i class="${weatherIcon}"></i></h2>
        <p>${currentWeather.dt_txt}</p>
        <p>Temperature: ${(currentWeather.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed}m/s</p>`;
              
// show 5-day forecast
const forecast = data.list.filter((_, index) => index % 8 === 0).slice(1);
document.getElementById('forecast').innerHTML = forecast.map(day => {
let dayWeatherIcon = getWeatherIcon(day.weather[0].main);
    return `
        <div>
        <h3>${day.dt_txt} <i class="${dayWeatherIcon}"></i></h3>
        <p>Temperature: ${(day.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: ${day.main.humidity}%</p>
        <p>Wind Speed: ${day.wind.speed}m/s</p>
        </div>
        `
    }).join('');

// add to search history
addToHistory(city);
});
}