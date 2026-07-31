const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;
const loginVersionKey = `${storagePrefix}:login-version`;
const driverProfilesKey = `${storagePrefix}:driver-profiles`;
const activeDriverKey = `${storagePrefix}:active-driver-id`;
const driverDataPrefix = `${storagePrefix}:driver:`;
const defaultUsername = "mentor";
const defaultPassword = "Transdev2026!";
const loginVersion = "2";

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  if (!crypto?.subtle) {
    return `plain-fallback:${password}`;
  }
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureDefaultLogin() {
  if (localStorage.getItem(loginVersionKey) === loginVersion && localStorage.getItem(passwordKey)) {
    return;
  }

  localStorage.setItem(usernameKey, defaultUsername);
  localStorage.setItem(passwordKey, await hashPassword(defaultPassword));
  localStorage.setItem(loginVersionKey, loginVersion);
}

function openDriverPage() {
  document.body.classList.remove("auth-locked");
}

function setDriverLoginError(text) {
  const error = document.getElementById("driverLoginError");
  if (error) error.textContent = text;
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

async function initDriverLogin() {
  await ensureDefaultLogin();

  if (sessionStorage.getItem(authSessionKey) === "true") {
    openDriverPage();
    return;
  }

  const usernameInput = document.getElementById("driverLoginUsername");
  if (usernameInput) usernameInput.value = localStorage.getItem(usernameKey) || defaultUsername;
  document.body.classList.add("auth-locked");
}

async function unlockDriverPage(event) {
  event.preventDefault();
  const savedUsername = localStorage.getItem(usernameKey) || defaultUsername;
  const savedHash = localStorage.getItem(passwordKey);
  const username = document.getElementById("driverLoginUsername").value.trim().toLowerCase();
  const password = document.getElementById("driverLoginPassword").value;
  setDriverLoginError("");

  if (username !== savedUsername || await hashPassword(password) !== savedHash) {
    setDriverLoginError("Gebruikersnaam of wachtwoord is onjuist.");
    return;
  }

  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("driverLoginForm").reset();
  openDriverPage();
}

function baseKey(name) {
  return `${storagePrefix}:${name}`;
}

function driverKey(profileId, name) {
  return `${driverDataPrefix}${profileId}:${name}`;
}

function key(name) {
  return driverKey(getActiveDriverId(), name);
}

function getSaved(name) {
  return localStorage.getItem(key(name)) || "";
}

function setSaved(name, value) {
  localStorage.setItem(key(name), value);
}

function getDriverProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(driverProfilesKey)) || [];
    return Array.isArray(profiles) ? profiles : [];
  } catch (error) {
    return [];
  }
}

function setDriverProfiles(profiles) {
  localStorage.setItem(driverProfilesKey, JSON.stringify(profiles));
}

function cleanDriverName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function makeDriverId() {
  return `driver-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createDriverProfile(name) {
  const profile = {
    id: makeDriverId(),
    name: cleanDriverName(name) || "Nieuwe chauffeur",
    updatedAt: Date.now(),
  };
  const profiles = getDriverProfiles();
  profiles.push(profile);
  setDriverProfiles(profiles);
  localStorage.setItem(activeDriverKey, profile.id);
  return profile;
}

function getActiveDriverId() {
  let profiles = getDriverProfiles();
  let activeId = localStorage.getItem(activeDriverKey);

  if (!profiles.length) {
    ensureDriverProfiles();
    profiles = getDriverProfiles();
    activeId = localStorage.getItem(activeDriverKey);
  }

  if (!profiles.some((profile) => profile.id === activeId)) {
    activeId = profiles[0]?.id || createDriverProfile("Nieuwe chauffeur").id;
    localStorage.setItem(activeDriverKey, activeId);
  }

  return activeId;
}

function getActiveDriverProfile() {
  const activeId = getActiveDriverId();
  return getDriverProfiles().find((profile) => profile.id === activeId);
}

function updateActiveDriverName(name) {
  const cleanedName = cleanDriverName(name);
  if (!cleanedName) return;

  const activeId = getActiveDriverId();
  const profiles = getDriverProfiles().map((profile) => (
    profile.id === activeId
      ? { ...profile, name: cleanedName, updatedAt: Date.now() }
      : profile
  ));
  setDriverProfiles(profiles);
  renderDriverProfiles();
}

function ensureDriverProfiles() {
  if (getDriverProfiles().length) return;

  const legacyName = localStorage.getItem(baseKey("driverName")) || "Nieuwe chauffeur";
  const profile = createDriverProfile(legacyName);
  const reservedKeys = new Set([passwordKey, usernameKey, authSessionKey, loginVersionKey, driverProfilesKey, activeDriverKey]);

  Object.keys(localStorage)
    .filter((name) => name.startsWith(`${storagePrefix}:`) && !name.startsWith(driverDataPrefix) && !reservedKeys.has(name))
    .forEach((name) => {
      const localName = name.slice(storagePrefix.length + 1);
      localStorage.setItem(driverKey(profile.id, localName), localStorage.getItem(name));
      localStorage.removeItem(name);
    });

  if (!localStorage.getItem(driverKey(profile.id, "driverName"))) {
    localStorage.setItem(driverKey(profile.id, "driverName"), profile.name);
  }
}

function renderDriverProfiles() {
  const select = document.getElementById("driverProfileSelect");
  if (!select) return;

  const activeId = getActiveDriverId();
  select.innerHTML = "";
  getDriverProfiles().forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    option.selected = profile.id === activeId;
    select.appendChild(option);
  });
}

function switchDriverProfile(profileId) {
  if (!getDriverProfiles().some((profile) => profile.id === profileId)) return;
  localStorage.setItem(activeDriverKey, profileId);
  restoreFields();
  restoreSignatures();
  renderDriverProfiles();
}

function restoreFields() {
  document.querySelectorAll(".driver-save-field").forEach((input) => {
    if (input.type === "checkbox") {
      input.checked = getSaved(input.id) === "true";
    } else {
      input.value = getSaved(input.id);
    }
    if (!input.dataset.bound) {
      input.addEventListener("input", () => {
        setSaved(input.id, input.type === "checkbox" ? input.checked : input.value);
        if (input.id === "driverName") updateActiveDriverName(input.value);
      });
      if (input.type === "checkbox") {
        input.addEventListener("change", () => setSaved(input.id, input.checked));
      }
      input.dataset.bound = "true";
    }
  });
}

function setupSignaturePads() {
  document.querySelectorAll(".signature-canvas").forEach((canvas) => {
    const context = canvas.getContext("2d");
    let drawing = false;
    resizeSignatureCanvas(canvas);

    canvas.addEventListener("pointerdown", (event) => {
      if (!canvas.closest(".signature-box")?.classList.contains("signature-expanded")) {
        expandSignatureBox(canvas);
        return;
      }

      drawing = true;
      canvas.setPointerCapture(event.pointerId);
      const point = getCanvasPoint(canvas, event);
      context.beginPath();
      context.moveTo(point.x, point.y);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const point = getCanvasPoint(canvas, event);
      context.lineTo(point.x, point.y);
      context.strokeStyle = "#18241c";
      context.lineWidth = 2.5;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
    });

    canvas.addEventListener("pointerup", () => {
      if (!drawing) return;
      drawing = false;
      saveSignature(canvas);
    });

    canvas.addEventListener("pointercancel", () => {
      drawing = false;
    });
  });

  document.querySelectorAll(".signature-clear").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      clearSignature(document.getElementById(button.dataset.target));
    });
  });

  document.querySelectorAll(".signature-close").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeSignatureBox(button.closest(".signature-box"));
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".signature-canvas").forEach((canvas) => {
      const savedSignature = getSaved(canvas.id);
      resizeSignatureCanvas(canvas);
      if (savedSignature) drawSignatureImage(canvas, savedSignature);
    });
  });
}

function expandSignatureBox(canvas) {
  const box = canvas.closest(".signature-box");
  if (!box) return;

  const savedSignature = getSaved(canvas.id);
  document.querySelectorAll(".signature-box.signature-expanded").forEach((openBox) => {
    if (openBox !== box) closeSignatureBox(openBox);
  });
  box.classList.add("signature-expanded");
  document.body.classList.add("signature-editing");
  resizeSignatureCanvas(canvas);
  if (savedSignature) drawSignatureImage(canvas, savedSignature);
}

function closeSignatureBox(box) {
  if (!box) return;

  const canvas = box.querySelector(".signature-canvas");
  const savedSignature = canvas ? getSaved(canvas.id) : "";
  box.classList.remove("signature-expanded");
  if (!document.querySelector(".signature-box.signature-expanded")) {
    document.body.classList.remove("signature-editing");
  }
  if (!canvas) return;

  resizeSignatureCanvas(canvas);
  if (savedSignature) drawSignatureImage(canvas, savedSignature);
}

function resizeSignatureCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, rect.width, rect.height);
}

function getCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function saveSignature(canvas) {
  setSaved(canvas.id, canvas.toDataURL("image/png"));
}

function clearSignature(canvas, save = true) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, rect.width, rect.height);
  localStorage.removeItem(key(canvas.id));
}

function restoreSignatures() {
  document.querySelectorAll(".signature-canvas").forEach((canvas) => {
    const savedSignature = getSaved(canvas.id);
    if (savedSignature) {
      drawSignatureImage(canvas, savedSignature);
    } else {
      clearSignature(canvas, false);
    }
  });
}

function drawSignatureImage(canvas, source) {
  const image = new Image();
  image.addEventListener("load", () => {
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);
    context.drawImage(image, 0, 0, rect.width, rect.height);
  });
  image.src = source;
}

function bindProfileEvents() {
  bindPasswordToggles();
  document.getElementById("driverLoginForm")?.addEventListener("submit", unlockDriverPage);

  document.getElementById("driverProfileSelect").addEventListener("change", (event) => {
    switchDriverProfile(event.target.value);
  });

  document.getElementById("newDriverProfileBtn").addEventListener("click", () => {
    const name = cleanDriverName(window.prompt("Naam van de nieuwe chauffeur:") || "");
    if (!name) return;
    createDriverProfile(name);
    setSaved("driverName", name);
    restoreFields();
    restoreSignatures();
    renderDriverProfiles();
    document.getElementById("driverName").focus();
  });
}

ensureDriverProfiles();
renderDriverProfiles();
bindProfileEvents();
initDriverLogin();
restoreFields();
setupSignaturePads();
restoreSignatures();
