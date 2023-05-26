$(document).ready(function () {
  $("#startScriptBtn").click(function () {
    let apiKey = $("#apiKey").val();

    if (apiKey.length > 0) {
      // Resettare la console
      $("#consoleOutput").val("");

      $.ajax({
        url: "/newsGenerator",
        type: "POST",
        data: JSON.stringify({ apiKey: apiKey }),
        contentType: "application/json",
        timeout: 0,
        success: function (response) {
          let consoleOutput = $("#consoleOutput");
          let currentText = consoleOutput.val();
          consoleOutput.val(currentText + response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Error:", textStatus, errorThrown);
        },
        xhrFields: {
          onprogress: function (e) {
            if (e.currentTarget.responseText !== "") {
              let consoleOutput = $("#consoleOutput");
              let currentText = consoleOutput.val();
              consoleOutput.val(e.currentTarget.responseText);
            }
          },
        },
      });
    } else {
      const alertMessage = $('<div class="alert alert-danger mt-1">Insert a valid API key</div>');
      $("#inputKey").after(alertMessage);

      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    }
  });
});
