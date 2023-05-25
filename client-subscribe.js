$(document).ready(() => {
  const loginForm = $("#login-form");
  const subscribeForm = $("#subscribe-form");

  let resEmail, resFirstName, resLastName;

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

          function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
          }

          alert(document.cookie + "\n" + getCookie("email"));

          // Crea il form per i dati dell'utente
          const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
          const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").val(response.email).prop("disabled", true).addClass("form-control mb-1");
          const firstName = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").val(response.firstName).prop("disabled", true).addClass("form-control mb-1");
          const lastName = $("<input>").attr("type", "text").attr("id", "last-name").attr("name", "last-name").val(response.lastName).prop("disabled", true).addClass("form-control mb-3");
          const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-4").click(logout);

          userForm.append(email, firstName, lastName, logoutButton);
          loginForm.replaceWith(userForm);

          const alertMessage = $('<div class="alert alert-success mt-1">Welcome back!</div>');
          userForm.after(alertMessage);

          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        } else {
          const alertMessage = $('<div class="alert alert-danger mt-1">Invalid login credentials</div>');
          loginForm.after(alertMessage);

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

    const formData = {
      email: $("#email-subscribe").val(),
      firstName: $("#first-name").val(),
      lastName: $("#last-name").val(),
      password: $("#password-subscribe").val(),
    };

    $.ajax({
      url: "/subscribe",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: (response) => {
        console.log("Dati inviati con successo:", response);

        subscribeForm[0].reset();

        const alertMessage = $('<div class="alert alert-success mt-1">Registrazione completata con successo!</div>');
        subscribeForm.after(alertMessage);

        setTimeout(() => {
          alertMessage.remove();
        }, 3000);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
      },
    });
  });

  function logout() {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload();
  }
  
  const loggedIn = document.cookie.includes("loggedIn=true");
  if (loggedIn) {
    const userForm = $("<form>").attr("id", "user-form").addClass("col-8 m-auto");
    const email = $("<input>").attr("type", "text").attr("id", "email").attr("name", "email").prop("disabled", true).addClass("form-control mb-1").val(resEmail);
    const firstName = $("<input>").attr("type", "text").attr("id", "first-name").attr("name", "first-name").prop("disabled", true).addClass("form-control mb-1").val(resFirstName);
    const lastName = $("<input>").attr("type", "text").attr("id", "last-name").attr("name", "last-name").prop("disabled", true).addClass("form-control mb-3").val(resLastName);
    const logoutButton = $("<button>").attr("type", "button").text("Logout").addClass("btn btn-primary w-100 mb-4").click(logout);

    userForm.append(email, firstName, lastName, logoutButton);
    loginForm.replaceWith(userForm);

    // Effettua una chiamata AJAX per ottenere i dati dell'utente
    $.ajax({
      url: "/getUserData",
      type: "GET",
      dataType: "json",
      success: (response) => {
        if (response.loggedIn) {
          email.val(response.email);
          firstName.val(response.firstName);
          lastName.val(response.lastName);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta GET:", textStatus, errorThrown);
      },
    });
  }
});
