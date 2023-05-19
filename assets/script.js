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


// shows the current weather
const currentWeather = data.list[0];
let weatherIcon = getWeatherIcon(currentWeather.weather[0].main);
let currentDate = new Date(currentWeather.dt_txt);
currentDate = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
document.getElementById('current-weather').innerHTML = `
    <h2>${city} <i class="${weatherIcon}"></i></h2>
    <p>${currentDate}</p>
    <p>Temperature: ${((currentWeather.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</p>
    <p>Humidity: ${currentWeather.main.humidity}%</p>
    <p>Wind Speed: ${(currentWeather.wind.speed * 2.237).toFixed(2)} MPH</p>
    `;
              
    
// shows 5-day forecast
const forecast = data.list.filter((_, index) => index % 8 === 0).slice(1);
document.getElementById('forecast').innerHTML = forecast.map(day => {
let dayWeatherIcon = getWeatherIcon(day.weather[0].main);
let forecastDate = new Date(day.dt_txt);
forecastDate = (forecastDate.getMonth() + 1) + "/" + forecastDate.getDate() + "/" + forecastDate.getFullYear();
return `
<div>
    <h3>${forecastDate} <i class="${dayWeatherIcon}"></i></h3>
    <p>Temperature: ${((day.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</p>
    <p>Humidity: ${day.main.humidity}%</p>
    <p>Wind Speed: ${(day.wind.speed * 2.237).toFixed(2)} MPH</p>
    </div>
    `
    }).join('');

              
// add to search history
addToHistory(city);
});
}

// added function to add city to search history and local storage
function addToHistory(city) {
    let history;
    if (localStorage.getItem('history')) {
      history = JSON.parse(localStorage.getItem('history'));
      if (!history.includes(city)) {
        history.push(city);
      }
    } else {
      history = [city];
    }
    localStorage.setItem('history', JSON.stringify(history));
    showHistory();
  }
  
// function to have weather icons displayed on the forecast 
function getWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
      case 'Clear':
        return 'fas fa-sun';
      case 'Clouds':
        return 'fas fa-cloud';
      case 'Rain':
      case 'Drizzle':
      case 'Mist':
        return 'fas fa-cloud-rain';
      case 'Thunderstorm':
        return 'fas fa-bolt';
      case 'Snow':
        return 'fas fa-snowflake';
      default:
        return '';
    }
  }

// function to display search history
function showHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    document.getElementById('history').innerHTML = history.map(city => `<button class="history-btn">${city}</button>`).join('');
    const buttons = document.getElementsByClassName('history-btn');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', () => getCoords(buttons[i].textContent));
    }
  }
  
  // on search
  document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('search-box').value;
    getCoords(city);
  });
  
  // on load
  showHistory();