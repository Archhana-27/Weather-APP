const temperatureField = document.querySelector('.temp p');
const locationField = document.querySelector('.time_location p:first-child');
const dateAndTimeField = document.querySelector('.time_location p:last-child');
const conditionField = document.querySelector('.condition p:last-child');
const weatherIcon = document.createElement('img'); // Create an image element for icons
const searchField = document.querySelector('.search_area');
const form = document.querySelector('form');

form.addEventListener('submit', searchForLocation);

let target = 'Mumbai'; // Default city

// Auto-detect location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchResult(`${latitude},${longitude}`); // Fetch weather for user's location
    },
    () => {
      fetchResult(target); // If denied, fetch default city
    }
  );
} else {
  fetchResult(target);
}

const fetchResult = async (targetLocation) => {
  let url = `http://api.weatherapi.com/v1/current.json?key=d93f55d51e9749fc807134432250302&q=${targetLocation}&aqi=no`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      alert("City not found! Please enter a valid city name.");
      return;
    }

    let locationName = data.location.name;
    let time = data.location.localtime;
    let temp = data.current.temp_c;
    let condition = data.current.condition.text;
    let iconUrl = data.current.condition.icon; // Get weather icon

    updateDetails(temp, locationName, time, condition, iconUrl);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Failed to fetch weather data. Please check your internet connection.");
  }
};

function updateDetails(temp, locationName, time, condition, iconUrl) {
  let [splitDate, splitTime] = time.split(' ');

  let dateObject = new Date(splitDate + "T00:00:00");
  let currentDay = getDayName(dateObject.getDay());

  temperatureField.innerText = `${temp}°C`;
  locationField.innerText = locationName;
  dateAndTimeField.innerText = `${splitTime} - ${currentDay} ${splitDate}`;
  conditionField.innerText = condition;

  // Set weather icon
  weatherIcon.src = `https:${iconUrl}`;
  weatherIcon.alt = condition;
  weatherIcon.style.width = "80px"; // Adjust icon size
  conditionField.parentElement.insertBefore(weatherIcon, conditionField);
}

function searchForLocation(e) {
  e.preventDefault();
  target = searchField.value.trim();

  if (target === "") {
    alert("Please enter a city name!");
    return;
  }

  fetchResult(target);
}

function getDayName(number) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[number];
}