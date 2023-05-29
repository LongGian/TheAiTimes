/*
  Client che gestisce l'iscrizione di un nuovo utente, il login
  di un utente già iscritto, il logout e l'eliminazione di un utente.
*/

// Funzione per ottenere il valore di un dato cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Email, nome e cognome di un utente
let resEmail, resFirstName, resLastName;

$(document).ready(() => {
  const loginForm = $("#login-form");
  const subscribeForm = $("#subscribe-form");

  // Gestisce il submit del form di Login
  loginForm.submit((event) => {
    // Evita il comportamento di default del form
    event.preventDefault();

    // Email e password inseriti
    const formData = {
      email: $("#email-login").val(),
      password: $("#password-login").val(),
    };

    // Invia email e password al server per l'autenticazione
    $.ajax({
      url: "/login",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: (response) => {
        // Responso positivo
        if (response.loggedIn) {
          // Salva in un cookie lo stato di login
          // Salva nei cookie i dati dell'utente
          document.cookie = "loggedIn=true; path=/";
          document.cookie = `email=${response.email}; path=/`;
          document.cookie = `firstName=${response.firstName}; path=/`;
          document.cookie = `lastName=${response.lastName}; path=/`;

          // Salva i dati utente per mostrali durante la sessione
          resEmail = response.email;
          resFirstName = response.firstName;
          resLastName = response.lastName;

          // Crea un form non modificabile che mostra i dati dell'utente loggato
          const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
          const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").prop("disabled", true).addClass("form-control mb-1").val(resEmail);
          const name = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").prop("disabled", true).addClass("form-control mb-1").val(resFirstName + " " + resLastName);
          const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-1").click(logout);
          const unsubscribeButton = $("<button>").attr("type", "button").text("Unsubscribe").addClass("btn btn-outline-danger w-100 mb-4").click(unsubscribe);
          userForm.append(email, name, logoutButton, unsubscribeButton);

          // Sostituisce il form di login con il nuovo form
          loginForm.replaceWith(userForm);
          $("#subscribe-section").hide();

          const alertMessage = $('<div class="alert alert-success mt-1">Welcome back!</div>');
          unsubscribeButton.after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        } else {
          // Avvisa con un alert che le credenziali non sono corrette
          const alertMessage = $('<div class="alert alert-danger mt-1">Invalid login credentials</div>');
          $("#login-button").after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
        console.log("Risposta di errore:", jqXHR.responseText);
      },
    });
  });

  // Gestisce il submit del form di Subscription
  subscribeForm.submit((event) => {
    event.preventDefault();

    // Validazione di email e password
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailValidation = emailRegex.test($("#email-subscribe").val());
    let passwordValidation = $("#password-subscribe").val() == $("#confirm-password").val();

    if (emailValidation && passwordValidation) {
      const formData = {
        email: $("#email-subscribe").val(),
        firstName: $("#first-name").val(),
        lastName: $("#last-name").val(),
        password: $("#password-subscribe").val(),
        newsletter: $("#newsletter-checkbox").prop("checked"),
      };

      // Invia i dati del form al server
      $.ajax({
        url: "/subscribe",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: (response) => {
          // Responso positivo, reset del form e avvisa l'utente della completata registrazione
          subscribeForm[0].reset();
          const alertMessage = $('<div class="alert alert-success mt-1">You are now subscribed!</div>');
          $("#subscribe-button").after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        },
        error: (jqXHR, textStatus, errorThrown) => {
          // Se l'email è già in uso avvisa l'utente, oppure mostra un generico errore
          if (jqXHR.status === 409) {
            const alertMessage = $('<div class="alert alert-danger mt-1">Email already in use</div>');
            $("#subscribe-button").after(alertMessage);
            setTimeout(() => {
              alertMessage.remove();
            }, 3000);
          } else {
            const alertMessage = $('<div class="alert alert-danger mt-1">Error during subscription, please retry later.</div>');
            $("#subscribe-button").after(alertMessage);
            setTimeout(() => {
              alertMessage.remove();
            }, 3000);
          }
          console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
        },
      });
    } else {
      // L'email non è in formato valido oppure le password non corrispondono, avvisa l'utente
      const alertMessage = $('<div class="alert alert-danger mt-1">Email is not valid or passwords do not match.</div>');
      $("#subscribe-button").after(alertMessage);

      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    }
  });

  // Gestisce il logout, fa scadere il cookie e ricarica la pagina
  function logout() {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload();
  }

  // Gestisce l'eliminazione di un utente, facendo scadere il cookie e chiedendo al server l'eliminazione dal DB
  function unsubscribe() {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    $.ajax({
      url: "/unsubscribe",
      type: "POST",
      data: JSON.stringify({ email: resEmail }),
      contentType: "application/json",
      success: function (response) {
        // L'utente è stato eliminato
        logout();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        const alertMessage = $('<div class="alert alert-danger mt-1">An error occured, please retry later.</div>');
        $("#subscribe-button").after(alertMessage);

        setTimeout(() => {
          alertMessage.remove();
        }, 3000);
      },
    });
  }

  // Controlla se un utente è loggato tramite il cookie
  const loggedIn = getCookie("loggedIn");

  // Se l'utente è loggato mostra il form come sopra
  // Permette di gestire il passaggio ad un'altra pagina e il ritorno su questa senza perdere il form dell'utente loggato.
  // Abbiamo preferito la ridondanza di codice alla memorizzazione di userForm.
  if (loggedIn) {
    resEmail = getCookie("email");
    resFirstName = getCookie("firstName");
    resLastName = getCookie("lastName");

    const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
    const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").prop("disabled", true).addClass("form-control mb-1").val(resEmail);
    const name = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").prop("disabled", true).addClass("form-control mb-1").val(resFirstName + " " + resLastName);
    const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-1").click(logout);
    const unsubscribeButton = $("<button>").attr("type", "button").text("Unsubscribe").addClass("btn btn-outline-danger w-100 mb-4").click(unsubscribe);

    userForm.append(email, name, logoutButton, unsubscribeButton);
    loginForm.replaceWith(userForm);
    $("#subscribe-section").hide();
  }
});
