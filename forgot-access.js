const storagePrefix = "mentor-checklist-nijmegen";
const authSessionKey = `${storagePrefix}:unlocked`;
const recoveryEmailAddress = "tvangiffen@ziggo.nl";
const recoveryCodeKey = `${storagePrefix}:pending-recovery-code`;
const recoveryExpiresKey = `${storagePrefix}:pending-recovery-expires`;

function setRecoveryStatus(text, type = "secondary") {
  const status = document.getElementById("recoveryStatus");
  status.textContent = text;
  status.className = `small mb-0 text-${type}`;
}

function makeRecoveryCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendRecoveryCode() {
  const email = recoveryEmailAddress;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setRecoveryStatus("Vul een geldig e-mailadres in.", "danger");
    return;
  }

  const code = makeRecoveryCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  try {
    const response = await fetch("/api/send-recovery-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        code,
        message: `Mentormap herstelcode: ${code}`,
      }),
    });

    if (!response.ok) throw new Error("Email endpoint not available.");

    sessionStorage.setItem(recoveryCodeKey, code);
    sessionStorage.setItem(recoveryExpiresKey, String(expiresAt));
    setRecoveryStatus("Code is via e-mail verzonden. Voer de code hieronder in.", "success");
  } catch (error) {
    setRecoveryStatus(
      "E-mail versturen is nog niet gekoppeld. Koppel eerst een e-mailserver zoals Firebase Functions met SendGrid, Mailgun of Brevo.",
      "danger"
    );
  }
}

function verifyRecoveryCode() {
  const enteredCode = document.getElementById("recoveryCodeInput").value.trim();
  const savedCode = sessionStorage.getItem(recoveryCodeKey);
  const expiresAt = Number(sessionStorage.getItem(recoveryExpiresKey));

  if (!savedCode || !expiresAt) {
    setRecoveryStatus("Vraag eerst een herstelcode aan.", "danger");
    return;
  }

  if (Date.now() > expiresAt) {
    sessionStorage.removeItem(recoveryCodeKey);
    sessionStorage.removeItem(recoveryExpiresKey);
    setRecoveryStatus("Deze code is verlopen. Vraag een nieuwe code aan.", "danger");
    return;
  }

  if (enteredCode !== savedCode) {
    setRecoveryStatus("De ingevoerde code is onjuist.", "danger");
    return;
  }

  sessionStorage.setItem(authSessionKey, "true");
  sessionStorage.removeItem(recoveryCodeKey);
  sessionStorage.removeItem(recoveryExpiresKey);
  window.location.href = "index.html";
}

document.getElementById("sendRecoveryCodeBtn").addEventListener("click", sendRecoveryCode);
document.getElementById("verifyRecoveryCodeBtn").addEventListener("click", verifyRecoveryCode);
