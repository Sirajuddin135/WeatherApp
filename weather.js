const api_key = "7c58c9507d08214195fad9b7ed1e6089";

async function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    try {
        let res = await fetch(url);
        let data = await res.json();

        append(data);
        getForecast(lat, lon);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

async function getData() {
    let city = document.getElementById("city").value;
    const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    try {
        let res = await fetch(cityURL);
        let data = await res.json();
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        append(data);
        getForecast(lat, lon);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

function append(data) {
    let celsius = 273;

    let container = document.getElementById("container");
    container.innerText = "";

    let div = document.createElement("div");

    let cityName = document.createElement("h1");
    cityName.textContent = data.name;

    let temp_max = document.createElement("h4");
    temp_max.textContent = `Max temp : ${Math.floor(data.main.temp_max - celsius)}°C`;

    let temp_min = document.createElement("h4");
    temp_min.textContent = `Min temp : ${Math.floor(data.main.temp_min - celsius)}°C`;

    let windImage = document.createElement("img");
    windImage.src = "https://images.pexels.com/photos/1030320/pexels-photo-1030320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    windImage.id = "windImage";

    let wind = document.createElement("h4");
    wind.textContent = `Wind Speed : ${data.wind.speed}km/h`;

    let windDiv = document.createElement("div");
    windDiv.id = "windDiv";
    windDiv.append(windImage, wind);

    let cloudsImage = document.createElement("img");
    cloudsImage.src = "https://images.pexels.com/photos/2097628/pexels-photo-2097628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    cloudsImage.id = "cloudsImage";

    let clouds = document.createElement("h4");
    clouds.textContent = `Clouds : ${data.clouds.all}%`;

    let cloudsDiv = document.createElement("div");
    cloudsDiv.id = "cloudsDiv";
    cloudsDiv.append(cloudsImage, clouds);

    let sunriseImage = document.createElement("img");
    sunriseImage.src = "https://images.pexels.com/photos/205410/pexels-photo-205410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    sunriseImage.id = "sunriseImage";

    let sunrise = document.createElement("h4");
    var date = new Date(data.sys.sunrise * 1000);
    let sunriseTime = date.toLocaleTimeString();
    sunrise.textContent = `Sunrise : ${sunriseTime}`;

    let sunriseDiv = document.createElement("div");
    sunriseDiv.id = "sunriseDiv";
    sunriseDiv.append(sunriseImage, sunrise);

    let sunsetImage = document.createElement("img");
    sunsetImage.src = "https://images.pexels.com/photos/36744/agriculture-arable-clouds-countryside.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    sunsetImage.id = "sunsetImage";

    let sunset = document.createElement("h4");
    date = new Date(data.sys.sunset * 1000);
    let sunsetTime = date.toLocaleTimeString();
    sunset.textContent = `Sunset : ${sunsetTime}`;

    let sunsetDiv = document.createElement("div");
    sunsetDiv.id = "sunsetDiv";
    sunsetDiv.append(sunsetImage, sunset);

    div.append(cityName, temp_min, temp_max, windDiv, cloudsDiv, sunriseDiv, sunsetDiv);

    container.append(div);

    let iframe = document.getElementById("gmap_canvas");
    iframe.src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

async function getForecast(lat, lon) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${api_key}`;
    try {
        let res = await fetch(forecastURL);
        let data = await res.json();

        appendForecast(data);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

function appendForecast(data) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let idsObj = {
        2: "11", 3: "09", 5: "09", 6: "13", 7: "50", 8: "04"
    }
    let ids = [2, 3, 5, 6, 7, 8];
    let iconIds = [11, 09, 09, 13, 50, 04];
    forecast.innerText = "";

    data.daily.forEach(element => {
        let celsius = 273;

        let forecast = document.getElementById("forecast");

        let div = document.createElement("div");

        let day = document.createElement("h1");
        let date = new Date(element.dt * 1000);
        day.textContent = days[date.getDay()];

        let weatherName = element.weather[0].main;
        let weatherID = "" + element.weather[0].id;
        let iconNumber = idsObj[weatherID[0]];

        let weatherIcon = document.createElement("img");
        weatherIcon.id = "weatherImage";
        weatherIcon.src = `http://openweathermap.org/img/wn/${iconNumber}d.png`

        let temp_max = document.createElement("h2");
        temp_max.textContent = `${Math.floor(element.temp.max - celsius)}°`;

        let temp_min = document.createElement("h3");
        temp_min.textContent = `${Math.floor(element.temp.min - celsius)}°`;

        div.append(day, weatherIcon, temp_max, temp_min);

        forecast.append(div);

        console.log(element);
    });
}

// Based on current location

function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(success);
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getWeather(latitude, longitude);
        console.log(latitude);
        console.log(longitude);
    }
}

getLocationWeather();