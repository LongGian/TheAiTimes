let app = Vue.createApp({
  data() {
    return {
      titolo: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      contenuto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  },
  methods: {
    getNews() {
      const temperature = 0.5;
      const model = "text-davinci-003";
      const apiKey = "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";
      const apiUrl = "https://api.openai.com/v1/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      axios
        .post(
          apiUrl,
          {
            model: model,
            prompt: "Siamo nell'anno 2093 in una società futuristica e ipertecnologica, genera un titolo per una notizia (in lingua italiana):",
            temperature: temperature,
            max_tokens: 30,
          },
          {
            headers: headers,
          }
        )
        .then((response) => {
          const titoloGenerato = response.data.choices[0].text.trim();
          const prompt = "Genera un contenuto per l'articolo '" + titoloGenerato + "', massimo 1000 caratteri: ";
          axios
            .post(
              apiUrl,
              {
                model: model,
                prompt: prompt,
                temperature: temperature,
                max_tokens: 300,
              },
              {
                headers: headers,
              }
            )
            .then((response) => {
              const contenutoGenerato = response.data.choices[0].text;
              this.titolo = titoloGenerato;
              this.contenuto = contenutoGenerato;
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    //this.getNews();
  },
});

app.mount("#app");
