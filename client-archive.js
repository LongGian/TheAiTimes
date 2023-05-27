/*
  Client che gestisce la pagina Archive, nella quale sono mostrate
  tutte le notizie presenti e passate, ovvero tutte quelle presenti nel DB.
  Come nella Home, vengono mostrate in card separate e apribili solo da utenti
  registrati e loggati. C'è la possibilità di filtrare le notizie per categoria. 
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

  // Controlla, tramite cookie "loggedIn" se l'utente è loggato
  const checkLoggedIn = () => {
    const loggedInCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find((cookie) => cookie[0] === "loggedIn");

    // True se "loggedIn" esiste e il suo valore è "true"
    return loggedInCookie && loggedInCookie[1] === "true";
  };

  // Mostra tutte le notizie se non è selezionata una categoria
  // Oppure mostra solo le notizie della categoria selezionata
  const displayNewsByCategory = (data, category) => {
    const newsList = $("#news-list");
    newsList.empty();

    for (let i = 0; i < data.length; i++) {
      if (category === "" || data[i].category === category) {
        // Il titolo viene troncato per evitare eccessivi overflow (e per fare clickbait)
        const titleTruncated = data[i].title.length > 45 ? data[i].title.substring(0, 45) + "..." : data[i].title;

        const cardId = `notizia${i}`;
        const modalId = `notiziaModale${i}`;
        const modalLabelId = `notiziaModaleLabel${i}`;
        const modalBodyId = `modalBody${i}`;

        // Aggiunge una card che al click apre il modale corrispondente
        newsList.append(`
          <!-- NEWS -->
          <div class="col-lg-3 col-md-6">
            <div class="card mb-4" id="${cardId}">
              <div class="position-relative">
                <img src="${data[i].imageurl}" class="card-img" alt="Immagine della notizia" />
                <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3">${data[i].category}</span>
              </div>
              <div class="card-body">
                <h5 class="card-title fw-bold">${titleTruncated}</h5>
              </div>
            </div>
          </div>
          <!-- MODAL -->
          <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalLabelId}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title fw-bold" id="${modalLabelId}">${data[i].title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                </div>
                <div class="modal-body" id="${modalBodyId}"></div>
              </div>
            </div>
          </div>
        `);

        const content = data[i].content;
        const paragraphs = content.split("\n");
        const modalBody = $(`#${modalBodyId}`);

        paragraphs.forEach((par) => {
          const p = document.createElement("p");
          p.textContent = par.trim();
          modalBody.append(p);
        });

        // Al click sulla card, in qualsiasi punto, apre il modale o porta al login
        $(`#${cardId}`).on("click", () => handleCardClick(i));
      }
    }
  };

  // Richiede tutte le notizie al server
  const fetchData = () => {
    $.ajax({
      url: "/archive",
      type: "GET",
      dataType: "json",
      success: (data) => {
        // Inizialmente vengono mostrate tutte le notizie
        displayNewsByCategory(data, "");

        // Alla selezione di una categoria si mostrano solo le notizie corrispondenti 
        $("#category-select").change(function () {
          const selectedCategory = $(this).val();
          displayNewsByCategory(data, selectedCategory);
        });
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
      },
    });
  };

  // Esegue il fetch, che eseguirà le funzioni di aggiunta delle notizie al DOM
  fetchData();
});
