$(document).ready(() => {
  console.log("READY\n");
  $.ajax({
    url: "/index",
    type: "GET",
    dataType: "json",
    success: (data) => {
      console.log("BUONO\n");
      $(".img0").attr("src", data[0].imageurl);
      $(".title0").text(data[0].title);
      $(".content0").text(data[0].content);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`Errore durante la richiesta GET: ${textStatus} - ${errorThrown}`);
    },
  });
});
