$(document).ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // API call
      const apiKey = "636825d70920404ca05101735230705";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

      axios
        .get(url)
        .then((response) => {
          const data = response.data;

          $("#weather").text(data.location.name + ", " + data.current.condition.text + " " + data.current.temp_c + "°C");
        })
        .catch((error) => {
          console.error("Error getting weather data:", error);
        });
    });
  }
});
