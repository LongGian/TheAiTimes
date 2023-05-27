// Widget per data e ora 

function getCurrentDateTime() {
  let currentDateTime = new Date();

  let futureYear = currentDateTime.getFullYear() + 50;

  currentDateTime.setFullYear(futureYear);

  let formattedDateTime = currentDateTime.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDateTime;
}

function updateDateTime() {
  let dateTimeElement = $("#currentDateTime");
  if (dateTimeElement.length > 0) {
    dateTimeElement.html(getCurrentDateTime());
  }
}

$(document).ready(() => {
  setInterval(updateDateTime, 1000);
});
