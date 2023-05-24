$(document).ready(() => {
  // Function to handle the click event on the news card
  const handleCardClick = (index) => {
    if (checkLoggedIn()) {
      // User is logged in, open the modal
      $(`#notiziaModale${index}`).modal("show");
    } else {
      // User is not logged in, redirect to subscribe.html
      window.location.href = "./subscribe.html";
    }
  };

  // Function to check if the user is logged in
  const checkLoggedIn = () => {
    const loggedInCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find((cookie) => cookie[0] === "loggedIn");

    return loggedInCookie && loggedInCookie[1] === "true";
  };

  // Function to display the main news
  const displayMainNews = (data) => {
    const mainNews = data[0];

    $("#main-news").append(`
      <div class="col-lg-6 d-lg-block">
        <div class="card mb-4" style="max-height: 400px; height: 400px">
          <div class="card-body" style="overflow-y: scroll;">
            <h2 class="card-title mt-3 mb-3 title-main fw-bold">${mainNews.title}</h2>
            <p class="card-text content-main" id="mc"></p>
          </div>
        </div>
      </div>

      <div class="col-lg-6 img-container d-none d-lg-block">
        <img src="${mainNews.imageurl}" class="card-img img0" id="img-main" alt="" />
      </div>
    `);

    const paragraphs = mainNews.content.split("\n\n");

    paragraphs.forEach((par) => {
      const p = $("<p>").text(par.trim());
      $("#mc").append(p);
    });
  };

  // Function to display the latest news
  const displayLatestNews = (data) => {
    const latestNews = $("#latest-news");

    for (let i = 0; i < data.length; i++) {
      const news = data[i];
      const titleTruncated = news.title.length > 45 ? news.title.substring(0, 45) + "..." : news.title;

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

      // Add click event handler to the news card
      $(`#notiziaCard${i}`).on("click", () => handleCardClick(i));
    }
  };

  // Function to handle the AJAX request
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
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
      },
    });
  };

  // Call the fetchData function to retrieve and display the news data
  fetchData();
});
