const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;

function setMessage(text, type) {
  const message = document.getElementById("securityMessage");
  message.textContent = text;
  message.className = `small mb-0 text-${type}`;
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function savePassword(event) {
  event.preventDefault();
  const savedHash = localStorage.getItem(passwordKey);
  const currentPassword = document.getElementById("currentPassword").value;
  const username = document.getElementById("securityUsername").value.trim().toLowerCase();
  const newPassword = document.getElementById("newPassword").value;
  const repeatPassword = document.getElementById("repeatPassword").value;

  if (!username) {
    setMessage("Vul een gebruikersnaam in.", "danger");
    return;
  }

  if (savedHash && await hashPassword(currentPassword) !== savedHash) {
    setMessage("Het huidige wachtwoord klopt niet.", "danger");
    return;
  }

  if (newPassword.length < 8) {
    setMessage("Gebruik minimaal 8 tekens voor het nieuwe wachtwoord.", "danger");
    return;
  }

  if (newPassword !== repeatPassword) {
    setMessage("De nieuwe wachtwoorden zijn niet gelijk.", "danger");
    return;
  }

  localStorage.setItem(usernameKey, username);
  localStorage.setItem(passwordKey, await hashPassword(newPassword));
  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("securityForm").reset();
  updateHint();
  setMessage("Wachtwoord opgeslagen.", "success");
}

function removePassword() {
  localStorage.removeItem(passwordKey);
  localStorage.removeItem(usernameKey);
  sessionStorage.removeItem(authSessionKey);
  document.getElementById("securityForm").reset();
  updateHint();
  setMessage("Wachtwoord verwijderd.", "success");
}

function updateHint() {
  const savedHash = localStorage.getItem(passwordKey);
  document.getElementById("securityUsername").value = localStorage.getItem(usernameKey) || "admin";
  document.getElementById("currentPasswordHint").textContent = savedHash
    ? "Vul je huidige wachtwoord in om het te wijzigen."
    : "Laat leeg als er nog geen wachtwoord is ingesteld.";
}

document.getElementById("securityForm").addEventListener("submit", savePassword);
document.getElementById("removePasswordBtn").addEventListener("click", removePassword);
updateHint();
