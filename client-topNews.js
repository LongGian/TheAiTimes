$(document).ready(() => {
  $.ajax({
    url: "/topnews",
    type: "GET",
    dataType: "json",
    success: (data) => {
      console.log(data);
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
        <div class="list-group-item d-flex justify-content-between align-items-center">
          ${titleTruncated}
          <input type="number" name=" id="" min="1" max="5" class="col-1">
        </div>
        `);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(
        `Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`
      );
    },
  });
});
