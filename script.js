
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const message = document.querySelector("#message");

// Search button click
searchBtn.addEventListener("click", getWeather);

// Enter key press
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }

    message.innerText = "Loading...";

    try {

        // Step 1: Get city coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather data

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather data unavailable");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Display weather

        cityName.innerText =
            `${location.name}, ${location.country}`;

        temperature.innerText =
            `${current.temperature_2m} °C`;

        description.innerText =
            `Feels like ${current.apparent_temperature} °C`;

        humidity.innerText =
            `Humidity: ${current.relative_humidity_2m}%`;

        wind.innerText =
            `Wind Speed: ${current.wind_speed_10m} km/h`;

        message.innerText = "";

    } catch (error) {

        message.innerText = error.message;

    }
}
