const storagePrefix = "mentor-checklist-nijmegen";
const authSessionKey = `${storagePrefix}:unlocked`;
const recoveryPhoneNumber = "+31627838003";
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
  const code = makeRecoveryCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  try {
    const response = await fetch("/api/send-recovery-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: recoveryPhoneNumber,
        code,
        message: `Mentormap herstelcode: ${code}`,
      }),
    });

    if (!response.ok) throw new Error("SMS endpoint not available.");

    sessionStorage.setItem(recoveryCodeKey, code);
    sessionStorage.setItem(recoveryExpiresKey, String(expiresAt));
    setRecoveryStatus("Code is via SMS verzonden. Voer de code hieronder in.", "success");
  } catch (error) {
    setRecoveryStatus(
      "SMS versturen is nog niet gekoppeld. Koppel eerst een SMS-server zoals Twilio, MessageBird of Firebase Functions.",
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
