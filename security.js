const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;
const defaultUsername = "admin";
const defaultPassword = "Mentor2026!";

function setMessage(text, type) {
  const message = document.getElementById("securityMessage");
  message.textContent = text;
  message.className = `small mb-0 text-${type}`;
}

function setLoginError(text) {
  document.getElementById("securityLoginError").textContent = text;
}

function bindPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      button.textContent = isHidden ? "🙈" : "👁";
      button.setAttribute("aria-label", isHidden ? "Wachtwoord verbergen" : "Wachtwoord tonen");
      input.focus();
    });
  });
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureDefaultLogin() {
  if (localStorage.getItem(passwordKey)) return;

  localStorage.setItem(usernameKey, defaultUsername);
  localStorage.setItem(passwordKey, await hashPassword(defaultPassword));
}

function openSecurityPage() {
  document.body.classList.remove("auth-locked");
  updateHint();
}

async function initSecurityLogin() {
  await ensureDefaultLogin();

  const isUnlocked = sessionStorage.getItem(authSessionKey) === "true";

  if (isUnlocked) {
    openSecurityPage();
    return;
  }

  document.body.classList.add("auth-locked");
  document.getElementById("loginUsername").value = localStorage.getItem(usernameKey) || defaultUsername;
}

async function unlockSecurity(event) {
  event.preventDefault();
  const savedHash = localStorage.getItem(passwordKey);
  const savedUsername = localStorage.getItem(usernameKey) || defaultUsername;
  const username = document.getElementById("loginUsername").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  setLoginError("");

  if (!savedHash || username !== savedUsername || await hashPassword(password) !== savedHash) {
    setLoginError("Gebruikersnaam of wachtwoord is onjuist.");
    return;
  }

  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("securityLoginForm").reset();
  openSecurityPage();
}

async function savePassword(event) {
  event.preventDefault();
  const savedHash = localStorage.getItem(passwordKey);
  const username = document.getElementById("securityUsername").value.trim().toLowerCase();
  const newPassword = document.getElementById("newPassword").value;
  const repeatPassword = document.getElementById("repeatPassword").value;
  const wantsPasswordChange = newPassword || repeatPassword;

  if (!username) {
    setMessage("Vul een gebruikersnaam in.", "danger");
    return;
  }

  if (!savedHash && !wantsPasswordChange) {
    setMessage("Stel eerst een wachtwoord in.", "danger");
    return;
  }

  if (wantsPasswordChange && newPassword.length < 8) {
    setMessage("Gebruik minimaal 8 tekens voor het nieuwe wachtwoord.", "danger");
    return;
  }

  if (wantsPasswordChange && newPassword !== repeatPassword) {
    setMessage("De nieuwe wachtwoorden zijn niet gelijk.", "danger");
    return;
  }

  localStorage.setItem(usernameKey, username);
  if (wantsPasswordChange) {
    localStorage.setItem(passwordKey, await hashPassword(newPassword));
  }
  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("securityForm").reset();
  updateHint();
  setMessage(wantsPasswordChange ? "Gebruikersnaam en wachtwoord opgeslagen." : "Gebruikersnaam opgeslagen.", "success");
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
  document.getElementById("securityUsername").value = localStorage.getItem(usernameKey) || defaultUsername;
  document.getElementById("newPasswordHint").textContent = savedHash
    ? "Laat leeg als je alleen de gebruikersnaam wilt wijzigen."
    : "Er is nog geen wachtwoord ingesteld. Kies minimaal 8 tekens.";
}

document.getElementById("securityForm").addEventListener("submit", savePassword);
document.getElementById("removePasswordBtn").addEventListener("click", removePassword);
bindPasswordToggles();
openSecurityPage();
