$(document).ready(() => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const checkLoggedIn = () => {
    const loggedInCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find((cookie) => cookie[0] === "loggedIn");

    return loggedInCookie && loggedInCookie[1] === "true";
  };

  const loggedIn = checkLoggedIn();

  //
  // TODAY'S NEWS TO VOTE
  //
  $.ajax({
    url: "/topnews",
    type: "GET",
    dataType: "json",
    success: (data) => {
      const content = data[0].content;
      const paragraphs = content.split("\n");

      paragraphs.forEach((par) => {
        const p = $("<p>").text(par.trim());
        $(".content-main-modal").append(p);
      });

      const newsToVote = $("#news-to-vote");

      data.forEach((news) => {
        const titleTruncated = news.title.length > 45 ? news.title.substring(0, 45) + "..." : news.title;

        newsToVote.append(`
          <div class="list-group-item d-flex justify-content-between align-items-center">
            ${titleTruncated}
            <select name="newsVote" id="newsVote${news.unique_id}">
              <option value=""></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        `);
      });

      if (loggedIn) {
        $("#button-footer").append(`
          <button id="confirmVoteBtn" class="btn btn-primary">Confirm & Vote</button>
        `);
      } else {
        $("#button-footer").append(`
          <a href="subscribe.html" class="btn btn-primary">Confirm & Vote</a>
        `);
      }

      $("#confirmVoteBtn").click(() => {
        const selectedOptions = $("select[name=newsVote]")
          .map(function () {
            return $(this).val();
          })
          .get();

        if (selectedOptions.includes("")) {
          alert("Please select a vote for each news.");
          return;
        }

        // Check if user has already voted for today's news
        const currentDate = new Date();
        const today = currentDate.toISOString().split("T")[0]; // Get today's date in "yyyy-mm-dd" format

        $.ajax({
          url: "/checkvote",
          type: "POST",
          data: JSON.stringify({ email: getCookie("email") }),
          contentType: "application/json",
          success: (response) => {
            if (response.hasVotedToday) {
              alert("You have already voted for today's news. Please wait for new news to vote again.");
            } else {
              // User can submit the votes
              const votes = [];

              $("select[name=newsVote]").each(function () {
                const newsId = $(this).attr("id").replace("newsVote", "");
                const voteValue = $(this).val();

                if (voteValue) {
                  const vote = {
                    email: getCookie("email"),
                    newsId: parseInt(newsId),
                    score: parseInt(voteValue),
                  };
                  votes.push(vote);
                }
              });

              $.ajax({
                url: "/submitvotes",
                type: "POST",
                data: JSON.stringify(votes),
                contentType: "application/json",
                success: (response) => {
                  console.log("Votes submitted successfully:", response);
                  alert("Votes submitted successfully!");
                },
                error: (jqXHR, textStatus, errorThrown) => {
                  console.error("Error submitting votes:", textStatus, errorThrown);
                  alert("Error submitting votes. Please try again later.");
                },
              });
            }
          },
          error: (jqXHR, textStatus, errorThrown) => {
            console.error("Error checking vote status:", textStatus, errorThrown);
            alert("Error checking vote status. Please try again later.");
          },
        });
      });
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error(`Error requesting top news: ${textStatus} - ${errorThrown}`);
    },
  });

  //
  // TOP 5 RANKING
  //
  $.ajax({
    url: "/gettopnews",
    type: "GET",
    dataType: "json",
    success: (data) => {
      const topNewsCard = $("#top-news-card");

      data.forEach((news) => {
        const titleTruncated = news.title;

        topNewsCard.append(`
          <div class="list-group-item d-flex justify-content-between align-items-center">
            ${titleTruncated}
            <span class="badge bg-primary">${news.score}</span>
          </div>
        `);
      });
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
    },
  });

  //
  // VOTING FORM HANDLING
  //
  $("#voting-form").submit((event) => {
    event.preventDefault();

    const votes = [];

    data.forEach((news, i) => {
      const voteValue = $(`#newsVote${i}`).val();
      if (voteValue) {
        const vote = {
          title: news.title,
          score: parseInt(voteValue),
        };
        votes.push(vote);
      }
    });

    $.ajax({
      url: "/submitvotes",
      type: "POST",
      data: JSON.stringify(votes),
      contentType: "application/json",
      success: (response) => {
        console.log("Voti inviati con successo:", response);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
      },
    });
  });
});
