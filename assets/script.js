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