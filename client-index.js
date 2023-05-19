$(document).ready(() => {
  console.log("READY\n");

  // REQUEST TO SERVER
  $.ajax({
    url: "/index",
    type: "GET",
    dataType: "json",
    success: (data) => {
      const contentTruncated =
        data[0].content.length > 925
          ? data[0].content.substring(0, 600) + "..."
          : data[0].content;

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

      const latestNews = $("#latest-news");
      for (let i = 0; i < data.length; i++) {
        const titleTruncated =
          data[i].title.length > 45
            ? data[i].title.substring(0, 45) + "..."
            : data[i].title;

        latestNews.append(`
        <!-- NEWS -->
        <div class="col-lg-3">
          <div class="card mb-4" id="notizia1" data-bs-toggle="modal" data-bs-target="#notiziaModale${i}">
            <div class="position-relative">
              <img src="${data[i].imageurl}" class="card-img" alt="Immagine della notizia" />
              <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3">${data[i].category}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title">${titleTruncated}</h5>
            </div>
            
            <div class="card-footer text-center">
              <div class="btn-group" role="group" aria-label="Vote">
                <button type="button" class="btn btn-outline-success vote-btn${i}" data-value="1">1</button>
                <button type="button" class="btn btn-outline-success vote-btn${i}" data-value="2">2</button>
                <button type="button" class="btn btn-outline-success vote-btn${i}" data-value="3">3</button>
                <button type="button" class="btn btn-outline-success vote-btn${i}" data-value="4">4</button>
                <button type="button" class="btn btn-outline-success vote-btn${i}" data-value="5">5</button>
              </div>
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

        // Clicked button stays active
        const voteButtons = document.querySelectorAll(".vote-btn" + i);
        voteButtons.forEach((button) => {
          button.addEventListener("click", () => {
            voteButtons.forEach((btn) => {
              btn.classList.remove("active");
            });
            button.classList.add("active");
          });
        });

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
      console.log(
        `Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`
      );
    },
  });
});
