const themeToggle = document.getElementById("themeToggle");
const button = document.getElementById("magicButton");
const message = document.getElementById("message");
const dateButton = document.getElementById("dateButton");
const dateMessage = document.getElementById("dateMessage");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"
    );
  }
}

if (themeToggle) {
  const initial = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(initial);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

if (button && message) {
  button.addEventListener("click", () => {
    message.textContent = "🎉 Du hast erfolgreich geklickt!";
    button.classList.add("clicked");

    setTimeout(() => {
      button.classList.remove("clicked");
      message.textContent = "Bereit für einen kleinen Effekt?";
    }, 1200);
  });
}

if (dateButton && dateMessage) {
  dateButton.addEventListener("click", () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    dateMessage.textContent = `Aktuell: ${formattedDate}, ${formattedTime}`;
  });
}
