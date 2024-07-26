async function getWeather() {
  const location = document.getElementById('search__input').value;
  const url = `https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast?location=${location}&timesteps=1h&units=metric`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'd2290a87f5msh80d1fbe59ede3e0p1b28bejsn1f60a85184d7',
      'x-rapidapi-host': 'tomorrow-io1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    displayWeather(result);
  } catch (error) {
    console.error(error);
  }
}

function displayWeather(data) {
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = ''; // Clear previous results

  const hourlyData = data.timelines.hourly;
  
  // Filter the hourly data to include only today's forecast
  const today = new Date().toISOString().split('T')[0];
  const todayHourlyData = hourlyData.filter(hour => hour.time.startsWith(today));

  if (todayHourlyData.length === 0) {
    weatherContainer.innerHTML = 'No weather data available for today.';
    return;
  }

  // Create a container for the titles
  const titlesDiv = document.createElement('div');
  titlesDiv.className = 'titles';
  titlesDiv.innerHTML = `
    <div><strong>Weather</strong></div>
    <div><strong>Time</strong></div>
    <div><strong>Temperature</strong></div>
    <div><strong>Feels Like</strong></div>
  `;
  weatherContainer.appendChild(titlesDiv);

  // Create a container for the hourly data
  const dataDiv = document.createElement('div');
  dataDiv.className = 'data';

  todayHourlyData.forEach(hour => {
    const hourDiv = document.createElement('div');
    hourDiv.className = 'hour';

    const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temperature = hour.values.temperature;
    const feelsLike = hour.values.temperatureApparent;
    const weatherCode = hour.values.weatherCode;

    hourDiv.innerHTML = `

    <div>${getWeatherDescription(weatherCode)}</div>
      <div>${time}</div>
      <div>${temperature}°C</div>
      <div>${feelsLike}°C</div>

      `;

    dataDiv.appendChild(hourDiv);
  });

  weatherContainer.appendChild(dataDiv);
}

function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    0: 'Unknown',
    1000: 'Clear',
    1001: 'Cloudy',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    3000: 'Light Wind',
    3001: 'Wind',
    3002: 'Strong Wind',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
  };
  return weatherDescriptions[weatherCode] || 'Unknown';
}