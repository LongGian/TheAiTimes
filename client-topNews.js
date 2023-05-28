/*
  Client che gestisce la pagina Top News, dove è possibile votare la "veridicità"
  delle notizie del giorno, e vedere quali sono le top notizie più "veritiere".
  Un utente (loggato) può votare solo le ultime notizie, deve attendere nuove
  notizie per votare di nuovo. 
*/

$(document).ready(() => {
  // Funzione per ottenere il valore di un dato cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Controlla tramite cookie "loggedIn" se l'utente è loggato
  const checkLoggedIn = () => {
    const loggedInCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find((cookie) => cookie[0] === "loggedIn");

    return loggedInCookie && loggedInCookie[1] === "true";
  };

  const loggedIn = checkLoggedIn();

  // Richiede al server le notizie del giorno da mostrare
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

      // Aggiunge le notizie del giorno da votare nella sezione #news-to-vote
      data.forEach((news) => {
        const titleTruncated = news.title;

        // Aggiunge titolo della notizia e il select per scegliere il voto
        // Ogni select ha lo stesso unique_id della notizia ("unique_id" è attributo nella tabella "news" del DB)
        newsToVote.append(`
          <div class="row list-group-item d-flex">
            <div class="col-11 text-start">${titleTruncated}</div>
            <div class="col-1">
              <select name="newsVote" class="" id="newsVote${news.unique_id}">
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
        `);
      });

      // Se l'utente è loggato il button gestisce il voto
      // Se non è loggato reindirizza a subscribe/login
      if (loggedIn) {
        $("#button-footer").append(`
          <button id="confirmVoteBtn" class="btn btn-primary">Confirm & Vote</button>
        `);
      } else {
        $("#button-footer").append(`
          <a href="subscribe.html" class="btn btn-primary">Confirm & Vote</a>
        `);
      }

      // Se viene premuto il button che gestisce il voto viene creato array dei voti
      $("#confirmVoteBtn").click(() => {
        const selectedOptions = $("select[name=newsVote]")
          .map(function () {
            return $(this).val();
          })
          .get();

        if (selectedOptions.includes("")) {
          const alertMessage = $("<div class='alert alert-warning my-1'>Please select a vote for each news.</div>");
          $("#voting-form").after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
          return;
        }

        // Controlla se l'utente ha già votato per le ultime notizie
        $.ajax({
          url: "/checkvote",
          type: "POST",
          data: JSON.stringify({ email: getCookie("email") }),
          contentType: "application/json",
          success: (response) => {
            if (response.hasVotedToday) {
              // Ha già votato, avvisa con alert
              const alertMessage = $("<div class='alert alert-warning my-1'>You have already voted for today's news. Please wait for new news to vote again.</div>");
              $("#voting-form").after(alertMessage);

              setTimeout(() => {
                alertMessage.remove();
              }, 3000);
            } else {
              // Non ha votato, crea array dei voti che oltre al valore contiene id della notizia ed email del votante.
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

              // Invia i voti al server che gestisce l'aggiornamento dello score
              $.ajax({
                url: "/submitvotes",
                type: "POST",
                data: JSON.stringify(votes),
                contentType: "application/json",
                success: (response) => {
                  // Conferma l'avvenuta votazione
                  const alertMessage = $("<div class='alert alert-success my-1'>Votes submitted successfully! Stay tuned for new news.</div>");
                  $("#voting-form").after(alertMessage);

                  setTimeout(() => {
                    alertMessage.remove();
                  }, 3000);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                  // Avvisa di un errore
                  console.error("Error submitting votes:", textStatus, errorThrown);
                  const alertMessage = $("<div class='alert alert-danger my-1'>An error occured, please retry later.</div>");
                  $("#voting-form").after(alertMessage);

                  setTimeout(() => {
                    alertMessage.remove();
                  }, 3000);
                },
              });
            }
          },
          error: (jqXHR, textStatus, errorThrown) => {
            // Avvisa di un errore
            const alertMessage = $("<div class='alert alert-danger my-1'>An error occured, please retry later.</div>");
            $("#voting-form").after(alertMessage);

            setTimeout(() => {
              alertMessage.remove();
            }, 3000);
          },
        });
      });
    },
    error: (jqXHR, textStatus, errorThrown) => {
      // Avvisa di un errore
      const alertMessage = $("<div class='alert alert-danger my-1'>An error occured, please retry later.</div>");
      $("#voting-form").after(alertMessage);

      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    },
  });

  // Richiede al server le top 5 notizie per score
  $.ajax({
    url: "/gettopnews",
    type: "GET",
    dataType: "json",
    success: (data) => {
      // Aggiunge alla card #top-news-card le 5 notizie in ordine di score
      const topNewsCard = $("#top-news-card");

      data.forEach((news) => {
        const titleTruncated = news.title;

        // Aggiunge titolo della notizia e un badge con il punteggio
        topNewsCard.append(`
          <div class="row list-group-item d-flex">
            <div class="col-11 text-start">${titleTruncated}</div>
            <div class="col-1"><span class="badge bg-primary">${news.score}</span></div>
          </div>
        `);
      });
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
      // Avvisa di un errore
      const alertMessage = $("<div class='alert alert-danger my-1'>An error occured, please retry later.</div>");
      $("#voting-form").after(alertMessage);

      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    },
  });
});
