$(document).ready(() => {
  $("#subscribe-form").submit((event) => {
    alert("\n\nWEEEEEEEE: " + $("#email").val());
    event.preventDefault(); // Evita il comportamento di default del form

    const formData = {
      email: $("#email").val(),
      firstName: $("#first-name").val(),
      lastName: $("#last-name").val(),
      password: $("#password").val(),
    };

    

    $.ajax({
      url: "/subscribe",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: (response) => {
        console.log("Dati inviati con successo:", response);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Errore durante la richiesta POST:", textStatus, errorThrown);
      },
    });
  });
});
