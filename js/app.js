// app.js
// Dieses Skript fügt einen einfachen Klick-Effekt auf den Button hinzu.

const button = document.getElementById("magicButton");
const message = document.getElementById("message");

// Wir prüfen, ob die Elemente existieren, bevor wir mit ihnen arbeiten.
if (button && message) {
  button.addEventListener("click", () => {
    // Wenn der Button geklickt wird, ändern wir die Nachricht im Textfeld.
    message.textContent = "🎉 Du hast erfolgreich geklickt!";
    // Der Button bekommt eine kurze Animation.
    button.classList.add("clicked");

    // Nach 500 ms entfernen wir die Klasse wieder, damit der Effekt erneut auslösbar ist.
    setTimeout(() => {
      button.classList.remove("clicked");
      message.textContent = "Bereit für einen kleinen Effekt?";
    }, 1200);
  });
}
