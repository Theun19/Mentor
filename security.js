const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;
const defaultUsername = "mentor";
const defaultPassword = "Transdev2026!";
const previousDefaultUsername = "admin";
const previousDefaultPassword = "Mentor2026!";

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureDefaultLogin() {
  const savedHash = localStorage.getItem(passwordKey);
  const savedUsername = localStorage.getItem(usernameKey);

  if (savedHash) {
    const oldDefaultHash = await hashPassword(previousDefaultPassword);
    if (savedUsername === previousDefaultUsername && savedHash === oldDefaultHash) {
      localStorage.setItem(usernameKey, defaultUsername);
      localStorage.setItem(passwordKey, await hashPassword(defaultPassword));
    }
    return;
  }

  localStorage.setItem(usernameKey, defaultUsername);
  localStorage.setItem(passwordKey, await hashPassword(defaultPassword));
}

function bindPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      button.textContent = isHidden ? "Verberg" : "Toon";
      button.setAttribute("aria-label", isHidden ? "Wachtwoord verbergen" : "Wachtwoord tonen");
      input.focus();
    });
  });
}

function setMessage(text, type = "danger") {
  const message = document.getElementById("securityMessage");
  message.textContent = text;
  message.className = `small mt-3 mb-0 text-${type}`;
}

async function handleSecuritySubmit(event) {
  event.preventDefault();
  const savedUsername = localStorage.getItem(usernameKey) || defaultUsername;
  const savedHash = localStorage.getItem(passwordKey);
  const currentUsername = document.getElementById("currentUsername").value.trim().toLowerCase();
  const currentPassword = document.getElementById("currentPassword").value;
  const newUsername = document.getElementById("newUsername").value.trim().toLowerCase();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  setMessage("");

  if (currentUsername !== savedUsername || await hashPassword(currentPassword) !== savedHash) {
    setMessage("De huidige gebruikersnaam of het huidige wachtwoord is onjuist.");
    return;
  }

  if (!newUsername) {
    setMessage("Vul een nieuwe gebruikersnaam in.");
    return;
  }

  if (newPassword.length < 4) {
    setMessage("Kies een wachtwoord van minimaal 4 tekens.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("De nieuwe wachtwoorden zijn niet gelijk.");
    return;
  }

  localStorage.setItem(usernameKey, newUsername);
  localStorage.setItem(passwordKey, await hashPassword(newPassword));
  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("securityForm").reset();
  document.getElementById("currentUsername").value = newUsername;
  document.getElementById("newUsername").value = newUsername;
  setMessage("Gebruikersnaam en wachtwoord zijn opgeslagen.", "success");
}

async function initSecurityPage() {
  await ensureDefaultLogin();
  const savedUsername = localStorage.getItem(usernameKey) || defaultUsername;
  document.getElementById("currentUsername").value = savedUsername;
  document.getElementById("newUsername").value = savedUsername;
  bindPasswordToggles();
  document.getElementById("securityForm").addEventListener("submit", handleSecuritySubmit);
}

initSecurityPage();
