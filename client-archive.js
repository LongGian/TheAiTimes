$(document).ready(() => {
    $.ajax({
        url: "/archive",
        type: "GET",
        dataType: "json",
        success: (data) => {
            const newsList = $("#news-list");
            data.forEach((news) => {
                newsList.append(
                    `
                    <div class="col-md-3">
                        <div
                          class="card mb-4"
                          id="notizia1"
                          data-bs-toggle="modal"
                          data-bs-target="#notiziaModale1"
                        >
                            <div class="position-relative">
                              <img
                                src=${news.imageurl}
                                class="card-img"
                                alt="Immagine della notizia"
                              />
                              <span
                                class="badge bg-light text-secondary position-absolute top-0 start-0 m-3"
                                >${news.category}</span
                              >
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${news.title.replace('"', '')}</h5>
                                <small class=""></small>
                            </div>
                        </div>
                    </div>
                  `
                );
            });
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(
                `Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`
            );
        },
    });
});
