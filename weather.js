// Widget per il meteo, che richiede la posizione quando si accede per la prima volta nella sessione al sito

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
