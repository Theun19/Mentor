const storagePrefix = "mentor-checklist-nijmegen";

function key(name) {
  return `${storagePrefix}:${name}`;
}

function getSaved(name) {
  return localStorage.getItem(key(name)) || "";
}

function setSaved(name, value) {
  localStorage.setItem(key(name), value);
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

restoreFields();
setupSignaturePads();
restoreSignatures();
