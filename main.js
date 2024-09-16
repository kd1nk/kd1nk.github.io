const apiKey = '7c3903d1e139fc7fd7c083327735690d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const hourlyApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function getWeather() {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    const weatherUrl = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    const hourlyUrl = `${hourlyApiUrl}?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert('City not found.');
                return;
            }

            const temperature = `Temperature: ${data.main.temp}°C`;
            const description = `Description: ${data.weather[0].description}`;
            const humidity = `Humidity: ${data.main.humidity}%`;
            const wind = `Wind Speed: ${data.wind.speed} m/s`;

            document.getElementById('temperature').textContent = temperature;
            document.getElementById('description').textContent = description;
            document.getElementById('humidity').textContent = humidity;
            document.getElementById('wind').textContent = wind;

            // Add city to recent searches after successfully getting weather data
            addToRecentSearches(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

    // Fetch hourly forecast
    fetch(hourlyUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== '200') {
                console.error('Error fetching hourly forecast data:', data.message);
                return;
            }

            const hourlyList = document.getElementById('hourly-list');
            hourlyList.innerHTML = ''; // Clear previous hourly data

            data.list.slice(0, 8).forEach(hour => { // Display next 8 hours
                const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const temp = `Temperature: ${hour.main.temp}°C`;
                const description = `Description: ${hour.weather[0].description}`;
                const humidity = `Humidity: ${hour.main.humidity}%`;
                const wind = `Wind Speed: ${hour.wind.speed} m/s`;

                const hourItem = document.createElement('div');
                hourItem.className = 'hourly-item';
                hourItem.innerHTML = `
                    <p><strong>${time}</strong></p>
                    <p>${temp}</p>
                    <p>${description}</p>
                    <p>${humidity}</p>
                    <p>${wind}</p>
                `;

                hourlyList.appendChild(hourItem);
            });
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
        })
        .finally(() => {
            // Hide loading spinner
            document.getElementById('loading-spinner').style.display = 'none';
        });
}

function addToRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Add city to the beginning of the array
    recentSearches.unshift(city);
    
    // Limit to 5 recent searches
    if (recentSearches.length > 5) {
        recentSearches = recentSearches.slice(0, 5);
    }
    
    // Save updated array to local storage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

    displayRecentSearches();
}

function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const searchList = document.getElementById('search-list');
    searchList.innerHTML = '';

    recentSearches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        searchList.appendChild(li);
    });
}

window.onload = displayRecentSearches;




