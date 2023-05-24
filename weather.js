$(document).ready(() => {
  let weatherData = "";
  if (weatherData == "" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const data = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      if (weatherData == "") {
        $.ajax({
          url: "/weather",
          method: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: function (response) {
            weatherData += response;
            $("#weather").html(weatherData);
          },
          error: function (error) {
            console.error("Error fetching weather data:", error);
          },
        });
      }
      $("#weather").html(weatherData);
    });
  }
});
