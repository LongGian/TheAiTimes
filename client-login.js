function loginFunc() {
  const formData = {
    email: $("#email").val(),
    password: $("#password").val(),
  };

  console.log("CLIENT:", formData);

  /*$.ajax({
    url: "/amogus",
    type: "POST",
    data: JSON.stringify(formData),
    contentType: "application/json",
    success: (response) => {
      if (response.loggedIn) {
        console.log("Loggato");
      } else {
        console.log("Credenziali di accesso non valide");
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
      console.log("Risposta di errore:", jqXHR.responseText);    },
  });*/

  $.ajax({
    url: "/amogus",
    type: "GET",
    success: (response) => {
      if (response.loggedIn) {
        console.log("Loggato");
      } else {
        console.log("Credenziali di accesso non valide");
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Errore durante la richiesta GET:", textStatus, errorThrown);
      console.log("Risposta di errore:", jqXHR.responseText);
    },
  });
}
