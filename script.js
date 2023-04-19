
let mydate = new Date();
let month = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"][mydate.getMonth()];

document.getElementById("day").innerHTML = mydate.getDate();
document.getElementById("month-year").innerHTML = month + ' ' + mydate.getFullYear();
