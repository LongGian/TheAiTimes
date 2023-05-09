const weather = Vue.createApp({
  data() {
    return {
      weatherDescription: "",
      temperature: "",
      location: ""
    }
  },
  methods: {
    getWeather() {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // API call
          const apiKey = "636825d70920404ca05101735230705 ";
          const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

          const response = await fetch(url);
          const data = await response.json();

          // Insert data in UI
          const weatherDescription = data.current.condition.text;
          const temperature = data.current.temp_c;
          const location = data.location.name;

          this.weatherDescription = weatherDescription;
          this.temperature = temperature;
          this.location = location + ',';
        });
    }
  },
  mounted() {
    this.getWeather();
  }
});

weather.mount("#weather");