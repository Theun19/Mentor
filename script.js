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
let currentPrintTarget = "dashboard";
const dashboardDonutState = {
  checklist: { score: 0, tone: "donut-tone-empty", hasData: false },
  lines: { score: 0, tone: "donut-tone-empty", hasData: false },
  ratings: { score: 0, tone: "donut-tone-empty", hasData: false },
};

const ratingItems = [
  { label: "Rijstijl", id: "rating-rijstijl" },
  { label: "Verkeersinzicht", id: "rating-verkeersinzicht" },
  { label: "Plaats op de weg", id: "rating-plaats-op-de-weg" },
  { label: "Klantvriendelijkheid", id: "rating-klantvriendelijkheid" },
  { label: "Ontspanningsmonitor", id: "rating-stressmeter" },
  {
    label: "Angstvallig tot roekeloos",
    id: "rating-angstvallig-tot-roekeloos",
    type: "balance",
    left: "Angstvallig",
    leftMid: "Onzeker",
    center: "Zelfverzekerd",
    rightMid: "Lichtzinnig",
    right: "Roekeloos",
  },
];

const checklists = [
  {
    title: "Aftekenlijst 1",
    items: [
      "Kennismaking rayonleiding / stationschef",
      "Uitleg kantoor / stalling / station",
      "Locaties van de diverse stallingen SAN",
      "Chauffeurstas ontvangen",
      "Toegangspas en sleutels (vierkantsleutel)",
      "Kleding ontvangen / kledingprotocol besproken",
      "Routeboek",
      "Schadeformulier ontvangen inclusief uitleg hoe te handelen bij schade",
      "Garage / cleanteam",
      "AFAS-app koppelen aan Mijn HRM",
    ],
  },
  {
    title: "Aftekenlijst 2",
    items: [
      "Zitinstructie",
      "Brandstofbesparing",
      "Uitleg boordcamera",
      "Uitleg omloop (bordje)",
      "Uitleg rolstoelplank",
      "Uitleg VIRIBUS",
      "Valpartijen",
      "Uitleg perronindeling",
      "Afsluiting bus (wanneer hoofdschakelaar uit)",
      "Bufferprotocol",
      "Stallingsprotocol (waar staat de bus overdag en 's avonds)",
    ],
  },
  {
    title: "Aftekenlijst 3",
    items: [
      "Uitleg muurkrant",
      "Aangemeld bij ruilen.nu",
      "Verlofaanvraag",
      "OIS (aanmelden op de pc stalling)",
      "Aangemeld om omleidingen te ontvangen via mail",
      "Podbusprotocol",
      "Voertuiggewenning",
    ],
  },
  {
    title: "Diensten",
    items: [
      "Dienst 1 ingepland",
      "Dienst 2 ingepland",
      "Dienst 3 ingepland",
      "Dienst 4 ingepland",
      "Dienst 5 ingepland",
      "Dienst 6 ingepland",
    ],
  },
];

const lines = [
  "2 NMG PNZ",
  "2 NMG STM",
  "5 naar BWK",
  "5 HOR KRK",
  "5 BEU TIB",
  "5 BEU AAL",
  "6 NMG DUK",
  "6 NMG NBO",
  "8 NMG HAT",
  "8 B&D HAM",
  "9 GRV BST",
  "10 Heijendaal",
  "11 BEU AAL",
  "12 DRU BST",
  "13 WYC B25",
  "14 NMG BRK",
  "15 WYCRN N",
  "15 Lent Th",
  "42 Tiel NS",
  "3 OSH",
  "80 MLG Gre",
  "82 MGK (snel)",
  "83 GNP Bst",
  "83 VNL Bst",
  "83 VNL (weekend)",
  "85 Dru BUS",
  "89 Dru BUS",
  "99 UdenBus",
  "76 B&D HAM",
  "300 RES P&R",
  "331 P44/ALD",
];

const contacts = [
  ["Rayonmanager", "Frans Spruit", "06-48410907"],
  ["Ass. rayonmanager", "Aad Borsten", "06-11352049"],
  ["Ass. rayonmanager", "Karin Rijststra", "06-18196773"],
  ["Ass. rayonmanager", "Maurice Toonen", "06-81176991"],
  ["Ass. rayonmanager", "Gerrit Jan Weel", "06-41725701"],
  ["Ass. rayonmanager", "Cynthia Ebbers", "06-18905619"],
  ["Ass. rayonmanager", "Noortje Verriet", "06-41131561"],
  ["Planning Bemmel", "", "088-6255965", "06-14311034"],
  ["Stationschef", "Marco Stellaard", "06-43403987"],
  ["RRR app", "Nick Spijker", "", "06-18093468"],
  ["ROV Utrecht", "Ziekmelden buiten kantoortijden", "030-2849494"],
];

const websites = [
  ["Mijn HRM", "mijnhrm.connexxion.nl", "https://mijnhrm.connexxion.nl"],
  ["AFAS Pocket", "Officiële AFAS-apppagina", "https://www.afas.nl/software/pocket"],
  ["Webcomm", "diensten.connexxion.nl", "https://diensten.connexxion.nl"],
  ["@Transdev-app", "Officiële apppagina", "https://www.transdev.nl/nl/reisinformatie/%40transdev-app"],
  ["Transdev chauffeursapp", "Google Play", "https://play.google.com/store/apps/details?id=com.transdev.teamtransdev&hl=nl"],
  ["Transdev chauffeursapp iPhone", "App Store", "https://apps.apple.com/nl/app/team-transdev-chauffeur-app/id6618151207"],
  ["Groenendijk Bedrijfskleding", "corpwear.nl", "https://www.corpwear.nl/login.aspx"],
  ["Groenendijk-app", "app.corpwear.nl", "https://app.corpwear.nl"],
  ["CBR", "cbr.nl", "https://www.cbr.nl"],
  ["Mijn CBR", "mijn.cbr.nl", "https://mijn.cbr.nl"],
  ["RRReis-app", "Officiële apppagina", "https://www.rrreis.nl/app/"],
  ["iLost Connexxion", "Gevonden voorwerpen", "https://www.connexxion.nl/nl/klantenservice/gevonden-voorwerpen"],
  ["iLost", "ilost.co/nl", "https://ilost.co/nl"],
  ["OVinfo Android", "Google Play", "https://play.google.com/store/apps/details?id=nl.skywave.ovinfo&hl=nl"],
  ["OVinfo iPhone", "App Store", "https://apps.apple.com/nl/app/ovinfo/id1144468923"],
  ["Diensteninfo", "ruilen.nu", "https://ruilen.nu"],
];

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

function getSavedJson(name, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key(name))) || fallback;
  } catch (error) {
    return fallback;
  }
}

function setSavedJson(name, value) {
  localStorage.setItem(key(name), JSON.stringify(value));
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
  restoreState();
  renderDriverProfiles();
  updateProgress();
  updateRatingAverage();
}

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

function openMainSite() {
  document.body.classList.remove("auth-locked");
}

function setMainLoginError(text) {
  const error = document.getElementById("mainLoginError");
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

async function initMainLogin() {
  await ensureDefaultLogin();

  if (sessionStorage.getItem(authSessionKey) === "true") {
    openMainSite();
    return;
  }

  const usernameInput = document.getElementById("mainLoginUsername");
  if (usernameInput) usernameInput.value = localStorage.getItem(usernameKey) || defaultUsername;
  document.body.classList.add("auth-locked");
}

async function unlockMainSite(event) {
  event.preventDefault();
  const savedUsername = localStorage.getItem(usernameKey) || defaultUsername;
  const savedHash = localStorage.getItem(passwordKey);
  const username = document.getElementById("mainLoginUsername").value.trim().toLowerCase();
  const password = document.getElementById("mainLoginPassword").value;
  setMainLoginError("");

  if (username !== savedUsername || await hashPassword(password) !== savedHash) {
    setMainLoginError("Gebruikersnaam of wachtwoord is onjuist.");
    return;
  }

  sessionStorage.setItem(authSessionKey, "true");
  document.getElementById("mainLoginForm").reset();
  openMainSite();
}

function renderChecklists() {
  const container = document.getElementById("checklistContainer");
  container.innerHTML = "";

  checklists.forEach((list, listIndex) => {
    const column = document.createElement("div");
    column.className = "col-12";

    const panel = document.createElement("div");
    panel.className = "checklist-panel h-100 overflow-hidden";

    const heading = document.createElement("div");
    heading.className = "panel-heading p-3 d-flex justify-content-between gap-3";
    heading.innerHTML = `
      <h2 class="h5 fw-bold mb-0">${list.title}</h2>
      <span class="text-secondary small" id="list-count-${listIndex}"></span>
    `;

    const body = document.createElement("div");
    list.items.forEach((item, itemIndex) => {
      const id = `list-${listIndex}-item-${itemIndex}`;
      const row = document.createElement("div");
      row.className = "task-row";
      row.innerHTML = `
        <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3">
          <div class="form-check flex-grow-1 mb-0">
            <input class="form-check-input task-check" id="${id}" type="checkbox" data-id="${id}" />
            <label class="form-check-label" for="${id}">${item}</label>
          </div>
          <input class="form-control form-control-sm task-note save-field" data-save-id="${id}-note" type="text" placeholder="Notitie" />
        </div>
      `;
      body.appendChild(row);
    });

    panel.append(heading, body);
    column.appendChild(panel);
    container.appendChild(column);
  });
}

function renderLineTable() {
  const body = document.getElementById("lineTableBody");
  const query = document.getElementById("lineSearch")?.value.trim().toLowerCase() || "";
  const summary = getSortedLineSummary();
  const todoLines = summary.filter((item) => !item.done);
  const doneLines = summary.filter((item) => item.done);
  body.innerHTML = "";

  body.appendChild(renderLineBoardSection("Nog te doen", todoLines, query, "todo"));
  body.appendChild(renderLineBoardSection("Afgevinkt", doneLines, query, "done"));
}

function renderLineBoardSection(title, items, query, type) {
  const section = document.createElement("section");
  section.className = `line-board-section line-board-${type}`;
  section.innerHTML = `
    <div class="line-board-heading">
      <h3>${title}</h3>
      <span>${items.length}</span>
    </div>
    <div class="line-card-grid"></div>
  `;

  const grid = section.querySelector(".line-card-grid");
  if (!items.length) {
    grid.innerHTML = `<p class="line-empty">${type === "done" ? "Nog geen lijnen afgevinkt." : "Alle lijnen zijn afgevinkt."}</p>`;
    return section;
  }

  items.forEach((item) => grid.appendChild(renderLineCard(item, query)));
  return section;
}

function renderLineCard(item, query) {
  const completedSteps = item.states.filter((state) => state.done).length;
  const card = document.createElement("article");
  card.dataset.line = item.line.toLowerCase();
  card.className = `line-card ${item.done ? "line-complete" : completedSteps ? "line-started" : ""}`;
  card.classList.toggle("line-hidden", query && !card.dataset.line.includes(query));
  card.innerHTML = `
    <div class="line-card-head">
      <div>
        <span class="line-card-label">Lijn</span>
        <strong class="line-name">${item.line}</strong>
      </div>
      <span class="line-progress-pill">${completedSteps}/4</span>
    </div>
    <div class="line-step-grid">
      ${item.states
      .map((state) => {
        const id = lineTaskId(item.line, state.type);
        return `
          <div>
            <input class="line-check task-check" id="${id}" type="checkbox" data-id="${id}" aria-label="${item.line} ${state.type}" ${state.done ? "checked" : ""} />
            <label class="line-toggle ${state.done ? "active" : ""}" for="${id}">${lineTaskLabel(state.type)}</label>
          </div>
        `;
      })
      .join("")}
    </div>
  `;
  return card;
}

function renderLineOverviewColumns() {
  const container = document.getElementById("lineOverviewColumns");
  if (!container) return;

  const summary = getSortedLineSummary();
  const todoLines = summary.filter((item) => !item.done);
  const doneLines = summary.filter((item) => item.done);

  container.innerHTML = `
    <div class="line-status-card">
      <span>Nog te doen</span>
      <strong>${todoLines.length}</strong>
    </div>
    <div class="line-status-card done">
      <span>Afgevinkt</span>
      <strong>${doneLines.length}</strong>
    </div>
    <div class="line-status-card">
      <span>Totaal</span>
      <strong>${summary.length}</strong>
    </div>
  `;
}

function renderContacts() {
  const body = document.getElementById("contactsTableBody");
  body.innerHTML = contacts
    .map(([role, name, phone, whatsapp]) => {
      const needsCheck = phone === "controleren";
      return `
        <tr>
          <td>${role}</td>
          <td>${name || "-"}</td>
          <td>${needsCheck ? '<span class="uncertain">controleren</span>' : phone}</td>
          <td>${whatsapp || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderRatings() {
  const container = document.getElementById("ratingContainer");
  container.innerHTML = "";

  ratingItems.forEach((item) => {
    const id = item.id;
    const isBalance = item.type === "balance";
    const row = document.createElement("div");
    row.className = "rating-row";
    row.innerHTML = `
      <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3">
        <label class="rating-label" for="${id}">${item.label}</label>
        <div class="rating-control">
          ${
            isBalance
              ? renderBalanceParabola(id, item)
              : ""
          }
          <input class="form-range rating-range" id="${id}" type="range" min="0" max="100" step="1" value="50" data-id="${id}" data-rating-type="${item.type || "normal"}" />
          ${
            isBalance
              ? `<div class="rating-scale-labels">
                  <span>${item.left}</span>
                  <span>${item.leftMid}</span>
                  <span>${item.center}</span>
                  <span>${item.rightMid}</span>
                  <span>${item.right}</span>
                </div>`
              : ""
          }
        </div>
        <output class="rating-value ${isBalance ? "balance-rating-value" : ""}" for="${id}" id="${id}-value">50%</output>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderBalanceParabola(id, item) {
  return `
    <div class="balance-curve" aria-hidden="true">
      <svg class="balance-curve-svg" viewBox="0 0 220 120">
        <path class="balance-curve-path" d="M 12 104 Q 110 -80 208 104" />
        <text class="balance-curve-letter balance-curve-letter-left" x="2" y="92">${getBalanceLabelLetter(item.left)}</text>
        <text class="balance-curve-letter balance-curve-letter-mid-left" x="50" y="32">${getBalanceLabelLetter(item.leftMid)}</text>
        <text class="balance-curve-letter balance-curve-letter-center" x="110" y="6">${getBalanceLabelLetter(item.center)}</text>
        <text class="balance-curve-letter balance-curve-letter-mid-right" x="170" y="32">${getBalanceLabelLetter(item.rightMid)}</text>
        <text class="balance-curve-letter balance-curve-letter-right" x="218" y="92">${getBalanceLabelLetter(item.right)}</text>
        <g class="balance-curve-score-badge">
          <circle cx="110" cy="74" r="18" />
          <text id="${id}-score" x="110" y="75">100%</text>
        </g>
        <circle class="balance-curve-marker" id="${id}-marker" cx="110" cy="12" r="6" />
      </svg>
    </div>
  `;
}

function renderWebsites() {
  const list = document.getElementById("websiteList");
  list.innerHTML = websites
    .map(([label, text, url]) => {
      if (!url) {
        return `
          <div class="website-link">
            <strong>${label}</strong>
            <span class="text-secondary">${text}</span>
          </div>
        `;
      }
      return `
        <a class="website-link" href="${url}" target="_blank" rel="noopener noreferrer">
          <strong>${label}</strong>
          <span>${text}</span>
        </a>
      `;
    })
    .join("");
}

function restoreState() {
  document.querySelectorAll(".task-check").forEach((input) => {
    input.checked = getSaved(input.dataset.id) === "true";
    updateRowState(input);
  });

  document.querySelectorAll(".save-field").forEach((input) => {
    const id = input.dataset.saveId || input.id;
    input.value = getSaved(id);
  });

  document.querySelectorAll(".rating-range").forEach((input) => {
    const savedValue = getSaved(input.dataset.id);
    input.value = normalizeRatingValue(input, savedValue);
    updateRatingValue(input);
  });

  renderLineTable();
  renderSignatureMeta();
  restoreSignatures();
}

function renderSignatureMeta() {
  const driverName = getSaved("driverName") || getActiveDriverProfile()?.name || "-";
  const mentorName = getSaved("mentorName") || "-";
  const endDate = formatSignatureDate(getSaved("endDate"));
  const names = {
    driver: driverName,
    mentor: mentorName,
  };

  document.querySelectorAll("[data-signature-date]").forEach((container) => {
    container.textContent = `Datum: ${endDate}`;
  });

  document.querySelectorAll("[data-signature-meta]").forEach((container) => {
    container.innerHTML = `
      <div>
        <span>Chauffeur</span>
        <strong>${escapeHtml(driverName)}</strong>
      </div>
      <div>
        <span>Mentor</span>
        <strong>${escapeHtml(mentorName)}</strong>
      </div>
      <div>
        <span>Einddatum</span>
        <strong>${escapeHtml(endDate)}</strong>
      </div>
    `;
  });

  document.querySelectorAll("[data-signature-name]").forEach((container) => {
    const role = container.dataset.signatureName;
    container.textContent = names[role] || "-";
  });
}

function formatSignatureDate(value) {
  if (!value) return "-";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return value;
  return new Date(timestamp).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function updateRowState(input) {
  const row = input.closest(".task-row");
  if (row) row.classList.toggle("done", input.checked);
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
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, rect.width, rect.height);
  if (save) localStorage.removeItem(driverKey(getActiveDriverId(), canvas.id));
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

function updateProgress() {
  const checks = [...document.querySelectorAll(".task-check")];
  const done = checks.filter((input) => input.checked).length;
  const percentage = checks.length ? Math.round((done / checks.length) * 100) : 0;
  const lineSummary = getLineSummary();
  const doneLines = lineSummary.filter((item) => item.done).length;
  const linePercentage = lineSummary.length ? Math.round((doneLines / lineSummary.length) * 100) : 0;
  let checklistDone = 0;
  let checklistTotal = 0;

  document.getElementById("progressText").textContent = `${percentage}% afgerond`;
  document.getElementById("dashboardPercent").textContent = `${percentage}%`;
  document.getElementById("dashboardTotalDetail").textContent = `${done}/${checks.length} afgerond`;
  document.getElementById("linePercent").textContent = `${linePercentage}%`;
  updateLineDonut(linePercentage, doneLines, lineSummary.length);
  document.getElementById("progressBar").style.width = `${percentage}%`;

  const checklistChart = document.getElementById("checklistChart");
  checklistChart.innerHTML = "";

  checklists.forEach((list, listIndex) => {
    const listChecks = [...document.querySelectorAll(`[data-id^="list-${listIndex}-item-"]`)];
    const listDone = listChecks.filter((input) => input.checked).length;
    const listPercentage = list.items.length ? Math.round((listDone / list.items.length) * 100) : 0;
    checklistDone += listDone;
    checklistTotal += list.items.length;
    document.getElementById(`list-count-${listIndex}`).textContent = `${listDone}/${list.items.length}`;

    const row = document.createElement("div");
    row.className = "checklist-chart-row";
    row.innerHTML = `
      <span>${list.title}</span>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" style="width: ${listPercentage}%"></div>
      </div>
      <strong>${listDone}/${list.items.length}</strong>
    `;
    checklistChart.appendChild(row);
  });

  const checklistPercentage = checklistTotal ? Math.round((checklistDone / checklistTotal) * 100) : 0;
  document.getElementById("checklistPercent").textContent = `${checklistPercentage}%`;
  document.getElementById("checklistDetail").textContent = `${checklistDone}/${checklistTotal} punten`;
  dashboardDonutState.checklist = {
    score: checklistPercentage,
    tone: checklistDone ? getDonutToneClass(checklistPercentage) : "donut-tone-empty",
    hasData: checklistDone > 0,
  };
  setDonutProgress("checklistDonut", checklistPercentage, dashboardDonutState.checklist.tone);
  updateTotalDonutHeart(percentage);
  renderLineOverviewColumns();
}

function updateTotalDonutHeart(percentage) {
  const parts = [dashboardDonutState.checklist, dashboardDonutState.lines, dashboardDonutState.ratings];
  const activeParts = parts.filter((part) => part.hasData);
  if (!activeParts.length) {
    document.getElementById("dashboardTotalDetail").textContent = `${percentage}% totaal · nog geen data`;
    setDonutProgress("progressDonut", percentage, "donut-tone-empty");
    return;
  }

  const redPart = activeParts.find((part) => part.tone === "donut-tone-red");
  const heartAverage = Math.round(activeParts.reduce((sum, part) => sum + part.score, 0) / activeParts.length);
  const heartTone = redPart ? "donut-tone-red" : getDonutToneClass(heartAverage);
  const detailText = redPart
    ? `${percentage}% totaal · rood onderdeel ${redPart.score}%`
    : `${percentage}% totaal · gemiddeld hart ${heartAverage}%`;
  document.getElementById("dashboardTotalDetail").textContent = detailText;
  setDonutProgress("progressDonut", percentage, heartTone);
}

function setDonutProgress(id, percentage, toneClass = "") {
  const donut = document.getElementById(id);
  if (!donut) return;
  const value = Math.max(0, Math.min(100, Number(percentage) || 0));
  donut.style.background = `conic-gradient(var(--brand) 0deg ${value * 3.6}deg, #e8eee5 ${value * 3.6}deg 360deg)`;
  const center = donut.querySelector(".donut-center");
  if (!center) return;
  center.classList.remove("donut-tone-empty", "donut-tone-red", "donut-tone-orange", "donut-tone-yellow", "donut-tone-light-green", "donut-tone-green", "donut-tone-greener", "donut-tone-strong", "donut-tone-gold");
  center.classList.add(toneClass || getDonutToneClass(value));
}

function getDonutToneClass(value) {
  if (value < 50) return "donut-tone-red";
  if (value < 60) return "donut-tone-yellow";
  if (value >= 90) return "donut-tone-gold";
  if (value >= 80) return "donut-tone-strong";
  if (value >= 70) return "donut-tone-greener";
  return "donut-tone-green";
}

function getRatingDonutToneClass(value) {
  if (value < 50) return "donut-tone-red";
  if (value < 60) return "donut-tone-orange";
  if (value < 70) return "donut-tone-yellow";
  if (value < 80) return "donut-tone-light-green";
  if (value < 90) return "donut-tone-strong";
  return "donut-tone-gold";
}

function updateLineDonut(percentage, doneLines, totalLines) {
  const activeDays = getActiveDrivingDayCount();
  const phase = getLineProgressPhase(activeDays);
  const detail = document.getElementById("lineDetail");

  if (detail) {
    detail.textContent = `${doneLines}/${totalLines} klaar · ${activeDays} actieve rijdagen · doel ${phase.target}%`;
  }

  const lineTone = doneLines ? getLineDonutToneClass(percentage, activeDays) : "donut-tone-empty";
  dashboardDonutState.lines = {
    score: percentage,
    tone: lineTone,
    hasData: doneLines > 0,
  };
  setDonutProgress("lineDonut", percentage, lineTone);
}

function getActiveDrivingDayCount() {
  const ratingRows = document.querySelectorAll(".rating-range").length ? getRatingRowsForProgress() : [];
  return getRatingTableDayKeys(ratingRows, false).length;
}

function getLineProgressPhase(activeDays) {
  if (activeDays >= 15) {
    return { target: 100, gold: 100, green: 90, orange: 80, yellow: null };
  }
  if (activeDays >= 10) {
    return { target: 70, gold: 70, green: 65, orange: 50, yellow: null };
  }
  return { target: 40, gold: 40, green: 30, orange: null, yellow: 20 };
}

function getLineDonutToneClass(percentage, activeDays) {
  const value = Math.max(0, Math.min(100, Number(percentage) || 0));

  if (activeDays >= 15) {
    if (value >= 100) return "donut-tone-gold";
    if (value >= 90) return "donut-tone-green";
    if (value >= 80) return "donut-tone-orange";
    return "donut-tone-red";
  }

  if (activeDays >= 10) {
    if (value >= 70) return "donut-tone-gold";
    if (value >= 65) return "donut-tone-green";
    if (value >= 50) return "donut-tone-orange";
    return "donut-tone-red";
  }

  if (value >= 40) return "donut-tone-gold";
  if (value >= 30) return "donut-tone-green";
  if (value >= 20) return "donut-tone-yellow";
  return "donut-tone-red";
}

function updateRatingValue(input) {
  const score = getRatingScore(input);
  document.getElementById(`${input.id}-value`).textContent = input.dataset.ratingType === "balance"
    ? getBalancePositionLabel(Number(input.value))
    : `${score}%`;
  updateBalanceMarker(input);
}

function getRatingScore(input) {
  const value = Number(input.value);
  if (input.dataset.ratingType === "balance") {
    return Math.max(0, Math.round(100 - (Math.abs(value - 50) / 50) ** 2 * 100));
  }

  return Math.round(value);
}

function getBalancePositionLabel(position) {
  const positionValue = Math.max(0, Math.min(100, Number(position) || 0));
  const score = Math.max(0, Math.round(100 - (Math.abs(positionValue - 50) / 50) ** 2 * 100));
  const isLeftSide = positionValue < 50;

  if (score >= 80) return "Zelfverzekerd";
  if (score >= 60) return isLeftSide ? "Onzeker" : "Lichtzinnig";
  return isLeftSide ? "Angstvallig" : "Roekeloos";
}

function getBalanceEntryLabel(entry) {
  if (Number.isFinite(Number(entry?.position))) {
    return getBalancePositionLabel(Number(entry.position));
  }
  const value = Number(entry?.value);
  if (value >= 80) return "Zelfverzekerd";
  if (value >= 60) return "Onzeker";
  return "Angstvallig";
}

function normalizeRatingValue(input, savedValue) {
  if (savedValue === "") return "50";

  const value = Number(savedValue);
  if (!Number.isFinite(value)) return "50";
  if (value > 10) return String(Math.max(0, Math.min(100, Math.round(value))));

  if (input.dataset.ratingType === "balance") {
    return String(Math.round(((Math.max(1, Math.min(9, value)) - 1) / 8) * 100));
  }

  return String(Math.round(Math.max(0, Math.min(10, value)) * 10));
}

function updateBalanceMarker(input) {
  if (input.dataset.ratingType !== "balance") return;

  const marker = document.getElementById(`${input.id}-marker`);
  const scoreText = document.getElementById(`${input.id}-score`);
  if (!marker) return;

  const value = Number(input.value);
  const x = 12 + (value / 100) * 196;
  const t = value / 100;
  const y = 104 - (4 * t * (1 - t) * 92);
  marker.setAttribute("cx", x.toFixed(1));
  marker.setAttribute("cy", y.toFixed(1));
  if (scoreText) scoreText.textContent = `${getRatingScore(input)}%`;
}

function updateRatingAverage() {
  const ratings = [...document.querySelectorAll(".rating-range")].map((input) => getRatingScore(input));
  const total = ratings.reduce((sum, value) => sum + value, 0);
  const average = ratings.length ? Math.round(total / ratings.length) : 0;
  const dashboardRating = getDashboardRatingScoreSummary(ratings);
  document.getElementById("ratingAverage").textContent = `Gemiddelde: ${average}%`;
  updateRatingDonut(dashboardRating.average, dashboardRating.lowest, dashboardRating.criticalLow);
  updateProgress();
  updateRatingChart();
  renderRatingDayLog();
  renderRatingProgressTable();
}

function updateRatingDonut(average, lowest, criticalLow = null) {
  const percent = document.getElementById("ratingDonutPercent");
  const detail = document.getElementById("ratingDonutDetail");
  if (!percent || !detail) return;
  const hasRatingData = getActiveDrivingDayCount() > 0;

  percent.textContent = `${average}%`;
  detail.textContent = !hasRatingData
    ? "nog geen beoordeling"
    : criticalLow
    ? `kritiek: ${criticalLow.reason}`
    : `${getRatingDonutStatus(lowest)}: laagste geldig ${lowest}%`;
  const ratingTone = !hasRatingData ? "donut-tone-empty" : criticalLow ? "donut-tone-red" : getRatingDonutToneClass(lowest);
  dashboardDonutState.ratings = {
    score: criticalLow ? criticalLow.value : lowest,
    tone: ratingTone,
    hasData: hasRatingData,
  };
  setDonutProgress("ratingDonut", average, ratingTone);
  const totalPercent = Number.parseInt(document.getElementById("dashboardPercent")?.textContent || "0", 10) || 0;
  updateTotalDonutHeart(totalPercent);
}

function getDashboardRatingScoreSummary(fallbackRatings) {
  const rows = getRatingRowsForProgress();
  const dayKeys = getRatingTableDayKeys(rows, false);
  let criticalLow = null;
  const scores = rows.map((rating) => {
    const values = dayKeys
      .map((dayKey) => rating.history.find((entry) => getDayKey(entry.time) === dayKey)?.value)
      .filter((value) => Number.isFinite(Number(value)))
      .map((value) => Math.max(0, Math.min(100, Math.round(Number(value)))));

    if (!values.length) return null;
    criticalLow = getMoreSevereCriticalLow(criticalLow, getCriticalLowRatingStatus(values, rating.label));
    const countedValues = getCountedRatingValues(values);
    const total = countedValues.reduce((sum, value) => sum + value, 0);
    return Math.round(total / countedValues.length);
  }).filter((value) => Number.isFinite(Number(value)));

  const usableScores = scores.length ? scores : fallbackRatings;
  const total = usableScores.reduce((sum, value) => sum + value, 0);
  return {
    average: usableScores.length ? Math.round(total / usableScores.length) : 0,
    lowest: usableScores.length ? Math.min(...usableScores) : 0,
    criticalLow,
  };
}

function getCriticalLowRatingStatus(values, label) {
  const lowest = Math.min(...values);
  if (lowest <= 10) {
    return {
      value: lowest,
      reason: `${label} heeft een score van ${lowest}%`,
    };
  }

  const lowCount = values.filter((value) => value <= 20).length;
  if (lowCount >= 2) {
    return {
      value: lowest,
      reason: `${label} is ${lowCount}x 20% of lager`,
    };
  }

  return null;
}

function getMoreSevereCriticalLow(current, next) {
  if (!next) return current;
  if (!current) return next;
  return next.value < current.value ? next : current;
}

function getCountedRatingValues(values) {
  if (values.length < 3) return values;

  const sorted = values.slice().sort((first, second) => first - second);
  const underThirtyCount = sorted.filter((value) => value < 30).length;
  const counted = underThirtyCount >= 3
    ? sorted.slice(0, -1)
    : sorted.slice(1, -1);

  return counted.length ? counted : sorted;
}

function getRatingDonutStatus(value) {
  if (value < 50) return "onvoldoende";
  if (value < 60) return "twijfelachtig";
  if (value < 70) return "voldoende";
  if (value < 90) return "goed";
  return "uitstekend";
}

function getRatingRowsForProgress() {
  return [...document.querySelectorAll(".rating-range")].map((input) => {
    const item = ratingItems.find((rating) => rating.id === input.dataset.id);
    return {
      id: input.dataset.id,
      label: item?.type === "balance" ? "Angstvallig / Onzeker / Zelfverzekerd / Lichtzinnig / Roekeloos" : item?.label || input.dataset.id,
      input,
      history: getStoredRatingHistory(input),
    };
  });
}

function renderRatingDayLog() {
  const log = document.getElementById("ratingDayLog");
  if (!log) return;

  const ratings = getRatingRowsForProgress();
  const dayKeys = getRatingTableDayKeys(ratings, false).filter(Boolean);
  if (!dayKeys.length) {
    log.innerHTML = `<p class="text-secondary mb-0">Nog geen rijlesdag opgeslagen.</p>`;
    return;
  }

  log.innerHTML = dayKeys.map((dayKey) => {
    const scores = ratings.map((rating) => {
      const entry = rating.history.find((historyEntry) => getDayKey(historyEntry.time) === dayKey);
      return `
        <div class="rating-day-score">
          <span>${rating.label}</span>
          <strong>${entry ? `${entry.value}%` : "-"}</strong>
        </div>
      `;
    }).join("");

    return `
      <article class="rating-day-card">
        <div class="rating-day-date">${formatDayLabel(dayKey)}</div>
        <div class="rating-day-scores">${scores}</div>
      </article>
    `;
  }).join("");
}

function renderRatingProgressTable() {
  const table = document.getElementById("ratingProgressTable");
  if (!table) return;

  const ratings = getRatingRowsForProgress();
  const dayKeys = getRatingTableDayKeys(ratings);
  const activeDayKey = getActiveRatingDayKey();

  table.innerHTML = `
    <tbody>
      <tr>
        <th scope="row">Dag</th>
        ${dayKeys.map((dayKey, index) => `
          <td class="rating-table-date-cell ${dayKey && dayKey === activeDayKey ? "active-rating-day" : ""}" data-day-key="${escapeHtml(dayKey)}" data-column-index="${index}">
            ${
              dayKey
                ? `
              <button
                class="rating-column-drag"
                type="button"
                data-day-key="${escapeHtml(dayKey)}"
                data-column-index="${index}"
                aria-label="Kolom verslepen"
                title="Versleep kolom">☰</button>
                `
                : `<span class="rating-column-drag-placeholder" aria-hidden="true"></span>`
            }
            <input
              class="rating-table-input rating-table-date-input"
              type="date"
              value="${escapeHtml(dayKey)}"
              data-day-key="${escapeHtml(dayKey)}"
              data-column-index="${index}"
              aria-label="Datum kolom ${index + 1}">
            <button
              class="rating-date-close"
              type="button"
              aria-label="Agenda sluiten"
              title="Agenda sluiten">×</button>
          </td>
        `).join("")}
      </tr>
      ${ratings.map((rating) => `
        <tr>
          <th scope="row">${rating.label}</th>
          ${dayKeys.map((dayKey, index) => {
            const entry = dayKey ? rating.history.find((historyEntry) => getDayKey(historyEntry.time) === dayKey) : null;
            const isBalance = rating.input.dataset.ratingType === "balance";
            const balanceLabel = entry && isBalance ? getBalanceEntryLabel(entry) : "";
            if (isBalance) {
              return `
                <td class="${dayKey && dayKey === activeDayKey ? "active-rating-day" : ""}" data-column-index="${index}">
                  <div class="rating-table-balance-label">${entry ? escapeHtml(balanceLabel) : "-"}</div>
                </td>
              `;
            }
            return `
              <td class="${dayKey && dayKey === activeDayKey ? "active-rating-day" : ""}" data-column-index="${index}">
                <input
                  class="rating-table-input rating-table-score-input"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="-"
                  value="${entry ? escapeHtml(entry.value) : ""}"
                  data-day-key="${escapeHtml(dayKey)}"
                  data-rating-id="${escapeHtml(rating.id)}"
                  data-column-index="${index}"
                  ${dayKey ? "" : "disabled"}
                  aria-label="${escapeHtml(rating.label)} score kolom ${index + 1}">
              </td>
            `;
          }).join("")}
        </tr>
      `).join("")}
      <tr>
        <th scope="row">Gemiddelde</th>
        ${dayKeys.map((dayKey, index) => {
          const activeClass = dayKey && dayKey === activeDayKey ? "active-rating-day" : "";
          if (!dayKey) return `<td data-column-index="${index}"></td>`;
          const values = ratings
            .map((rating) => rating.history.find((entry) => getDayKey(entry.time) === dayKey)?.value)
            .filter((value) => Number.isFinite(Number(value)));
          if (!values.length) return `<td class="${activeClass}" data-column-index="${index}"></td>`;
          return `<td class="${activeClass}" data-column-index="${index}">${Math.round(values.reduce((sum, value) => sum + Number(value), 0) / values.length)}%</td>`;
        }).join("")}
      </tr>
    </tbody>
  `;
}

function getRatingTableDayKeys(ratings, includePadding = true) {
  const keys = [...getSavedRatingDays()];
  ratings.forEach((rating) => {
    rating.history.forEach((entry) => {
      const dayKey = getDayKey(entry.time);
      if (!keys.includes(dayKey)) keys.push(dayKey);
    });
  });

  const orderedKeys = keys.slice(-30);
  if (!includePadding) return orderedKeys;

  return orderedKeys.concat(Array.from({ length: Math.max(0, 30 - orderedKeys.length) }, () => ""));
}

function getActiveRatingDayKey() {
  const timestamp = getSelectedRatingTimestamp();
  return timestamp ? getDayKey(timestamp) : "";
}

function activateRatingDayColumn(dayKey) {
  if (!dayKey) return;

  const input = document.getElementById("ratingDateInput");
  if (input) input.value = formatDateInputValue(dayKey);
  applyRatingDayToSliders(dayKey);
  renderRatingProgressTable();
  showRatingSaveStatus(timestampFromDayKey(dayKey), `Actieve dag voor schuiven: ${formatDayLabel(timestampFromDayKey(dayKey))}`);
}

function applyRatingDayToSliders(dayKey) {
  getRatingRowsForProgress().forEach((rating) => {
    const entry = rating.history.find((historyEntry) => getDayKey(historyEntry.time) === dayKey);
    if (!entry) return;

    if (rating.input.dataset.ratingType === "balance") {
      rating.input.value = Number.isFinite(Number(entry.position))
        ? String(Math.max(0, Math.min(100, Math.round(Number(entry.position)))))
        : String(getBalancePositionFromScore(entry.value));
    } else {
      rating.input.value = String(Math.max(0, Math.min(100, Math.round(Number(entry.value)))));
    }
    setSaved(rating.input.dataset.id, rating.input.value);
    updateRatingValue(rating.input);
  });
  updateRatingChart();
}

function getBalancePositionFromScore(score) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  if (value >= 80) return 50;
  if (value >= 60) return 35;
  return 15;
}

function getSavedRatingDays() {
  return getSavedJson("rating-days", [])
    .map((dayKey) => (typeof dayKey === "string" ? dayKey : ""))
    .filter((dayKey) => /^\d{4}-\d{2}-\d{2}$/.test(dayKey));
}

function saveRatingDays(dayKeys) {
  const cleanKeys = [...new Set(dayKeys.filter((dayKey) => /^\d{4}-\d{2}-\d{2}$/.test(dayKey)))]
    .slice(-30);
  setSavedJson("rating-days", cleanKeys);
}

function addSavedRatingDay(dayKey) {
  saveRatingDays([...getSavedRatingDays(), dayKey]);
}

function timestampFromDayKey(dayKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return null;
  const [year, month, day] = dayKey.split("-").map(Number);
  const timestamp = new Date(year, month - 1, day, 12).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseRatingDateValue(value) {
  const text = String(value || "").trim();
  if (!text) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return timestampFromDayKey(text);
  }

  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const timestamp = new Date(Number(year), Number(month) - 1, Number(day), 12).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getRatingHistoryById(ratingId) {
  const input = document.querySelector(`.rating-range[data-id="${CSS.escape(ratingId)}"]`);
  return input ? getStoredRatingHistory(input) : [];
}

function setRatingHistoryById(ratingId, history) {
  const input = document.querySelector(`.rating-range[data-id="${CSS.escape(ratingId)}"]`);
  if (!input) return;

  const sortedHistory = history
    .filter((entry) => Number.isFinite(Number(entry.time)) && Number.isFinite(Number(entry.value)))
    .sort((first, second) => first.time - second.time)
    .slice(-30);
  setSavedJson(`${input.dataset.id}-history`, sortedHistory);
}

function moveRatingDay(oldDayKey, newDayKey) {
  const currentDays = getSavedRatingDays();
  const existingIndex = currentDays.indexOf(oldDayKey);
  const days = currentDays.filter((dayKey) => dayKey !== oldDayKey && dayKey !== newDayKey);
  if (existingIndex >= 0) {
    days.splice(Math.min(existingIndex, days.length), 0, newDayKey);
  } else {
    days.push(newDayKey);
  }
  saveRatingDays(days);

  if (!oldDayKey || oldDayKey === newDayKey) return;

  const newTimestamp = timestampFromDayKey(newDayKey);
  if (!newTimestamp) return;

  getRatingRowsForProgress().forEach((rating) => {
    const movingEntry = rating.history.find((entry) => getDayKey(entry.time) === oldDayKey);
    if (!movingEntry) return;

    const history = rating.history
      .filter((entry) => getDayKey(entry.time) !== oldDayKey && getDayKey(entry.time) !== newDayKey);
    history.push({
      ...movingEntry,
      time: newTimestamp,
    });
    setRatingHistoryById(rating.id, history);
  });
}

function saveRatingTableScore(ratingId, dayKey, rawValue) {
  const timestamp = timestampFromDayKey(dayKey);
  if (!timestamp) return false;

  const text = String(rawValue || "").trim();
  const history = getRatingHistoryById(ratingId).filter((entry) => getDayKey(entry.time) !== dayKey);

  if (text) {
    const numericValue = Number(text);
    if (!Number.isFinite(numericValue)) return false;
    const value = Math.max(0, Math.min(100, Math.round(numericValue)));
    history.push({
      time: timestamp,
      value,
      scoreVersion: 2,
    });
  }

  addSavedRatingDay(dayKey);
  setRatingHistoryById(ratingId, history);
  return true;
}

function moveRatingTableColumnTo(dayKey, targetDayKey) {
  if (!dayKey || !targetDayKey || dayKey === targetDayKey) return;

  const days = getRatingTableDayKeys(getRatingRowsForProgress(), false);
  const index = days.indexOf(dayKey);
  const targetIndex = days.indexOf(targetDayKey);
  if (index < 0 || targetIndex < 0) return;

  days.splice(index, 1);
  days.splice(targetIndex, 0, dayKey);
  saveRatingDays(days);
  showRatingSaveStatus(timestampFromDayKey(dayKey), "Kolom verplaatst.");
  updateRatingAverage();
}

let draggedRatingDayKey = "";
let activeRatingDateInput = null;

function handleRatingProgressTablePointerDown(event) {
  const handle = event.target.closest(".rating-column-drag");
  if (!handle || !handle.dataset.dayKey) return;

  draggedRatingDayKey = handle.dataset.dayKey;
  handle.setPointerCapture?.(event.pointerId);
  document.getElementById("ratingProgressTable")?.classList.add("is-dragging-column");
  event.preventDefault();
}

function handleRatingProgressTableDatePointerDown(event) {
  if (!shouldUseRatingDateModal()) return;
  if (event.target.closest(".rating-column-drag") || event.target.closest(".rating-date-close")) return;

  const cell = event.target.closest(".rating-table-date-cell");
  if (!cell) return;

  const input = cell.querySelector(".rating-table-date-input");
  if (!(input instanceof HTMLInputElement)) return;

  event.preventDefault();
  const dayKey = cell.dataset.dayKey || "";
  if (dayKey) activateRatingDayColumn(dayKey);
  openRatingDateModal(getRatingDateInputByDay(dayKey) || input);
}

function getRatingDateInputByDay(dayKey) {
  if (!dayKey) return null;
  return document.querySelector(`.rating-table-date-input[data-day-key="${CSS.escape(dayKey)}"]`);
}

function handleRatingProgressTablePointerUp(event) {
  if (!draggedRatingDayKey) return;

  const targetCell = document.elementFromPoint(event.clientX, event.clientY)?.closest(".rating-table-date-cell");
  const targetDayKey = targetCell?.dataset.dayKey || "";
  document.getElementById("ratingProgressTable")?.classList.remove("is-dragging-column");
  moveRatingTableColumnTo(draggedRatingDayKey, targetDayKey);
  draggedRatingDayKey = "";
}

function handleRatingProgressTableClick(event) {
  if (draggedRatingDayKey) return;
  if (event.target.closest(".rating-column-drag")) return;

  const closeButton = event.target.closest(".rating-date-close");
  if (closeButton) {
    closeRatingDatePicker(closeButton.closest(".rating-table-date-cell")?.querySelector(".rating-table-date-input"));
    return;
  }

  const clickedDateInput = event.target.closest(".rating-table-date-input");
  if (clickedDateInput) {
    const dayKey = clickedDateInput.dataset.dayKey || "";
    if (dayKey) activateRatingDayColumn(dayKey);
    openRatingDatePicker(getRatingDateInputByDay(dayKey) || clickedDateInput, event);
    return;
  }

  const cell = event.target.closest(".rating-table-date-cell");
  if (!cell?.dataset.dayKey) return;
  const dayKey = cell.dataset.dayKey;
  activateRatingDayColumn(dayKey);
  openRatingDatePicker(getRatingDateInputByDay(dayKey) || cell.querySelector(".rating-table-date-input"), event);
}

function handleRatingProgressTableHover(event) {
  if (window.matchMedia?.("(pointer: coarse)")?.matches) return;

  const cell = event.target.closest("[data-column-index]");
  const table = document.getElementById("ratingProgressTable");
  if (!table) return;

  table.querySelectorAll(".hover-rating-day").forEach((item) => item.classList.remove("hover-rating-day"));
  if (!cell || !table.contains(cell)) return;

  const columnIndex = cell.dataset.columnIndex;
  if (columnIndex === undefined) return;
  table.querySelectorAll(`[data-column-index="${CSS.escape(columnIndex)}"]`).forEach((item) => {
    item.classList.add("hover-rating-day");
  });
}

function clearRatingProgressTableHover() {
  document.getElementById("ratingProgressTable")
    ?.querySelectorAll(".hover-rating-day")
    .forEach((item) => item.classList.remove("hover-rating-day"));
}

function shouldUseRatingDateModal() {
  return window.matchMedia?.("(max-width: 767.98px), (pointer: coarse)")?.matches;
}

function openRatingDatePicker(input, event) {
  if (!(input instanceof HTMLInputElement)) return;

  if (shouldUseRatingDateModal()) {
    event?.preventDefault();
    openRatingDateModal(input);
    return;
  }

  try {
    input.focus({ preventScroll: true });
  } catch {
    input.focus();
  }
  input.closest(".rating-table-date-cell")?.classList.add("date-picker-open");
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch {
      // Sommige browsers laten de native kalender alleen direct via het datumveld zelf openen.
    }
  }
}

function openRatingDateModal(sourceInput) {
  const modal = document.getElementById("ratingDateModal");
  const modalInput = document.getElementById("ratingDateModalInput");
  if (!(sourceInput instanceof HTMLInputElement) || !(modalInput instanceof HTMLInputElement) || !modal) return;

  activeRatingDateInput = sourceInput;
  modalInput.value = sourceInput.value;
  sourceInput.closest(".rating-table-date-cell")?.classList.add("date-picker-open");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("date-picker-open-body");
  try {
    modalInput.focus({ preventScroll: true });
  } catch {
    modalInput.focus();
  }
  if (typeof modalInput.showPicker === "function") {
    try {
      modalInput.showPicker();
    } catch {
      // De grote pop-up blijft bruikbaar als de browser de native picker niet automatisch opent.
    }
  }
}

function closeRatingDateModal(save = false) {
  const modal = document.getElementById("ratingDateModal");
  const modalInput = document.getElementById("ratingDateModalInput");
  if (!modal) return;

  if (save && activeRatingDateInput instanceof HTMLInputElement && modalInput instanceof HTMLInputElement) {
    activeRatingDateInput.value = modalInput.value;
    handleRatingProgressTableChange({ target: activeRatingDateInput });
  }

  activeRatingDateInput?.closest(".rating-table-date-cell")?.classList.remove("date-picker-open");
  activeRatingDateInput = null;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("date-picker-open-body");
}

function closeRatingDatePicker(input) {
  if (!(input instanceof HTMLInputElement)) return;

  if (activeRatingDateInput === input) {
    closeRatingDateModal(false);
    return;
  }

  input.blur();
  input.closest(".rating-table-date-cell")?.classList.remove("date-picker-open");
}

function handleRatingProgressTableChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.classList.contains("rating-table-date-input")) {
    input.closest(".rating-table-date-cell")?.classList.remove("date-picker-open");
  }

  if (input.classList.contains("rating-table-date-input")) {
    if (!input.value.trim() && !input.dataset.dayKey) return;

    const timestamp = parseRatingDateValue(input.value);
    if (!timestamp) {
      showRatingSaveStatus(null, "Kies een geldige datum.");
      renderRatingProgressTable();
      return;
    }

    const newDayKey = getDayKey(timestamp);
    moveRatingDay(input.dataset.dayKey || "", newDayKey);
    showRatingSaveStatus(timestamp, `Datum bijgewerkt: ${formatDayLabel(timestamp)}`);
    updateRatingAverage();
    return;
  }

  if (input.classList.contains("rating-table-score-input")) {
    if (!input.dataset.dayKey) {
      showRatingSaveStatus(null, "Vul eerst de datum boven deze kolom in.");
      return;
    }

    if (!saveRatingTableScore(input.dataset.ratingId, input.dataset.dayKey, input.value)) {
      showRatingSaveStatus(null, "Vul een score in van 0 tot 100.");
      renderRatingProgressTable();
      return;
    }

    showRatingSaveStatus(timestampFromDayKey(input.dataset.dayKey), "Score in de tabel opgeslagen.");
    updateRatingAverage();
  }
}

function handleRatingProgressTableInput(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.classList.contains("rating-table-date-input")) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.value.trim())) return;

    handleRatingProgressTableChange(event);
    return;
  }

  if (!input.classList.contains("rating-table-score-input")) return;

  window.clearTimeout(Number(input.dataset.saveTimer));
  input.dataset.saveTimer = String(window.setTimeout(() => {
    if (!document.contains(input)) return;
    handleRatingProgressTableChange({ target: input });
  }, 450));
}

function handleRatingProgressTableKeydown(event) {
  if (event.key !== "Enter") return;
  if (!(event.target instanceof HTMLInputElement)) return;
  if (!event.target.classList.contains("rating-table-input")) return;

  event.preventDefault();
  event.target.blur();
}

function getDayKey(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function updateRatingChart() {
  const chart = document.getElementById("ratingChart");
  if (!chart) return;

  chart.innerHTML = "";

  document.querySelectorAll(".rating-range").forEach((input) => {
    const baseLabel = input.closest(".rating-row").querySelector(".rating-label").textContent;
    const isBalance = input.dataset.ratingType === "balance";
    const history = getStoredRatingHistory(input);
    const tableHistory = isBalance ? getRatingHistoryForTableDays(input) : [];
    const graphHistory = isBalance
      ? (tableHistory.length ? tableHistory : getRatingHistory(input))
      : (history.length ? history : getRatingHistory(input));
    const label = isBalance ? getBalanceChartTitle(input, graphHistory) : baseLabel;
    const item = document.createElement("div");
    item.className = "line-chart-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `${label} grafiek vergroten`);
    item.innerHTML = `
      <div class="line-chart-header">
        <div class="line-chart-title">${label}</div>
        ${isBalance ? renderBalanceLegend() : ""}
      </div>
      <div class="line-chart-frame">
        ${isBalance ? renderBalancePointGraph(graphHistory, input) : renderLineGraph(graphHistory, 100)}
      </div>
    `;
    item.addEventListener("click", (event) => {
      if (event.target.closest(".balance-legend")) return;
      openChartZoom(label, item);
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openChartZoom(label, item);
      }
    });
    chart.appendChild(item);
  });
}

function getRatingHistoryForTableDays(input) {
  const ratingRows = getRatingRowsForProgress();
  const currentRating = ratingRows.find((rating) => rating.id === input.dataset.id);
  const dayKeys = getRatingTableDayKeys(ratingRows, false);
  if (!currentRating || !dayKeys.length) return [];

  return dayKeys.map((dayKey) => {
    const entry = currentRating.history.find((historyEntry) => getDayKey(historyEntry.time) === dayKey);
    return entry
      ? { ...entry, dayKey }
      : { time: timestampFromDayKey(dayKey), dayKey, value: null, missing: true };
  });
}

function renderBalanceLegend() {
  return `
    <details class="balance-legend">
      <summary>Legenda</summary>
      <div class="balance-legend-panel">
        <span><strong>A</strong> Angstvallig</span>
        <span><strong>O</strong> Onzeker</span>
        <span><strong>Z</strong> Zelfverzekerd</span>
        <span><strong>L</strong> Lichtzinnig</span>
        <span><strong>R</strong> Roekeloos</span>
      </div>
    </details>
  `;
}

function renderRatingTrend(history) {
  const realHistory = history.filter((entry) => entry && Number.isFinite(Number(entry.value)));
  if (realHistory.length < 2) {
    return `<div class="line-chart-trend muted">Meetpunten: ${realHistory.length}. Sla een tweede datum op voor progressie.</div>`;
  }

  const previous = realHistory[realHistory.length - 2];
  const current = realHistory[realHistory.length - 1];
  const difference = current.value - previous.value;
  const tone = difference > 0 ? "up" : difference < 0 ? "down" : "same";
  const sign = difference > 0 ? "+" : "";

  return `
    <div class="line-chart-trend ${tone}">
      <span>${formatDayLabel(previous.time)}: ${previous.value}%</span>
      <strong>${formatDayLabel(current.time)}: ${current.value}%</strong>
      <em>${sign}${difference}%</em>
    </div>
  `;
}

function renderRatingPointList(history) {
  const realHistory = history.filter((entry) => entry && Number.isFinite(Number(entry.value)));
  if (!realHistory.length) return "";

  return `
    <div class="line-chart-points-list" aria-label="Datums instructie">
      ${realHistory.map((entry) => `
        <span>${formatDayLabel(entry.time)}</span>
      `).join("")}
    </div>
  `;
}

function getBalanceChartTitle(input, history = []) {
  const realHistory = history.filter((entry) => Number.isFinite(Number(entry?.value)));
  const latestEntry = realHistory[realHistory.length - 1];
  return latestEntry ? getBalanceEntryLabel(latestEntry) : getBalancePositionLabel(Number(input.value));
}

function openChartZoom(title, sourceItem) {
  const zoom = document.getElementById("chartZoom");
  const zoomTitle = document.getElementById("chartZoomTitle");
  const zoomContent = document.getElementById("chartZoomContent");

  zoomTitle.textContent = title;
  zoomContent.innerHTML = sourceItem.innerHTML;
  zoom.classList.add("show");
  zoom.setAttribute("aria-hidden", "false");
  document.body.classList.add("zoom-open");
  document.getElementById("chartZoomClose").focus();
}

function closeChartZoom() {
  const zoom = document.getElementById("chartZoom");
  zoom.classList.remove("show");
  zoom.setAttribute("aria-hidden", "true");
  document.body.classList.remove("zoom-open");
}

function generateMentorText() {
  const target = document.getElementById("mentorGeneratedText");
  if (!target) return;

  const text = buildMentorGeneratedText();
  target.value = text;
  setSaved("mentorGeneratedText", text);
  showRatingSaveStatus(Date.now(), "Tekst gegenereerd.");
}

function buildMentorGeneratedText() {
  const driverName = getSaved("driverName") || getActiveDriverProfile()?.name || "de chauffeur";
  const mentorName = getSaved("mentorName");
  const personnelNumber = getSaved("personnelNumber");
  const startDate = getSaved("startDate");
  const endDate = getSaved("endDate");
  const checklistSummary = getChecklistMentorSummary();
  const lineSummary = getLineMentorSummary();
  const ratingSummary = getRatingMentorSummary();
  const openNotes = getOpenChecklistNotes();
  const totalProgress = getTotalMentorProgress(checklistSummary, lineSummary);
  const attentionText = buildProgressAttentionText(lineSummary, ratingSummary);
  const closingLine = buildMentorClosingLine(totalProgress, lineSummary, ratingSummary);
  const linesTable = buildOpenLinesTextTable(lineSummary.openLines);
  const ratingLines = ratingSummary.slice(0, 4).map(formatRatingProgressText);
  const notes = openNotes.slice(0, 3);
  const metaLine = [mentorName ? `Mentor: ${mentorName}` : "", personnelNumber ? `Pers.nr.: ${personnelNumber}` : "", startDate || endDate ? `Periode: ${startDate || "-"} t/m ${endDate || "-"}` : ""].filter(Boolean).join(" | ");

  const sections = [
    `1. Mentorverslag - ${driverName}`,
    metaLine,
    `2. Voortgang\n\nTotale voortgang: ${totalProgress.done}/${totalProgress.total} punten (${totalProgress.percentage}%).\nLijnverkenning: ${lineSummary.done}/${lineSummary.total} lijnen volledig afgerond.`,
    `3. Aftekenlijsten\n\n${checklistSummary.lists.map((list) => `- ${list.title}: ${list.done}/${list.total} punten afgetekend (${list.percentage}%).`).join("\n")}`,
    linesTable ? `4. Open lijnen\n\nNog niet volledig afgerond:\n\n${linesTable}` : "",
    ratingLines.length ? `5. Beoordelingen\n\n${ratingLines.join("\n")}` : "",
    attentionText ? `6. Aandacht\n\n${attentionText}` : "",
    notes.length
      ? `7. Notities\n\n${notes.map((note) => `- ${note}`).join("\n")}`
      : "",
    `8. Conclusie\n\n${buildMentorAdvice(checklistSummary, lineSummary, ratingSummary, totalProgress)}\n\n${closingLine}`,
  ].filter((line) => line !== "");

  return sections.join("\n\n\n");
}

function getChecklistMentorSummary() {
  const lists = checklists.map((list, listIndex) => {
    const total = list.items.length;
    const done = list.items.filter((_, itemIndex) => getSaved(`list-${listIndex}-item-${itemIndex}`) === "true").length;
    const open = total - done;
    const percentage = total ? Math.round((done / total) * 100) : 0;
    return { title: list.title, done, total, open, percentage };
  });
  const done = lists.reduce((sum, list) => sum + list.done, 0);
  const total = lists.reduce((sum, list) => sum + list.total, 0);
  const open = total - done;
  const percentage = total ? Math.round((done / total) * 100) : 0;

  return { done, total, open, percentage, lists };
}

function getLineMentorSummary() {
  const summary = getSortedLineSummary();
  const doneLines = summary.filter((item) => item.done);
  const openLines = summary.filter((item) => !item.done);
  const doneSteps = summary.reduce((sum, item) => sum + item.states.filter((state) => state.done).length, 0);
  const totalSteps = summary.reduce((sum, item) => sum + item.states.length, 0);

  return {
    done: doneLines.length,
    total: summary.length,
    doneSteps,
    totalSteps,
    openLines,
  };
}

function getRatingMentorSummary() {
  return getRatingRowsForProgress().map((rating) => {
    const latest = rating.history[rating.history.length - 1];
    if (!latest) return null;
    const first = rating.history[0];
    const difference = first ? latest.value - first.value : 0;

    return {
      label: rating.id === "rating-angstvallig-tot-roekeloos"
        ? getBalanceEntryLabel(latest)
        : rating.label,
      value: latest.value,
      startValue: first ? first.value : latest.value,
      difference,
      date: formatDayLabel(latest.time),
      startDate: first ? formatDayLabel(first.time) : "",
    };
  }).filter(Boolean);
}

function getTotalMentorProgress(checklistSummary, lineSummary) {
  const total = checklistSummary.total + lineSummary.totalSteps;
  const done = checklistSummary.done + lineSummary.doneSteps;
  const open = total - done;
  const percentage = total ? Math.round((done / total) * 100) : 0;

  return { done, total, open, percentage };
}

function buildOpenLinesTextTable(openLines) {
  if (!openLines.length) return "";

  const columnCount = 4;
  const rowCount = 9;
  const columnWidth = 22;
  const visibleLines = openLines.slice(0, columnCount * rowCount).map((item) => item.line);
  const extraCount = openLines.length - visibleLines.length;
  if (extraCount > 0) visibleLines.push(`+${extraCount} extra lijnen`);

  const rows = [];
  for (let index = 0; index < visibleLines.length; index += columnCount) {
    rows.push(visibleLines
      .slice(index, index + columnCount)
      .map((line, columnIndex) => columnIndex === columnCount - 1 ? line : line.padEnd(columnWidth, " "))
      .join(""));
  }

  return rows.join("\n");
}

function formatRatingProgressText(item) {
  const absoluteDifference = Math.abs(item.difference);
  const movement = item.difference > 0
    ? `verbeterd met ${absoluteDifference}%`
    : item.difference < 0
      ? `gedaald met ${absoluteDifference}%`
      : "gelijk gebleven";
  const dateText = item.startDate && item.startDate !== item.date
    ? ` (${item.startDate} naar ${item.date})`
    : item.date
      ? ` (${item.date})`
      : "";

  return `- ${item.label}: van ${item.startValue}% naar ${item.value}%, ${movement}${dateText}.`;
}

function buildProgressAttentionText(lineSummary, ratingSummary) {
  const messages = [];
  const linePercentage = lineSummary.totalSteps ? Math.round((lineSummary.doneSteps / lineSummary.totalSteps) * 100) : 0;
  const lowRatings = ratingSummary.filter((item) => item.value < 60);

  if (lineSummary.openLines.length && linePercentage < 40) {
    messages.push(`De lijnverkenning laat nog beperkte voortgang zien: ${lineSummary.doneSteps}/${lineSummary.totalSteps} lijnonderdelen zijn afgevinkt (${linePercentage}%). Plan gericht tijd in om de openstaande lijnen verder af te ronden.`);
  } else if (lineSummary.openLines.length > Math.ceil(lineSummary.total * 0.6)) {
    messages.push(`Er staan nog relatief veel lijnen open: ${lineSummary.openLines.length}/${lineSummary.total} lijnen zijn nog niet volledig afgevinkt.`);
  }

  if (lowRatings.length) {
    messages.push(`De volgende beoordelingen zitten onder de 60% en vragen extra aandacht: ${lowRatings.map((item) => `${item.label} (${item.value}%)`).join(", ")}.`);
  }

  return messages.join("\n\n");
}

function getOpenChecklistNotes() {
  return checklists.flatMap((list, listIndex) => (
    list.items.map((item, itemIndex) => {
      const id = `list-${listIndex}-item-${itemIndex}`;
      const note = getSaved(`${id}-note`).trim();
      const done = getSaved(id) === "true";
      return note && !done ? `${item}: ${note}` : "";
    })
  )).filter(Boolean).slice(0, 10);
}

function buildMentorAdvice(checklistSummary, lineSummary, ratingSummary, totalProgress) {
  const lowRatings = ratingSummary.filter((item) => item.value < 70);
  const strongRatings = ratingSummary.filter((item) => item.value >= 80);
  const improvedRatings = ratingSummary.filter((item) => item.difference > 0);
  const declinedRatings = ratingSummary.filter((item) => item.difference < 0);
  const checklistPercentage = checklistSummary.percentage;
  const lineStepPercentage = lineSummary.totalSteps ? Math.round((lineSummary.doneSteps / lineSummary.totalSteps) * 100) : 0;
  const parts = [];

  if (totalProgress.open === 0) {
    parts.push("Alle onderdelen zijn afgerond en de mentorperiode is compleet vastgelegd.");
  } else if (totalProgress.percentage >= 80) {
    parts.push(`De voortgang is ruim op weg: ${totalProgress.percentage}% van alle onderdelen is afgerond.`);
  } else if (totalProgress.percentage >= 50) {
    parts.push(`De voortgang is zichtbaar in ontwikkeling: ${totalProgress.percentage}% van alle onderdelen is afgerond.`);
  } else {
    parts.push(`De voortgang staat nog in de opbouwfase met ${totalProgress.percentage}% afgeronde onderdelen.`);
  }

  if (lineSummary.openLines.length) {
    parts.push(`Bij de lijnverkenning is ${lineStepPercentage}% van de lijnonderdelen afgevinkt; er staan nog ${lineSummary.openLines.length} lijnen open.`);
  } else {
    parts.push("De lijnverkenning is volledig afgerond.");
  }

  if (checklistSummary.open) {
    parts.push(`De aftekenlijsten staan op ${checklistPercentage}%, waardoor er nog checklistpunten afgerond moeten worden.`);
  } else {
    parts.push("Alle aftekenlijsten zijn volledig afgetekend.");
  }

  if (lowRatings.length) {
    parts.push(`De beoordelingen laten zien dat ${lowRatings.map((item) => item.label).join(", ")} nog onder het gewenste niveau zit.`);
  } else if (strongRatings.length) {
    parts.push(`De sterkste punten op dit moment zijn ${strongRatings.map((item) => item.label).join(", ")}.`);
  } else if (ratingSummary.length) {
    parts.push("De beoordelingen geven een stabiel middenbeeld zonder grote uitschieters.");
  }

  if (declinedRatings.length) {
    parts.push(`Let op: ${declinedRatings.map((item) => item.label).join(", ")} is gedaald ten opzichte van het eerste meetpunt.`);
  } else if (improvedRatings.length) {
    parts.push(`Positief is dat ${improvedRatings.map((item) => item.label).join(", ")} verbetering laat zien.`);
  }

  return parts.join("\n\n");
}

function buildMentorClosingLine(totalProgress, lineSummary, ratingSummary) {
  const lowRatings = ratingSummary.filter((item) => item.value < 60);
  const lineStepPercentage = lineSummary.totalSteps ? Math.round((lineSummary.doneSteps / lineSummary.totalSteps) * 100) : 0;

  if (totalProgress.open === 0) {
    return "Alles is afgevinkt. De chauffeur kan beginnen met zelfstandig ingezet worden.";
  }

  if (lowRatings.length || lineStepPercentage < 40) {
    return "Bij de volgende update is het belangrijk om vooral deze aandachtspunten opnieuw te beoordelen.";
  }

  if (totalProgress.percentage >= 75) {
    return "Volgende week kan de laatste voortgang gericht worden aangevuld.";
  }

  return "Volgende week volgt een nieuwe update van de voortgang.";
}

function lineTaskId(line, type) {
  return `line-${line.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${type}`;
}

function lineTaskLabel(type) {
  return type === "mat" ? "MAT" : type.charAt(0).toUpperCase() + type.slice(1);
}

function getLineSummary() {
  return lines.map((line) => {
    const states = ["heen", "terug", "mat", "klaar"].map((type) => ({
      type,
      done: getSaved(lineTaskId(line, type)) === "true",
    }));

    return {
      line,
      states,
      done: states.every((state) => state.done),
    };
  });
}

function getSortedLineSummary() {
  return getLineSummary().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.line.localeCompare(b.line, "nl", { numeric: true, sensitivity: "base" });
  });
}

function openLineSummary() {
  const modal = document.getElementById("lineSummaryModal");
  const content = document.getElementById("lineSummaryContent");
  const summary = getSortedLineSummary();
  const doneLines = summary.filter((item) => item.done);
  const todoLines = summary.filter((item) => !item.done);

  content.innerHTML = `
    <div class="row g-3">
      ${renderLineSummaryColumn("Nog te doen", todoLines, "warning")}
      ${renderLineSummaryColumn("Afgevinkt", doneLines, "success")}
    </div>
  `;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("zoom-open");
  document.getElementById("lineSummaryClose").focus();
}

function renderLineSummaryColumn(title, items, tone) {
  const emptyText = tone === "success" ? "Nog geen lijnen afgevinkt." : "Alle lijnen zijn afgevinkt.";
  return `
    <div class="col-12 col-lg-6">
      <div class="line-summary-card">
        <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
          <h3 class="h6 fw-bold mb-0">${title}</h3>
          <span class="status-pill">${items.length}</span>
        </div>
        ${
          items.length
            ? `<div class="vstack gap-2">
                ${items.map(renderLineSummaryItem).join("")}
              </div>`
            : `<p class="text-secondary mb-0">${emptyText}</p>`
        }
      </div>
    </div>
  `;
}

function renderLineSummaryItem(item) {
  const stateLabels = item.states.map((state) => `
    <span class="line-state ${state.done ? "done" : ""}">${lineTaskLabel(state.type)}</span>
  `).join("");

  return `
    <div class="line-summary-item">
      <strong>${item.line}</strong>
      <div class="line-states">${stateLabels}</div>
    </div>
  `;
}

function closeLineSummary() {
  const modal = document.getElementById("lineSummaryModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("zoom-open");
}

function getRatingHistory(input) {
  const history = getStoredRatingHistory(input);
  if (history.length) {
    return history;
  }

  return [
    {
      time: Date.now(),
      value: getRatingScore(input),
      ...(input.dataset.ratingType === "balance" ? { position: Math.round(Number(input.value)) } : {}),
    },
  ];
}

function getStoredRatingHistory(input) {
  return getSavedJson(`${input.dataset.id}-history`, []).map((entry) => ({
    ...entry,
    value: normalizeHistoryScore(input, entry),
  }));
}

function normalizeHistoryScore(input, entry) {
  const numericValue = Number(typeof entry === "object" ? entry.value : entry);
  if (!Number.isFinite(numericValue)) return 0;
  if (typeof entry === "object" && entry.scoreVersion === 2) {
    return Math.max(0, Math.min(100, Math.round(numericValue)));
  }

  if (numericValue > 10) return Math.max(0, Math.min(100, Math.round(numericValue)));

  if (input.dataset.ratingType === "balance") {
    const percentPosition = ((Math.max(1, Math.min(9, numericValue)) - 1) / 8) * 100;
    return Math.max(0, Math.round(100 - (Math.abs(percentPosition - 50) / 50) ** 2 * 100));
  }

  return Math.round(Math.max(0, Math.min(10, numericValue)) * 10);
}

function saveRatingHistory(input, force = false, timestamp = Date.now()) {
  const history = getStoredRatingHistory(input);
  const value = getRatingScore(input);
  const last = history[history.length - 1];

  if (!force && last && last.value === value && isSameDay(last.time, timestamp)) return;

  const withoutSelectedDay = history.filter((entry) => !isSameDay(entry.time, timestamp));
  withoutSelectedDay.push({
    time: timestamp,
    value,
    scoreVersion: 2,
    ...(input.dataset.ratingType === "balance" ? { position: Math.round(Number(input.value)) } : {}),
  });

  const sortedHistory = withoutSelectedDay
    .sort((first, second) => first.time - second.time)
    .slice(-30);
  setSavedJson(`${input.dataset.id}-history`, sortedHistory);
}

function saveAllRatingHistories() {
  const timestamp = getSelectedRatingTimestamp();
  if (!timestamp) {
    showRatingSaveStatus(null, "Vul een geldige datum in.");
    return;
  }

  addSavedRatingDay(getDayKey(timestamp));
  document.querySelectorAll(".rating-range").forEach((input) => {
    saveRatingHistory(input, true, timestamp);
  });
  showRatingSaveStatus(timestamp, `Rijlesdag opgeslagen: ${formatDayLabel(timestamp)}`);
  updateRatingAverage();
  renderRatingDayLog();
  renderRatingProgressTable();
}

function showRatingSaveStatus(timestamp, text) {
  const status = document.getElementById("ratingSaveStatus");
  if (!status) return;

  status.textContent = text || `Opgeslagen: ${formatDayLabel(timestamp)}`;
  window.setTimeout(() => {
    if (status.textContent === (text || `Opgeslagen: ${formatDayLabel(timestamp)}`)) {
      status.textContent = "";
    }
  }, 3500);
}

function getSelectedRatingTimestamp() {
  const input = document.getElementById("ratingDateInput");
  return parseRatingDateValue(input?.value);
}

function setDefaultRatingDate() {
  const input = document.getElementById("ratingDateInput");
  if (!input) return;

  input.value = formatDateInputValue(Date.now());
}

function formatDateInputValue(timestamp) {
  if (typeof timestamp === "string" && /^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
    return timestamp.split("-").reverse().join("-");
  }

  const date = new Date(timestamp);
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("-");
}

function isSameDay(firstTimestamp, secondTimestamp) {
  const first = new Date(firstTimestamp);
  const second = new Date(secondTimestamp);
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function renderLineGraph(history, maxValue) {
  const width = 240;
  const height = 112;
  const paddingLeft = 28;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;
  const points = history.map((entry, index) => {
    const x = history.length === 1
      ? paddingLeft + (width - paddingLeft - paddingRight) / 2
      : paddingLeft + (index / (history.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - paddingBottom - (entry.value / maxValue) * (height - paddingTop - paddingBottom);
    return { x, y };
  });
  const linePath = points.map((point, index) => (
    `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
  )).join(" ");
  const lineMarkup = points.length > 1
    ? `<path class="line-chart-line" d="${linePath}" />`
    : `<line class="line-chart-single-line" x1="${paddingLeft}" y1="${points[0].y}" x2="${width - paddingRight}" y2="${points[0].y}" />`;
  const helperText = points.length > 1
    ? ""
    : `<text class="line-chart-help" x="${paddingLeft + 6}" y="${paddingTop + 14}">sla nog een meetpunt op</text>`;
  const xLabels = points.map((point, index) => {
    const label = formatDayLabel(history[index].time);
    return `<text class="line-chart-x-label" x="${point.x}" y="${height - 4}">${label}</text>`;
  }).join("");
  const midValue = Math.ceil(maxValue / 2);
  const midY = height - paddingBottom - (midValue / maxValue) * (height - paddingTop - paddingBottom);

  return `
    <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Progressielijn">
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${paddingTop}" x2="${width - paddingRight}" y2="${paddingTop}" />
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${midY}" x2="${width - paddingRight}" y2="${midY}" />
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" />
      <text class="line-chart-y-label" x="4" y="${paddingTop + 3}">${maxValue}%</text>
      <text class="line-chart-y-label" x="4" y="${midY + 3}">${midValue}%</text>
      <text class="line-chart-y-label" x="4" y="${height - paddingBottom + 3}">0%</text>
      ${lineMarkup}
      ${points.map((point) => `<circle class="line-chart-point" cx="${point.x}" cy="${point.y}" r="4.5" />`).join("")}
      ${xLabels}
      ${helperText}
    </svg>
  `;
}

function renderBalancePointGraph(history, input) {
  const width = 240;
  const height = 112;
  const paddingLeft = 28;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;
  const maxValue = 100;
  const points = history.map((entry, index) => {
    const x = history.length === 1
      ? paddingLeft + (width - paddingLeft - paddingRight) / 2
      : paddingLeft + (index / (history.length - 1)) * (width - paddingLeft - paddingRight);
    if (!Number.isFinite(Number(entry.value))) {
      return { x, y: null, label: "", letter: "", missing: true };
    }
    const y = height - paddingBottom - (entry.value / maxValue) * (height - paddingTop - paddingBottom);
    const label = Number.isFinite(Number(entry.position))
      ? getBalanceEntryLabel(entry)
      : getBalancePositionLabel(Number(input.value));
    return { x, y, label, letter: getBalanceLabelLetter(label) };
  });
  const visiblePoints = points.filter((point) => !point.missing);
  const helperText = visiblePoints.length > 1
    ? ""
    : `<text class="line-chart-help" x="${paddingLeft + 6}" y="${paddingTop + 14}">sla nog een meetpunt op</text>`;
  const xLabels = points.map((point, index) => {
    const label = formatDayLabel(history[index].time);
    return `<text class="line-chart-x-label" x="${point.x}" y="${height - 4}">${label}</text>`;
  }).join("");
  const midY = height - paddingBottom - 0.5 * (height - paddingTop - paddingBottom);

  return `
    <svg class="line-chart-svg balance-point-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Puntengrafiek balans">
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${paddingTop}" x2="${width - paddingRight}" y2="${paddingTop}" />
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${midY}" x2="${width - paddingRight}" y2="${midY}" />
      <line class="line-chart-grid" x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" />
      <text class="line-chart-y-label" x="4" y="${paddingTop + 3}">100</text>
      <text class="line-chart-y-label" x="4" y="${midY + 3}">50</text>
      <text class="line-chart-y-label" x="4" y="${height - paddingBottom + 3}">0</text>
      ${visiblePoints.map((point) => `
        <g class="balance-point" aria-label="${escapeHtml(point.label)}">
          <text class="balance-point-letter" x="${point.x}" y="${point.y}">${point.letter}</text>
        </g>
      `).join("")}
      ${xLabels}
      ${helperText}
    </svg>
  `;
}

function getBalanceLabelLetter(label) {
  const letters = {
    Angstvallig: "A",
    Onzeker: "O",
    Zelfverzekerd: "Z",
    Lichtzinnig: "L",
    Roekeloos: "R",
  };

  return letters[label] || "?";
}

function formatDayLabel(timestamp) {
  return new Date(timestamp).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
  });
}

function showSection(targetSelector) {
  document.querySelectorAll(".app-menu [data-section]").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === targetSelector);
  });

  document.querySelectorAll(".tab-pane").forEach((pane) => {
    const isTarget = `#${pane.id}` === targetSelector;
    pane.classList.toggle("show", isTarget);
    pane.classList.toggle("active", isTarget);
  });

  document.querySelector(targetSelector)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function setPrintText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || "-";
}

function buildPrintSummary(target = "dashboard") {
  currentPrintTarget = target;
  const summary = document.getElementById("printSummary");
  if (!summary) return;

  const builders = {
    complete: buildPrintCompleteHtml,
    closure: buildPrintClosureHtml,
    driver: buildPrintDriverHtml,
    checklist: buildPrintChecklistHtml,
    dashboard: buildPrintDashboardHtml,
    ai: buildPrintAiHtml,
    info: buildPrintInfoHtml,
    lines: buildPrintLinesHtml,
  };

  summary.innerHTML = (builders[target] || builders.dashboard)();
}

function printMentorSection(target) {
  buildPrintSummary(target);
  window.print();
}

function buildPrintCompleteHtml() {
  return `
    <section class="print-page">${buildPrintDriverHtml()}</section>
    <section class="print-page">${buildPrintDashboardHtml()}</section>
    <section class="print-page">${buildPrintAiHtml()}</section>
  `;
}

function buildPrintClosureHtml() {
  return `
    <div class="closure-print">
      <section class="print-page">${buildPrintDriverHtml("Afsluiting Mentorfase - Chauffeursinformatie")}</section>
      <section class="print-page">${buildPrintChecklistHtml("Afsluiting Mentorfase - Checklist", true)}</section>
      <section class="print-page">${buildPrintInfoHtml("Afsluiting Mentorfase - Info", true, true)}</section>
      <section class="print-page">${buildPrintLinesHtml("Afsluiting Mentorfase - Lijnverkenning", true)}</section>
    </div>
  `;
}

function buildPrintHeader(title) {
  return `
    <div class="print-summary-header">
      <div>
        <p>Mentormap nieuwe chauffeurs</p>
        <h1>${escapeHtml(title)}</h1>
      </div>
      <strong>${new Date().toLocaleDateString("nl-NL")}</strong>
    </div>
  `;
}

function buildPrintDriverHtml(title = "Chauffeursinformatie") {
  const driverSignature = getSaved("driverSignature");
  const mentorSignature = getSaved("mentorSignature");
  const managerSignature = getSaved("managerSignature");

  return `
    ${buildPrintHeader(title)}
    <div class="print-grid">
      <div class="print-panel">
        <h2>Chauffeur</h2>
        ${buildPrintDriverDetails()}
      </div>
      <div class="print-panel">
        <h2>Handtekeningen</h2>
        <div class="print-signature-stack">
          <div>
            <span>Chauffeur</span>
            ${driverSignature ? `<img src="${escapeHtml(driverSignature)}" alt="Handtekening chauffeur" />` : `<div class="print-signature-empty">-</div>`}
          </div>
          <div>
            <span>Mentor</span>
            ${mentorSignature ? `<img src="${escapeHtml(mentorSignature)}" alt="Handtekening mentor" />` : `<div class="print-signature-empty">-</div>`}
          </div>
          <div>
            <span>Leidinggevende</span>
            ${managerSignature ? `<img src="${escapeHtml(managerSignature)}" alt="Handtekening leidinggevende" />` : `<div class="print-signature-empty">-</div>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildPrintChecklistHtml(title = "Checklist", compact = false) {
  const checklistPanels = checklists.map((list, listIndex) => {
    const rows = list.items.map((item, itemIndex) => {
      const id = `list-${listIndex}-item-${itemIndex}`;
      const done = getSaved(id) === "true";
      const note = getSaved(`${id}-note`);
      if (compact) {
        return `
          <div class="closure-check-item ${done ? "done" : ""}">
            <span>${done ? "V" : "-"}</span>
            <strong>${escapeHtml(item)}</strong>
            ${note ? `<em>${escapeHtml(note)}</em>` : ""}
          </div>
        `;
      }
      return `
        <tr>
          <td>${done ? "Afgevinkt" : "Open"}</td>
          <td>${escapeHtml(item)}</td>
          <td>${escapeHtml(note || "-")}</td>
        </tr>
      `;
    }).join("");
    const doneCount = list.items.filter((_, itemIndex) => getSaved(`list-${listIndex}-item-${itemIndex}`) === "true").length;

    if (compact) {
      return `
        <div class="print-panel closure-check-panel">
          <h2>${escapeHtml(list.title)} (${doneCount}/${list.items.length})</h2>
          <div class="closure-check-list">${rows}</div>
        </div>
      `;
    }

    return `
      <div class="print-panel">
        <h2>${escapeHtml(list.title)} (${doneCount}/${list.items.length})</h2>
        <table class="print-table">
          <thead><tr><th>Status</th><th>Onderdeel</th><th>Notitie</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }).join("");

  return `
    ${buildPrintHeader(title)}
    <div class="${compact ? "closure-check-grid" : ""}">${checklistPanels}</div>
    ${buildPrintSectionSignatures("Ondertekening checklist", "checklistDriverSignature", "checklistMentorSignature")}
  `;
}

function buildPrintDriverDetails() {
  return `
    <dl class="print-details">
      <div><dt>Naam</dt><dd>${escapeHtml(getSaved("driverName") || getActiveDriverProfile()?.name || "-")}</dd></div>
      <div><dt>Personeelsnummer</dt><dd>${escapeHtml(getSaved("personnelNumber") || "-")}</dd></div>
      <div><dt>Startdatum</dt><dd>${escapeHtml(getSaved("startDate") || "-")}</dd></div>
      <div><dt>Einddatum</dt><dd>${escapeHtml(getSaved("endDate") || "-")}</dd></div>
      <div><dt>Mentor</dt><dd>${escapeHtml(getSaved("mentorName") || "-")}</dd></div>
      <div><dt>Leidinggevende</dt><dd>${escapeHtml(getSaved("managerName") || "-")}</dd></div>
    </dl>
  `;
}

function buildPrintSignatureMetaPanel() {
  return `
    <div class="print-panel">
      <h2>Gegevens</h2>
      ${buildPrintDriverDetails()}
    </div>
  `;
}

function buildPrintSectionSignatures(title, driverSignatureId, mentorSignatureId) {
  const driverSignature = getSaved(driverSignatureId);
  const mentorSignature = getSaved(mentorSignatureId);
  const driverName = getSaved("driverName") || getActiveDriverProfile()?.name || "-";
  const mentorName = getSaved("mentorName") || "-";
  const endDate = formatSignatureDate(getSaved("endDate"));

  return `
    <div class="print-panel print-section-signatures">
      <h2>${escapeHtml(title)}</h2>
      <p class="print-signature-date">Datum: ${escapeHtml(endDate)}</p>
      <div class="print-signature-stack print-signature-stack-two">
        <div>
          <span>Chauffeur</span>
          <strong class="print-signature-name">${escapeHtml(driverName)}</strong>
          ${driverSignature ? `<img src="${escapeHtml(driverSignature)}" alt="Handtekening chauffeur" />` : `<div class="print-signature-empty">-</div>`}
        </div>
        <div>
          <span>Mentor</span>
          <strong class="print-signature-name">${escapeHtml(mentorName)}</strong>
          ${mentorSignature ? `<img src="${escapeHtml(mentorSignature)}" alt="Handtekening mentor" />` : `<div class="print-signature-empty">-</div>`}
        </div>
      </div>
    </div>
  `;
}

function buildPrintDashboardHtml() {
  updateProgress();
  updateRatingAverage();
  const dashboard = document.querySelector(".dashboard-panel")?.cloneNode(true);
  if (!dashboard) {
    return `${buildPrintHeader("Dashboard")}<p>Dashboard niet gevonden.</p>`;
  }

  dashboard.querySelectorAll("button").forEach((button) => {
    const replacement = document.createElement("div");
    replacement.className = button.className;
    replacement.innerHTML = button.innerHTML;
    button.replaceWith(replacement);
  });
  dashboard.querySelectorAll("[tabindex], [role], [aria-label]").forEach((element) => {
    element.removeAttribute("tabindex");
    element.removeAttribute("role");
    element.removeAttribute("aria-label");
  });
  dashboard.querySelectorAll(".chart-zoom, .dropdown-menu").forEach((element) => element.remove());
  dashboard.querySelectorAll(".donut-chart").forEach((donut) => {
    const percentText = donut.querySelector("strong")?.textContent || "0%";
    const percentage = Math.max(0, Math.min(100, Number.parseInt(percentText, 10) || 0));
    donut.outerHTML = buildPrintDonutSvg(percentage);
  });
  const balanceChart = dashboard.querySelector(".balance-point-chart")?.closest(".line-chart-item");
  const balanceTitle = balanceChart?.querySelector(".line-chart-title");
  if (balanceTitle && !balanceTitle.textContent.includes("*")) {
    balanceTitle.textContent = `${balanceTitle.textContent} *`;
  }

  return `
    ${buildPrintHeader("Dashboard")}
    <div class="print-web-dashboard">${dashboard.outerHTML}${buildPrintBalanceLegend()}</div>
  `;
}

function buildPrintBalanceLegend() {
  return `
    <div class="print-balance-legend">
      <strong>* Legenda balansgrafiek:</strong>
      <span>A = Angstvallig</span>
      <span>O = Onzeker</span>
      <span>Z = Zelfverzekerd</span>
      <span>L = Lichtzinnig</span>
      <span>R = Roekeloos</span>
    </div>
  `;
}

function buildPrintDonutSvg(percentage) {
  const radius = 39;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage / 100) * circumference;

  return `
    <svg class="print-donut-svg" viewBox="0 0 100 100" role="img" aria-label="${percentage}% totaal">
      <circle class="print-donut-track" cx="50" cy="50" r="${radius}" />
      <circle class="print-donut-fill" cx="50" cy="50" r="${radius}" stroke-dasharray="${dash.toFixed(2)} ${circumference.toFixed(2)}" />
      <text class="print-donut-value" x="50" y="48">${percentage}%</text>
      <text class="print-donut-label" x="50" y="62">totaal</text>
    </svg>
  `;
}

function buildPrintAiHtml() {
  const text = getSaved("mentorGeneratedText") || document.getElementById("mentorGeneratedText")?.value || buildMentorGeneratedText();

  return `
    ${buildPrintHeader("Tekst over chauffeur")}
    <div class="print-panel">
      <div class="print-ai-text">${formatMentorTextForPrint(text)}</div>
    </div>
  `;
}

function formatMentorTextForPrint(text) {
  const headingPattern = /^(\d+\.\s+)?(MENTORVERSLAG.*|VOORTGANG|AFTEKENLIJSTEN|OPEN LIJNEN|BEOORDELINGEN|AANDACHT|NOTITIES|CONCLUSIE)$/i;
  return text
    .split("\n")
    .map((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return `<div class="print-ai-spacer"></div>`;
      if (headingPattern.test(cleanLine)) return `<h3>${escapeHtml(cleanLine)}</h3>`;
      if (cleanLine.startsWith("- ")) return `<p class="print-ai-bullet">${escapeHtml(cleanLine.slice(2))}</p>`;
      if (line.includes("    ")) return `<p class="line-column-row">${escapeHtml(line)}</p>`;
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("");
}

function getCompactPrintAiText() {
  const text = getSaved("mentorGeneratedText") || document.getElementById("mentorGeneratedText")?.value || buildMentorGeneratedText();
  const compact = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  return compact.length > 620 ? `${compact.slice(0, 617)}...` : compact;
}

function buildPrintInfoHtml(title = "Informatie", compact = false, includeSignatures = false) {
  const contactRows = contacts.map(([role, name, phone, whatsapp]) => `
    <tr>
      <td>${escapeHtml(role)}</td>
      <td>${escapeHtml(name || "-")}</td>
      <td>${escapeHtml(phone || "-")}</td>
      <td>${escapeHtml(whatsapp || "-")}</td>
    </tr>
  `).join("");
  const websiteRows = websites.map(([label, text, url]) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(text)}</td>
      <td>${escapeHtml(url || "-")}</td>
    </tr>
  `).join("");

  return `
    ${buildPrintHeader(title)}
    <div class="${compact ? "closure-info-grid" : ""}">
    <div class="print-panel">
      <h2>Belangrijke telefoonnummers</h2>
      <table class="print-table">
        <thead><tr><th>Functie</th><th>Naam</th><th>Telefoon</th><th>WhatsApp</th></tr></thead>
        <tbody>${contactRows}</tbody>
      </table>
    </div>
    <div class="print-panel">
      <h2>Websites en apps</h2>
      <table class="print-table">
        <thead><tr><th>Naam</th><th>Omschrijving</th><th>Link</th></tr></thead>
        <tbody>${websiteRows}</tbody>
      </table>
    </div>
    </div>
    ${includeSignatures ? buildPrintSectionSignatures("Ondertekening info", "infoDriverSignature", "infoMentorSignature") : ""}
  `;
}

function buildPrintLinesHtml(title = "Chauffeursgegevens en lijnverkenning", includeSignatures = false) {
  const summary = getSortedLineSummary();
  const todoLines = summary.filter((item) => !item.done);
  const doneLines = summary.filter((item) => item.done);

  return `
    ${buildPrintHeader(title)}
    <div class="print-grid print-line-overview">
      ${renderPrintLineOverviewColumn("Lijnen nog te doen", todoLines)}
      ${renderPrintLineOverviewColumn("Lijnen afgevinkt", doneLines)}
    </div>
    ${includeSignatures ? buildPrintSectionSignatures("Ondertekening lijnverkenning", "lineDriverSignature", "lineMentorSignature") : ""}
  `;
}

function renderPrintLineOverviewColumn(title, items) {
  return `
    <div class="print-panel">
      <h2>${escapeHtml(title)} (${items.length})</h2>
      ${
        items.length
          ? `<div class="print-line-list">${items.map((item) => `<span>${escapeHtml(item.line)}</span>`).join("")}</div>`
          : `<p class="text-secondary mb-0">Geen lijnen.</p>`
      }
    </div>
  `;
}

function getDashboardPdfFileName() {
  const driverName = (getSaved("driverName") || getActiveDriverProfile()?.name || "chauffeur")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `mentormap-dashboard-${driverName || "chauffeur"}.pdf`;
}

async function createDashboardPdfFile() {
  buildPrintSummary();
  if (window.html2canvas && window.jspdf?.jsPDF) {
    return createDashboardScreenshotPdfFile();
  }

  return new File([createDashboardPdfBlob()], getDashboardPdfFileName(), {
    type: "application/pdf",
  });
}

async function createDashboardScreenshotPdfFile() {
  const dashboard = document.querySelector(".dashboard-panel");
  if (!dashboard) {
    throw new Error("Dashboard not found.");
  }

  const canvas = await window.html2canvas(dashboard, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
  });
  const pdf = new window.jspdf.jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const titleHeight = 34;
  const imageWidth = pageWidth - margin * 2;
  const imageHeight = Math.min(
    pageHeight - margin * 2 - titleHeight,
    (canvas.height / canvas.width) * imageWidth
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Mentormap dashboard", margin, margin + 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(new Date().toLocaleDateString("nl-NL"), pageWidth - margin, margin + 12, { align: "right" });
  pdf.addImage(
    canvas.toDataURL("image/jpeg", 0.95),
    "JPEG",
    margin,
    margin + titleHeight,
    imageWidth,
    imageHeight
  );

  return new File([pdf.output("blob")], getDashboardPdfFileName(), {
    type: "application/pdf",
  });
}

function createDashboardPdfBlob() {
  const lines = buildDashboardPdfLines();
  const content = buildPdfContent(lines);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function buildDashboardPdfLines() {
  const checks = [...document.querySelectorAll(".task-check")];
  const done = checks.filter((input) => input.checked).length;
  const percentage = checks.length ? Math.round((done / checks.length) * 100) : 0;
  const lineSummary = getLineSummary();
  const openLines = lineSummary.filter((item) => !item.done).length;
  const checklistRows = checklists.map((list, listIndex) => {
    const listChecks = [...document.querySelectorAll(`[data-id^="list-${listIndex}-item-"]`)];
    const listDone = listChecks.filter((input) => input.checked).length;
    return `${list.title}: ${listDone}/${list.items.length}`;
  });
  const ratingRows = [...document.querySelectorAll(".rating-range")].map((input) => {
    const label = input.closest(".rating-row").querySelector(".rating-label").textContent;
    return `${label}: ${getRatingScore(input)}%`;
  });

  return [
    "Mentormap nieuwe chauffeurs Nijmegen",
    "Dashboard en chauffeursgegevens",
    `Datum: ${new Date().toLocaleDateString("nl-NL")}`,
    "",
    "Chauffeur",
    `Naam: ${getSaved("driverName") || getActiveDriverProfile()?.name || "-"}`,
    `Personeelsnummer: ${getSaved("personnelNumber") || "-"}`,
    `Startdatum: ${getSaved("startDate") || "-"}`,
    `Einddatum: ${getSaved("endDate") || "-"}`,
    `Mentor: ${getSaved("mentorName") || "-"}`,
    "",
    "Voortgang",
    `Totaal afgerond: ${percentage}%`,
    `Taken open: ${checks.length - done}`,
    `Taken klaar: ${done}`,
    `Lijnen open: ${openLines}`,
    "",
    "Aftekenlijsten",
    ...checklistRows,
    "",
    "Beoordeling",
    ...ratingRows,
  ];
}

function buildPdfContent(lines) {
  const wrappedLines = lines.flatMap((line) => wrapPdfLine(line, 78));
  const commands = ["BT", "/F1 11 Tf", "50 792 Td", "14 TL"];
  wrappedLines.slice(0, 52).forEach((line, index) => {
    if (index > 0) commands.push("T*");
    commands.push(`(${escapePdfText(line)}) Tj`);
  });
  commands.push("ET");
  return commands.join("\n");
}

function wrapPdfLine(line, maxLength) {
  if (!line) return [""];
  const words = String(line).split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function escapePdfText(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function downloadFile(file) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function canShareFile(file) {
  return Boolean(navigator.canShare?.({ files: [file] }) && navigator.share);
}

async function shareDashboardPdf(target) {
  let file;
  try {
    file = await createDashboardPdfFile();
  } catch (error) {
    window.alert("De PDF kon niet worden gemaakt. Controleer of je internetverbinding actief is en probeer het opnieuw.");
    return;
  }

  const driverName = getSaved("driverName") || getActiveDriverProfile()?.name || "de chauffeur";
  const text = `Dashboard mentormap voor ${driverName}. De PDF staat als bijlage.`;

  if (canShareFile(file)) {
    try {
      await navigator.share({
        title: "Mentormap dashboard",
        text,
        files: [file],
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  downloadFile(file);
  if (target === "email") {
    const subject = encodeURIComponent("Mentormap dashboard PDF");
    const body = encodeURIComponent(
      `Hallo,\n\nIk heb de PDF ${file.name} gedownload. Voeg deze PDF toe als bijlage.\n\n${text}\n\nGroet,`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    return;
  }

  openWhatsappText(`${text}\n\nDe PDF ${file.name} is gedownload. Voeg deze toe via de paperclip / Document in WhatsApp.`);
}

async function shareDashboardPdfByWhatsapp() {
  const driverName = getSaved("driverName") || getActiveDriverProfile()?.name || "de chauffeur";
  const fileName = getDashboardPdfFileName();
  const text = `Dashboard mentormap voor ${driverName}.\n\nDe PDF ${fileName} wordt gedownload. Voeg deze toe via de paperclip / Document in WhatsApp.`;

  openWhatsappText(text);

  try {
    const file = await createDashboardPdfFile();
    downloadFile(file);
  } catch (error) {
    window.setTimeout(() => {
      window.alert("WhatsApp is geopend, maar de PDF kon niet worden gemaakt. Probeer het opnieuw.");
    }, 500);
  }
}

function setPrintSignature(id, source) {
  const image = document.getElementById(id);
  if (source) {
    image.src = source;
    image.style.visibility = "visible";
  } else {
    image.removeAttribute("src");
    image.style.visibility = "hidden";
  }
}

function buildInfoShareText() {
  const phoneRows = contacts.map(([role, name, phone, whatsapp]) => {
    const lines = [
      role,
      name ? `Naam: ${name}` : "",
      phone ? `Telefoon: ${phone} (${makePhoneLink(phone)})` : "",
      whatsapp ? `WhatsApp: ${whatsapp}\nOpen WhatsApp: ${makeWhatsappLink(whatsapp)}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  });

  const websiteRows = websites.map(([label, text, url]) => {
    return `${label}\n${text}${url ? `\n${url}` : ""}`;
  });

  return [
    "Mentormap Nijmegen - info",
    "",
    "BELANGRIJKE TELEFOONNUMMERS",
    "",
    phoneRows.join("\n\n"),
    "",
    "BELANGRIJKE EN HANDIGE WEBSITES",
    "",
    websiteRows.join("\n\n"),
    "",
    "Tip: tik op een tel:-link om te bellen, op een wa.me-link om WhatsApp te openen, of op een website-link om de pagina te openen.",
  ].join("\n");
}

function buildInfoWhatsappText() {
  const phoneRows = contacts.map(([role, name, phone, whatsapp]) => {
    const lines = [
      role,
      name ? `Naam: ${name}` : "",
      phone ? `Telefoon: ${phone} / +${normalizePhoneNumber(phone)}` : "",
      whatsapp ? `WhatsApp: ${whatsapp} / ${makeWhatsappLink(whatsapp)}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  });

  const websiteRows = websites.map(([label, text, url]) => (
    `${label}\n${url || text}`
  ));

  return [
    "Mentormap Nijmegen - info",
    "",
    "TELEFOONNUMMERS",
    "",
    phoneRows.join("\n\n"),
    "",
    "WEBSITES EN APPS",
    "",
    websiteRows.join("\n\n"),
  ].join("\n");
}

function buildInfoShareHtml() {
  const contactRows = contacts.map(([role, name, phone, whatsapp]) => `
    <tr>
      <td>${escapeHtml(role)}</td>
      <td>${escapeHtml(name || "-")}</td>
      <td>${phone ? `<a href="${makePhoneLink(phone)}">${escapeHtml(phone)}</a>` : "-"}</td>
      <td>${whatsapp ? `<a href="${makeWhatsappLink(whatsapp)}">${escapeHtml(whatsapp)}</a>` : "-"}</td>
    </tr>
  `).join("");

  const websiteRows = websites.map(([label, text, url]) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(text)}</td>
      <td>${url ? `<a href="${url}">${escapeHtml(url)}</a>` : "-"}</td>
    </tr>
  `).join("");

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>Mentormap Nijmegen - info</title>
  <style>
    body { font-family: Arial, sans-serif; color: #18241c; margin: 24px; }
    h1 { color: #385f15; margin-bottom: 8px; }
    h2 { margin-top: 28px; color: #385f15; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #dce5dc; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #54851f; color: #ffffff; }
    a { color: #0b5ed7; }
  </style>
</head>
<body>
  <h1>Mentormap Nijmegen - info</h1>
  <p>Belangrijke telefoonnummers en handige websites.</p>

  <h2>Belangrijke telefoonnummers</h2>
  <table>
    <thead>
      <tr><th>Functie</th><th>Naam</th><th>Telefoon</th><th>WhatsApp</th></tr>
    </thead>
    <tbody>${contactRows}</tbody>
  </table>

  <h2>Websites en apps</h2>
  <table>
    <thead>
      <tr><th>Naam</th><th>Omschrijving</th><th>Link</th></tr>
    </thead>
    <tbody>${websiteRows}</tbody>
  </table>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character]));
}

function downloadInfoAttachment(file) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function shareInfoByEmail() {
  const file = createInfoAttachment();

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "Mentormap Nijmegen - info",
        text: "Bijgevoegd staat de info uit de mentormap in een tabel.",
        files: [file],
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  downloadInfoAttachment(file);
  const subject = encodeURIComponent("Mentormap Nijmegen - belangrijke info");
  const body = encodeURIComponent(
    "Hallo,\n\nIk heb het bestand mentormap-nijmegen-info.html gedownload. Voeg dit bestand toe als bijlage; daarin staan de telefoonnummers en websites netjes in tabellen.\n\nGroet,"
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function createInfoAttachment() {
  return new File([buildInfoShareHtml()], "mentormap-nijmegen-info.html", {
    type: "text/html",
  });
}

function normalizePhoneNumber(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("31")) return digits;
  if (digits.startsWith("0")) return `31${digits.slice(1)}`;
  return digits;
}

function makePhoneLink(number) {
  return `tel:+${normalizePhoneNumber(number)}`;
}

function makeWhatsappLink(number) {
  return `https://wa.me/${normalizePhoneNumber(number)}`;
}

async function shareInfoByWhatsapp() {
  const text = buildInfoWhatsappText();
  openWhatsappText(text);
}

function openWhatsappText(text) {
  const appUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
  const webUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  let fallbackTimer;

  const cancelFallback = () => window.clearTimeout(fallbackTimer);
  window.addEventListener("pagehide", cancelFallback, { once: true });
  window.addEventListener("blur", cancelFallback, { once: true });

  fallbackTimer = window.setTimeout(() => {
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }, 1200);

  window.location.href = appUrl;
}

function isInfoSectionActive() {
  return document.getElementById("tab-info")?.classList.contains("active");
}

function bindEvents() {
  bindPasswordToggles();
  document.getElementById("mainLoginForm")?.addEventListener("submit", unlockMainSite);

  document.getElementById("driverProfileSelect").addEventListener("change", (event) => {
    switchDriverProfile(event.target.value);
  });

  document.getElementById("newDriverProfileBtn").addEventListener("click", () => {
    const name = cleanDriverName(window.prompt("Naam van de nieuwe chauffeur:") || "");
    if (!name) return;
    createDriverProfile(name);
    setSaved("driverName", name);
    restoreState();
    renderDriverProfiles();
    updateProgress();
    updateRatingAverage();
  });

  document.querySelectorAll(".app-menu [data-section]").forEach((item) => {
    item.addEventListener("click", () => {
      showSection(item.dataset.section);
      const menu = item.closest(".dropdown-menu");
      const toggle = menu?.previousElementSibling;
      if (window.bootstrap && toggle) {
        window.bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
      }
    });
  });

  document.querySelectorAll(".task-check:not(.line-check)").forEach((input) => {
    input.addEventListener("change", () => {
      setSaved(input.dataset.id, input.checked);
      updateRowState(input);
      updateProgress();
    });
  });

  document.getElementById("lineTableBody").addEventListener("change", (event) => {
    const input = event.target.closest(".line-check");
    if (!input) return;
    setSaved(input.dataset.id, input.checked);
    renderLineTable();
    updateProgress();
  });

  document.querySelectorAll(".save-field").forEach((input) => {
    const id = input.dataset.saveId || input.id;
    input.addEventListener("input", () => setSaved(id, input.value));
  });

  document.querySelectorAll(".rating-range").forEach((input) => {
    input.addEventListener("input", () => {
      setSaved(input.dataset.id, input.value);
      updateRatingValue(input);
      updateRatingAverage();
    });
    input.addEventListener("change", () => {
      const timestamp = getSelectedRatingTimestamp() || Date.now();
      addSavedRatingDay(getDayKey(timestamp));
      saveRatingHistory(input, false, timestamp);
      updateRatingAverage();
      renderRatingProgressTable();
    });
  });

  document.getElementById("ratingDateInput")?.addEventListener("change", () => {
    renderRatingProgressTable();
  });

  document.getElementById("chartZoomClose").addEventListener("click", closeChartZoom);
  document.getElementById("chartZoom").addEventListener("click", (event) => {
    if (event.target.id === "chartZoom") closeChartZoom();
  });
  document.getElementById("lineSummaryBtn").addEventListener("click", openLineSummary);
  document.getElementById("lineSummaryClose").addEventListener("click", closeLineSummary);
  document.getElementById("lineSummaryModal").addEventListener("click", (event) => {
    if (event.target.id === "lineSummaryModal") closeLineSummary();
  });
  document.getElementById("ratingProgressTable")?.addEventListener("change", handleRatingProgressTableChange);
  document.getElementById("ratingProgressTable")?.addEventListener("click", handleRatingProgressTableClick);
  document.getElementById("ratingProgressTable")?.addEventListener("focusout", handleRatingProgressTableChange);
  document.getElementById("ratingProgressTable")?.addEventListener("input", handleRatingProgressTableInput);
  document.getElementById("ratingProgressTable")?.addEventListener("keydown", handleRatingProgressTableKeydown);
  document.getElementById("ratingProgressTable")?.addEventListener("mouseover", handleRatingProgressTableHover);
  document.getElementById("ratingProgressTable")?.addEventListener("mouseleave", clearRatingProgressTableHover);
  document.getElementById("ratingProgressTable")?.addEventListener("pointerdown", handleRatingProgressTableDatePointerDown);
  document.getElementById("ratingProgressTable")?.addEventListener("pointerdown", handleRatingProgressTablePointerDown);
  document.getElementById("ratingProgressTable")?.addEventListener("pointerup", handleRatingProgressTablePointerUp);

  document.getElementById("ratingDateModalSave")?.addEventListener("click", () => closeRatingDateModal(true));
  document.getElementById("ratingDateModalClose")?.addEventListener("click", () => closeRatingDateModal(false));
  document.getElementById("ratingDateModalCancel")?.addEventListener("click", () => closeRatingDateModal(false));
  document.getElementById("ratingDateModal")?.addEventListener("click", (event) => {
    if (event.target.id === "ratingDateModal") closeRatingDateModal(false);
  });
  document.getElementById("generateMentorTextBtn")?.addEventListener("click", generateMentorText);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeChartZoom();
      closeLineSummary();
    }
  });

  document.getElementById("lineSearch").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("#lineTableBody .line-card").forEach((row) => {
      row.classList.toggle("line-hidden", query && !row.dataset.line.includes(query));
    });
  });

  document.querySelectorAll("[data-print-target]").forEach((button) => {
    button.addEventListener("click", () => {
      printMentorSection(button.dataset.printTarget || "dashboard");
      const menu = button.closest(".dropdown-menu");
      const toggle = menu?.previousElementSibling;
      if (window.bootstrap && toggle) {
        window.bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
      }
    });
  });
  window.addEventListener("beforeprint", () => buildPrintSummary(currentPrintTarget));

  document.getElementById("infoEmailShareBtn")?.addEventListener("click", shareInfoByEmail);

  document.getElementById("infoWhatsappBtn")?.addEventListener("click", shareInfoByWhatsapp);

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!window.confirm("Alle afgevinkte onderdelen en notities wissen?")) return;
    const profilePrefix = `${driverDataPrefix}${getActiveDriverId()}:`;
    const profileName = getActiveDriverProfile()?.name || "Nieuwe chauffeur";
    Object.keys(localStorage)
      .filter((name) => name.startsWith(profilePrefix))
      .forEach((name) => localStorage.removeItem(name));
    setSaved("driverName", profileName);
    restoreState();
    updateProgress();
    updateRatingAverage();
  });
}

ensureDriverProfiles();
renderChecklists();
renderLineTable();
renderContacts();
renderRatings();
renderWebsites();
renderDriverProfiles();
setupSignaturePads();
restoreState();
setDefaultRatingDate();
bindEvents();
initMainLogin();
updateProgress();
updateRatingAverage();
buildPrintSummary("dashboard");
