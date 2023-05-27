function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let resEmail, resFirstName, resLastName;

$(document).ready(() => {
  const loginForm = $("#login-form");
  const subscribeForm = $("#subscribe-form");

  loginForm.submit((event) => {
    event.preventDefault();

    const formData = {
      email: $("#email-login").val(),
      password: $("#password-login").val(),
    };

    $.ajax({
      url: "/login",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: (response) => {
        if (response.loggedIn) {
          document.cookie = "loggedIn=true; path=/";
          document.cookie = `email=${response.email}; path=/`;
          document.cookie = `firstName=${response.firstName}; path=/`;
          document.cookie = `lastName=${response.lastName}; path=/`;

          resEmail = getCookie("email");
          resFirstName = getCookie("firstName");
          resLastName = getCookie("lastName");

          const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
          const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").val(response.email).prop("disabled", true).addClass("form-control mb-1");
          const firstName = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").val(response.firstName).prop("disabled", true).addClass("form-control mb-1");
          const lastName = $("<input>").attr("type", "text").attr("id", "last-name").attr("name", "last-name").val(response.lastName).prop("disabled", true).addClass("form-control mb-3");
          const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-1").click(logout);
          const unsubscribeButton = $("<button>").attr("type", "button").text("Unsubscribe").addClass("btn btn-outline-danger w-100").click(unsubscribe);

          userForm.append(email, firstName, lastName, logoutButton, unsubscribeButton);
          loginForm.replaceWith(userForm);

          const alertMessage = $('<div class="alert alert-success mt-1">Welcome back!</div>');
          unsubscribeButton.after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        } else {
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

  subscribeForm.submit((event) => {
    event.preventDefault();

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

      $.ajax({
        url: "/subscribe",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: (response) => {
          console.log("Dati inviati con successo:", response);

          subscribeForm[0].reset();

          const alertMessage = $('<div class="alert alert-success mt-1">You are now subscribed!</div>');
          $("#subscribe-button").after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        },
        error: (jqXHR, textStatus, errorThrown) => {
          const alertMessage = $('<div class="alert alert-danger mt-1">Error during subscription, please retry later</div>');
          $("#subscribe-button").after(alertMessage);
          console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
        },
      });
    } else {
      const alertMessage = $('<div class="alert alert-danger mt-1">Passwords do not match</div>');
      $("#subscribe-button").after(alertMessage);

      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    }
  });

  function logout() {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload();
  }

  function unsubscribe() {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    $.ajax({
      url: "/unsubscribe", // L'URL del server per gestire l'eliminazione dell'utente
      type: "POST",
      data: JSON.stringify({ email: resEmail }),
      contentType: "application/json",
      success: function (response) {
        logout();
        alert("User unsubscribed successfully");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Gestisci eventuali errori durante la richiesta AJAX
        console.error("Error:", textStatus, errorThrown);
      },
    });
  }

  const loggedIn = getCookie("loggedIn");

  if (loggedIn) {
    resEmail = getCookie("email");
    resFirstName = getCookie("firstName");
    resLastName = getCookie("lastName");

    const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
    const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").prop("disabled", true).addClass("form-control mb-1").val(resEmail);
    const firstName = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").prop("disabled", true).addClass("form-control mb-1").val(resFirstName);
    const lastName = $("<input>").attr("type", "text").attr("id", "last-name").attr("name", "last-name").prop("disabled", true).addClass("form-control mb-3").val(resLastName);
    const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-1").click(logout);
    const unsubscribeButton = $("<button>").attr("type", "button").text("Unsubscribe").addClass("btn btn-outline-danger w-100 mb-4").click(unsubscribe);

    userForm.append(email, firstName, lastName, logoutButton, unsubscribeButton);
    loginForm.replaceWith(userForm);
  }
});
