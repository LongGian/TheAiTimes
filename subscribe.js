document.getElementById("subscribe-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  let emailInput = document.getElementById("email");
  let passwordInput = document.getElementById("password");
  let confirmPasswordInput = document.getElementById("confirm-password");

  if (!isValidEmail(emailInput.value)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    alert("Passwords do not match.");
    return;
  }

  this.submit();
});

function isValidEmail(email) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
