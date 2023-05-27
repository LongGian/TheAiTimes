/*
  Client che gestisce la landing page del sito, in cui vengono mostrate
  le notizie del giorno, con possibilità di leggere una notizia "free".
  Per leggere tutti i contenuti è necessario eseguire la registrazione/login.
*/

$(document).ready(() => {
  // Gestisce il click su una news card
  // Se l'utente è loggato mostra il modale corrispondente
  // Se non loggato reindirizza alla registrazione/login
  const handleCardClick = (index) => {
    if (checkLoggedIn()) {
      $(`#notiziaModale${index}`).modal("show");
    } else {
      window.location.href = "./subscribe.html";
    }
  };

  // Controlla tramite cookie "loggedIn" se l'utente è loggato
  const checkLoggedIn = () => {
    const loggedInCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find((cookie) => cookie[0] === "loggedIn");

    // True se "loggedIn" esiste e il suo valore è "true"
    return loggedInCookie && loggedInCookie[1] === "true";
  };

  // Mostra la notizia principale nella sezione #main-news
  const displayMainNews = (data) => {
    const mainNews = data[0];

    $("#main-news").append(`
      <div class="col-lg-6 d-lg-block">
        <div class="card mb-4" style="max-height: 400px; height: 400px">
          <div class="card-body" style="overflow-y: scroll;">
            <h2 class="card-title mt-3 mb-3 title-main fw-bold">${mainNews.title}</h2>
            <p class="card-text content-main" id="main-content"></p>
          </div>
        </div>
      </div>

      <div class="col-lg-6 img-container d-none d-lg-block">
        <img src="${mainNews.imageurl}" class="card-img img0" id="img-main" alt="" />
      </div>
    `);

    // Suddivide il testo in paragrafi e li aggiunge al body della main card
    const paragraphs = mainNews.content.split("\n\n");

    paragraphs.forEach((par) => {
      const p = $("<p>").text(par.trim());
      $("#main-content").append(p);
    });
  };

  // Mostra le 4 notizie del giorno in 4 card separate nella sezione #latest-news
  const displayLatestNews = (data) => {
    const latestNews = $("#latest-news");

    for (let i = 0; i < data.length; i++) {
      const news = data[i];

      // Il titolo viene troncato per evitare eccessivi overflow (e per fare clickbait)
      const titleTruncated = news.title.length > 45 ? news.title.substring(0, 45) + "..." : news.title;

      // Aggiunge una card che al click apre il modale corrispondente
      latestNews.append(`
        <!-- NEWS -->
        <div class="col-lg-3 col-md-6">
          <div class="card mb-4" id="notiziaCard${i}">
            <div class="position-relative">
              <img src="${news.imageurl}" class="card-img" alt="Immagine della notizia" />
              <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3">${news.category}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title fw-bold">${titleTruncated}</h5>
            </div>
          </div>
        </div>

        <!-- MODAL -->
        <div class="modal fade" id="notiziaModale${i}" tabindex="-1" aria-labelledby="notiziaModaleLabel${i}" aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="notiziaModaleLabel">${news.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
              </div>
              <div class="modal-body" id="modalBody${i}"></div>
            </div>
          </div>
        </div>
      `);

      const paragraphs = news.content.split("\n");
      const modalBody = $(`#modalBody${i}`);

      paragraphs.forEach((par) => {
        const p = $("<p>").text(par.trim());
        modalBody.append(p);
      });

      // Al click sulla card, in qualsiasi punto, apre il modale o porta al login
      $(`#notiziaCard${i}`).on("click", () => handleCardClick(i));
    }
  };

  // Richiede le 4 notizie "del giorno" (i.e. le ultime generate) al server
  const fetchData = () => {
    $.ajax({
      url: "/index",
      type: "GET",
      dataType: "json",
      success: (response) => {
        const latestNewsData = response.latestNews;

        displayMainNews(latestNewsData);
        displayLatestNews(latestNewsData);
      },
      error: (textStatus, errorThrown) => {
        console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
      },
    });
  };

  // Esegue il fetch, che eseguirà le funzioni di aggiunta delle notizie al DOM
  fetchData();
});
