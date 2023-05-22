$(document).ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let weatherData = "";

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // API call
      const apiKey = "636825d70920404ca05101735230705";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

      $.ajax({
        url: "/weather",
        method: "POST",
        data: { lat, lon },
        success: function (response) {
          weatherData += response;
          $("#weather").text(weatherData);
        },
        error: function (error) {
          console.error("Error fetching weather data:", error);
        },
      });
    });
  }
});
