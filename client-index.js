$(document).ready(() => {
  console.log("READY\n");

  // REQUEST TO SERVER
  $.ajax({
    url: "/index",
    type: "GET",
    dataType: "json",
    success: (data) => {
      const content = data[0].content.length > 925 ? data[0].content.substring(0, 600) + '...' : data[0].content;

      $("#img-main").attr("src", data[0].imageurl);
      $(".title-main").text(data[0].title);
      $(".content-main").text(content);
      $(".content-main-modal").text(data[0].content);

      const latestNews = $("#latest-news");
      for (let i = 0; i < data.length; i++) {
        latestNews.append(`
        <!-- NEWS -->
        <div class="col-lg-3">
          <div class="card mb-4" id="notizia1" data-bs-toggle="modal" data-bs-target="#notiziaModale${i}">
            <div class="position-relative">
              <img src="${data[i].imageurl}" class="card-img" alt="Immagine della notizia" />
              <span class="badge bg-light text-secondary position-absolute top-0 start-0 m-3">${data[i].category}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title">${data[i].title}</h5>
            </div>
          </div>
        </div>
        <!-- MODAL -->
        <div class="modal fade" id="notiziaModale${i}" tabindex="-1" aria-labelledby="notiziaModaleLabel${i}" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="notiziaModaleLabel">${data[i].title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
              </div>
              <div class="modal-body">${data[i].content}</div>
            </div>
          </div>
        </div>
        `);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
    },
  });

  // REQ
});
