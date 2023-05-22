$(document).ready(() => {
  let loggedIn = false;
  // REQUEST TO SERVER

  $.ajax({
    url: "/index",
    type: "GET",
    dataType: "json",
    success: (response) => {
      const loggedIn = response.loggedIn;
      const data = response.latestNews;
      const contentTruncated = data[0].content.length > 925 ? data[0].content.substring(0, 600) + "..." : data[0].content;

      const latestNews = $("#latest-news");
      for (let i = 0; i < data.length; i++) {
        if (i == 0) {
          $("#main-news").append(`
          <div class="col-lg-6 d-none d-lg-block">
          <div class="card mb-4" style="max-height: 400px; height: 400px">
            <div class="card-body">
              <h2 class="card-title mt-3 mb-3 title-main fw-bold"></h2>
              <p class="card-text content-main"></p>
            </div>
            <a href="#" class="text-decoration-none text-dark">
              <div class="card-footer text-center" data-bs-toggle="modal" data-bs-target="${loggedIn ? "#mainModal" : "#loginModal"}">Read the full news</div>
            </a>
          </div>
        </div>
  
        <div class="col-lg-6 img-container d-none d-lg-block">
          <img src="" class="card-img img0" id="img-main" alt="" />
        </div>
  
        <!-- MAIN MODAL -->
        <div class="modal fade" id="modal-main" tabindex="-1" aria-labelledby="modal-main-label" aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title title-main fw-bold" id="modal-main-label"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
              </div>
              <div class="modal-body content-main-modal"></div>
            </div>
          </div>
        </div>
          `);

          $("#img-main").attr("src", data[0].imageurl);
          $(".title-main").text(data[0].title);
          $(".content-main").text(contentTruncated);
          //$(".content-main-modal").text(data[0].content);

          const content = data[0].content;
          const paragraphs = content.split("\n");

          paragraphs.forEach((par) => {
            const p = document.createElement("p");
            p.textContent = par.trim();
            $(".content-main-modal").append(p);
          });
        }

        const titleTruncated = data[i].title.length > 45 ? data[i].title.substring(0, 45) + "..." : data[i].title;

        latestNews.append(`
        <!-- NEWS -->
        <div class="col-lg-3">
          <div class="card mb-4" id="notizia1" data-bs-toggle="modal" data-bs-target=" ${loggedIn ? "#notiziaModale" + i : "#loginModal"}">
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
        <div class="modal fade" id="notiziaModale${i}" tabindex="-1" aria-labelledby="notiziaModaleLabel${i}" aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable  ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="notiziaModaleLabel">${data[i].title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
              </div>
              <div class="modal-body" id="modalBody${i}"></div>
            </div>
          </div>
        </div>
        `);

        const content = data[i].content;
        const paragraphs = content.split("\n");
        const modalBody = $("#modalBody" + i);

        paragraphs.forEach((par) => {
          const p = document.createElement("p");
          p.textContent = par.trim();
          modalBody.append(p);
        });
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
    },
  });
});
