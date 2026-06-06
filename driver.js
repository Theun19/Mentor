const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;

function key(name) {
  return `${storagePrefix}:${name}`;
}

function getSaved(name) {
  return localStorage.getItem(key(name)) || "";
}

function setSaved(name, value) {
  localStorage.setItem(key(name), value);
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function initDriverSecurity() {
  const savedHash = localStorage.getItem(passwordKey);
  const isUnlocked = sessionStorage.getItem(authSessionKey) === "true";
  const loginForm = document.getElementById("driverLoginForm");
  const noPasswordPanel = document.getElementById("driverNoPasswordPanel");

  if (!savedHash) {
    loginForm.classList.add("d-none");
    noPasswordPanel.classList.remove("d-none");
    document.body.classList.add("auth-locked");
    return;
  }

  loginForm.classList.remove("d-none");
  noPasswordPanel.classList.add("d-none");
  document.body.classList.toggle("auth-locked", !isUnlocked);
}

async function unlockDriver(event) {
  event.preventDefault();
  const savedHash = localStorage.getItem(passwordKey);
  const savedUsername = localStorage.getItem(usernameKey) || "admin";
  const username = document.getElementById("driverPageUsername").value.trim().toLowerCase();
  const password = document.getElementById("driverPagePassword").value;
  const error = document.getElementById("driverLoginError");
  error.textContent = "";

  if (!savedHash || username !== savedUsername || await hashPassword(password) !== savedHash) {
    error.textContent = "Gebruikersnaam of wachtwoord is onjuist.";
    return;
  }

  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("driverPageUsername").value = "";
  document.getElementById("driverPagePassword").value = "";
  document.body.classList.remove("auth-locked");
}

function lockDriver() {
  sessionStorage.removeItem(authSessionKey);
  initDriverSecurity();
  document.getElementById("driverPageUsername").focus();
}

function restoreFields() {
  document.querySelectorAll(".driver-save-field").forEach((input) => {
    input.value = getSaved(input.id);
    input.addEventListener("input", () => setSaved(input.id, input.value));
  });
}

function setupSignaturePads() {
  document.querySelectorAll(".signature-canvas").forEach((canvas) => {
    const context = canvas.getContext("2d");
    let drawing = false;
    resizeSignatureCanvas(canvas);

    canvas.addEventListener("pointerdown", (event) => {
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
    button.addEventListener("click", () => clearSignature(document.getElementById(button.dataset.target)));
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".signature-canvas").forEach((canvas) => {
      const savedSignature = getSaved(canvas.id);
      resizeSignatureCanvas(canvas);
      if (savedSignature) drawSignatureImage(canvas, savedSignature);
    });
  });
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

function clearSignature(canvas) {
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
      clearSignature(canvas);
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

document.getElementById("driverLoginForm").addEventListener("submit", unlockDriver);
document.getElementById("driverLockBtn").addEventListener("click", lockDriver);
restoreFields();
setupSignaturePads();
restoreSignatures();
initDriverSecurity();
