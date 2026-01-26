const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // bloqueia reload da página

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      // Login inválido
      errorMessage.style.display = "block";
      return;
    }

    const data = await response.json();

    // Guardar token
    localStorage.setItem("token", data.token);

    // Redirecionar para homepage
    window.location.href = "index.html";

  } catch (error) {
    console.error("Erreur login:", error);
    errorMessage.style.display = "block";
  }
});
