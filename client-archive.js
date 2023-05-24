$(document).ready(() => {
  $.ajax({
    url: "/archive",
    type: "GET",
    dataType: "json",
    success: (data) => {
      for (let i = 0; i < data.length; i++) {
        const titleTruncated =
          data[i].title.length > 45
            ? data[i].title.substring(0, 45) + "..."
            : data[i].title;

        const cardId = `notizia${i}`;
        const modalId = `notiziaModale${i}`;
        const modalLabelId = `notiziaModaleLabel${i}`;
        const modalBodyId = `modalBody${i}`;

        $("#news-list").append(`
          <!-- NEWS -->
          <div class="col-lg-3 col-md-6">
            <div class="card mb-4" id="${cardId}" data-bs-toggle="modal" data-bs-target="#${modalId}">
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
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(
        `Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`
      );
    },
  });
});
