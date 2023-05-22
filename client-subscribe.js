$(document).ready(() => {
  $("#subscribe-form").submit((event) => {
    event.preventDefault();

    const formData = {
      email: $("#email0").val(),
      firstName: $("#first-name").val(),
      lastName: $("#last-name").val(),
      password: $("#password0").val(),
    };

    $.ajax({
      url: "/subscribe",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: (response) => {
        console.log("Dati inviati con successo:", response);
      },
      error: ( jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
      },
    });
  });
});
