const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const messageText = document.querySelector("[data-messageText]");
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickTab) {
    apiErrorContainer.classList.remove("active");
    if (clickTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather tab me aa gya hu, toh weather bhi display karna padega, 
            // so let's check local storage first for co-prdinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// This function will make an api call
async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // remove grant access contianer
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${err?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo) {
    // firstly we have to fetch the elements.
    console.log("Weather Info");
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-CountryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch Values from weatherInfo objects and put in UI.
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {
    console.log('Went to get location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    console.log('Went to get position');
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    console.log('going to render services');
    fetchUserWeatherInfo(userCoordinates);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            messageText.innerText = "You denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            messageText.innerText = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            messageText.innerText = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            messageText.innerText = "An unknown error occurred.";
            break;
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// Now Custom search Manual
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}





































































































// let API_key = "24ea8a99f847b31dc0d8e7f622bfbab2";

// async function displayWeather() {
//     let lat = 22.8046;
//     let lon = 86.2029;
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
//     const data = await response.json();

//     console.log('My Weather data: -> ',data);
// }