$(document).ready(() => {
  let loggedIn = false;
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
        const titleTruncated = data[i].title.length > 45 ? data[i].title.substring(0, 45) + "..." : data[i].title;

        latestNews.append(`
        <div class="list-group-item d-flex justify-content-between align-items-center">
          ${titleTruncated}
          <select name="newsVote" id="newsVote${i}">
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        `);
      }
      if (loggedIn) {
        $("#button-footer").append(`
        <a href="subscribe.html" class="btn btn-primary">Confirm & Vote</a>
      `);
      }
      else {
        $("#button-footer").append(`
        <a href="subscribe.html" class="btn btn-primary">Confirm & Vote</a>
      `);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
    },
  });
});
