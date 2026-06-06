const storagePrefix = "mentor-checklist-nijmegen";
const passwordKey = `${storagePrefix}:local-password-hash`;
const usernameKey = `${storagePrefix}:local-username`;
const authSessionKey = `${storagePrefix}:unlocked`;
const driverProfilesKey = `${storagePrefix}:driver-profiles`;
const activeDriverKey = `${storagePrefix}:active-driver-id`;
const driverDataPrefix = `${storagePrefix}:driver:`;

const ratingItems = [
  { label: "Rijstijl", id: "rating-rijstijl" },
  { label: "Verkeersinzicht", id: "rating-verkeersinzicht" },
  { label: "Plaats op de weg", id: "rating-plaats-op-de-weg" },
  { label: "Klantvriendelijkheid", id: "rating-klantvriendelijkheid" },
  {
    label: "Angstvallig tot roekeloos",
    id: "rating-angstvallig-tot-roekeloos",
    type: "balance",
    left: "Angstvallig",
    center: "Zelfverzekerd",
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
      "AFAS app koppelen aan Mijn HRM",
    ],
  },
  {
    title: "Aftekenlijst 2",
    items: [
      "Zitinstructie",
      "Brandstofbesparing",
      "Uitleg on-board camera",
      "Uitleg omloop (bordje)",
      "Uitleg rolstoelplank",
      "Uitleg VIRIBUS",
      "Valpartijen",
      "Uitleg perronindeling",
      "Afsluiting bus (wanneer hoofdschakelaar uit)",
      "Buffer-protocol",
      "Stallingsprotocol (waar staat de bus overdag en 's avonds)",
    ],
  },
  {
    title: "Aftekenlijst 3",
    items: [
      "Uitleg muurkrant",
      "Aangemeld bij ruilen.nu",
      "Verlof-aanvraag",
      "OIS (aanmelden op de pc stalling)",
      "Aangemeld om omleidingen te ontvangen via mail",
      "Podbus-protocol",
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
  ["Planning Bemmel", "", "088-6255965"],
  ["Stationschef", "Marco Stellaard", "06-43403987"],
  ["WhatsApp stationschef", "Marco Stellaard", "06-14311034"],
  ["ROV Utrecht", "Ziekmelden buiten kantoortijden", "030-2849494"],
];

const websites = [
  ["Mijn HRM", "mijnhrm.connexxion.nl", "https://mijnhrm.connexxion.nl"],
  ["AFAS Pocket", "Officiele AFAS apppagina", "https://www.afas.nl/software/pocket"],
  ["AFAS Pocket Android", "Google Play", "https://play.google.com/store/apps/details?id=nl.afas.pocket2&hl=nl"],
  ["AFAS Pocket iPhone", "App Store", "https://apps.apple.com/nl/app/afas-pocket/id1028433924"],
  ["Webcomm", "diensten.connexxion.nl", "https://diensten.connexxion.nl"],
  ["Mijn Connexxion", "mijn.connexxion.nl/login", "https://mijn.connexxion.nl/login"],
  ["@Transdev app", "Officiele apppagina", "https://www.transdev.nl/nl/reisinformatie/%40transdev-app"],
  ["Veiligheid / medische keuring", "mijnmeditel.nl", "https://mijnmeditel.nl"],
  ["Kledingportal", "Outfit klantportaal", "https://outfit.nl/web-portal-login/"],
  ["CBR", "cbr.nl", "https://www.cbr.nl"],
  ["Mijn CBR", "mijn.cbr.nl", "https://mijn.cbr.nl"],
  ["Breng", "breng.nl", "https://www.breng.nl/nl/"],
  ["Breng app", "Officiele apppagina", "https://www.breng.nl/nl/reisinformatie/breng-app"],
  ["Breng iPhone", "App Store", "https://apps.apple.com/nl/app/breng/id387729989"],
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
  queueCloudSave();
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
  queueCloudSave();
}

function queueCloudSave() {
  window.MentorCloud?.queueSave();
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
  queueCloudSave();
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
  const reservedKeys = new Set([passwordKey, usernameKey, authSessionKey, driverProfilesKey, activeDriverKey]);

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
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
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
  body.innerHTML = "";

  lines.forEach((line) => {
    const row = document.createElement("tr");
    row.dataset.line = line.toLowerCase();
    row.innerHTML = `
      <td class="line-name">${line}</td>
      ${["heen", "terug", "mat", "klaar"]
        .map((type) => {
          const id = lineTaskId(line, type);
          return `
            <td>
              <input class="form-check-input task-check" type="checkbox" data-id="${id}" aria-label="${line} ${type}" />
            </td>
          `;
        })
        .join("")}
    `;
    body.appendChild(row);
  });
}

function renderContacts() {
  const body = document.getElementById("contactsTableBody");
  body.innerHTML = contacts
    .map(([role, name, phone]) => {
      const needsCheck = phone === "controleren";
      return `
        <tr>
          <td>${role}</td>
          <td>${name || "-"}</td>
          <td>${needsCheck ? '<span class="uncertain">controleren</span>' : phone}</td>
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
                  <span>${item.center}</span>
                  <span>${item.right}</span>
                </div>`
              : ""
          }
        </div>
        <output class="rating-value" for="${id}" id="${id}-value">50%</output>
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
        <circle class="balance-curve-marker" id="${id}-marker" cx="110" cy="12" r="6" />
        <text class="balance-curve-label" x="12" y="116">${item.left}</text>
        <text class="balance-curve-label balance-curve-label-center" x="110" y="18">${item.center}</text>
        <text class="balance-curve-label balance-curve-label-end" x="208" y="116">${item.right}</text>
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
}

function updateRowState(input) {
  const row = input.closest(".task-row");
  if (row) row.classList.toggle("done", input.checked);
}

function updateProgress() {
  const checks = [...document.querySelectorAll(".task-check")];
  const done = checks.filter((input) => input.checked).length;
  const openTasks = checks.length - done;
  const percentage = checks.length ? Math.round((done / checks.length) * 100) : 0;
  const lineSummary = getLineSummary();
  const openLines = lineSummary.filter((item) => !item.done).length;
  let openChecklists = 0;

  document.getElementById("totalTasks").textContent = openTasks;
  document.getElementById("doneTasks").textContent = done;
  document.getElementById("lineCount").textContent = openLines;
  document.getElementById("progressText").textContent = `${percentage}% afgerond`;
  document.getElementById("dashboardPercent").textContent = `${percentage}%`;
  document.getElementById("progressDonut").style.background = `conic-gradient(var(--brand) 0deg ${percentage * 3.6}deg, #e5ece2 ${percentage * 3.6}deg 360deg)`;
  document.getElementById("progressBar").style.width = `${percentage}%`;

  const checklistChart = document.getElementById("checklistChart");
  checklistChart.innerHTML = "";

  checklists.forEach((list, listIndex) => {
    const listChecks = [...document.querySelectorAll(`[data-id^="list-${listIndex}-item-"]`)];
    const listDone = listChecks.filter((input) => input.checked).length;
    const listPercentage = list.items.length ? Math.round((listDone / list.items.length) * 100) : 0;
    if (listDone < list.items.length) openChecklists += 1;
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

  document.getElementById("openChecklists").textContent = openChecklists;
}

function updateRatingValue(input) {
  document.getElementById(`${input.id}-value`).textContent = `${getRatingScore(input)}%`;
  updateBalanceMarker(input);
}

function getRatingScore(input) {
  const value = Number(input.value);
  if (input.dataset.ratingType === "balance") {
    return Math.max(0, Math.round(100 - (Math.abs(value - 50) / 50) ** 2 * 100));
  }

  return Math.round(value);
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
  if (!marker) return;

  const value = Number(input.value);
  const x = 12 + (value / 100) * 196;
  const t = value / 100;
  const y = 104 - (4 * t * (1 - t) * 92);
  marker.setAttribute("cx", x.toFixed(1));
  marker.setAttribute("cy", y.toFixed(1));
}

function updateRatingAverage() {
  const ratings = [...document.querySelectorAll(".rating-range")].map((input) => getRatingScore(input));
  const total = ratings.reduce((sum, value) => sum + value, 0);
  const average = ratings.length ? Math.round(total / ratings.length) : 0;
  document.getElementById("ratingAverage").textContent = `Gemiddelde: ${average}%`;
  updateRatingChart();
}

function updateRatingChart() {
  const chart = document.getElementById("ratingChart");
  chart.innerHTML = "";

  document.querySelectorAll(".rating-range").forEach((input) => {
    const baseLabel = input.closest(".rating-row").querySelector(".rating-label").textContent;
    const isBalance = input.dataset.ratingType === "balance";
    const label = isBalance ? getBalanceChartTitle(input) : baseLabel;
    const history = getRatingHistory(input);
    const item = document.createElement("div");
    item.className = "line-chart-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `${label} grafiek vergroten`);
    item.innerHTML = `
      <div class="line-chart-title">${label}</div>
      <div class="line-chart-frame">
        ${renderLineGraph(history, 100)}
      </div>
    `;
    item.addEventListener("click", () => openChartZoom(label, item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openChartZoom(label, item);
      }
    });
    chart.appendChild(item);
  });
}

function getBalanceChartTitle(input) {
  const position = Number(input.value);
  const score = getRatingScore(input);

  if (score >= 70) return "Zelfverzekerd";
  return position < 50 ? "Angstvallig" : "Roekeloos";
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

function lineTaskId(line, type) {
  return `line-${line.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${type}`;
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
      done: states.find((state) => state.type === "klaar").done,
    };
  });
}

function openLineSummary() {
  const modal = document.getElementById("lineSummaryModal");
  const content = document.getElementById("lineSummaryContent");
  const summary = getLineSummary();
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
    <span class="line-state ${state.done ? "done" : ""}">${state.type}</span>
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
  const history = getSavedJson(`${input.dataset.id}-history`, []);
  if (history.length) {
    return history.map((entry) => ({
      ...entry,
      value: normalizeHistoryScore(input, entry.value),
    }));
  }

  return [
    {
      time: Date.now(),
      value: getRatingScore(input),
    },
  ];
}

function normalizeHistoryScore(input, value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  if (numericValue > 10) return Math.max(0, Math.min(100, Math.round(numericValue)));

  if (input.dataset.ratingType === "balance") {
    const percentPosition = ((Math.max(1, Math.min(9, numericValue)) - 1) / 8) * 100;
    return Math.max(0, Math.round(100 - (Math.abs(percentPosition - 50) / 50) ** 2 * 100));
  }

  return Math.round(Math.max(0, Math.min(10, numericValue)) * 10);
}

function saveRatingHistory(input, force = false) {
  const history = getRatingHistory(input);
  const value = getRatingScore(input);
  const last = history[history.length - 1];

  if (!force && last && last.value === value && isSameDay(last.time, Date.now())) return;

  history.push({
    time: Date.now(),
    value,
  });

  setSavedJson(`${input.dataset.id}-history`, history.slice(-30));
}

function saveAllRatingHistories() {
  document.querySelectorAll(".rating-range").forEach((input) => {
    saveRatingHistory(input, true);
  });
  updateRatingAverage();
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
  const pointString = points.map((point) => `${point.x},${point.y}`).join(" ");
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
      <polyline class="line-chart-line" points="${pointString}" />
      ${points.map((point) => `<circle class="line-chart-point" cx="${point.x}" cy="${point.y}" r="3" />`).join("")}
      ${xLabels}
    </svg>
  `;
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
  document.getElementById(id).textContent = value || "-";
}

function buildPrintSummary() {
  const checks = [...document.querySelectorAll(".task-check")];
  const done = checks.filter((input) => input.checked).length;
  const percentage = checks.length ? Math.round((done / checks.length) * 100) : 0;
  const lineSummary = getLineSummary();
  const openLines = lineSummary.filter((item) => !item.done).length;
  const openTasks = checks.length - done;
  let openChecklists = 0;

  setPrintText("printDate", new Date().toLocaleDateString("nl-NL"));
  setPrintText("printDriverName", getSaved("driverName") || getActiveDriverProfile()?.name);
  setPrintText("printPersonnelNumber", getSaved("personnelNumber"));
  setPrintText("printStartDate", getSaved("startDate"));
  setPrintText("printEndDate", getSaved("endDate"));
  setPrintText("printMentorName", getSaved("mentorName"));
  setPrintText("printProgressPercent", `${percentage}%`);
  setPrintText("printOpenTasks", openTasks);
  setPrintText("printDoneTasks", done);
  setPrintText("printOpenLines", openLines);

  const checklistRows = document.getElementById("printChecklistRows");
  checklistRows.innerHTML = "";
  checklists.forEach((list, listIndex) => {
    const listChecks = [...document.querySelectorAll(`[data-id^="list-${listIndex}-item-"]`)];
    const listDone = listChecks.filter((input) => input.checked).length;
    const listPercentage = list.items.length ? Math.round((listDone / list.items.length) * 100) : 0;
    if (listDone < list.items.length) openChecklists += 1;
    checklistRows.insertAdjacentHTML("beforeend", `
      <div class="print-row">
        <span>${list.title}</span>
        <div class="print-bar"><i style="width: ${listPercentage}%"></i></div>
        <strong>${listDone}/${list.items.length}</strong>
      </div>
    `);
  });
  setPrintText("printOpenChecklists", openChecklists);

  const ratingRows = document.getElementById("printRatingRows");
  ratingRows.innerHTML = "";
  document.querySelectorAll(".rating-range").forEach((input) => {
    const label = input.closest(".rating-row").querySelector(".rating-label").textContent;
    ratingRows.insertAdjacentHTML("beforeend", `
      <div class="print-score">
        <span>${label}</span>
        <strong>${getRatingScore(input)}%</strong>
      </div>
    `);
  });

  document.getElementById("saveRatingsBtn").addEventListener("click", saveAllRatingHistories);

  setPrintSignature("printDriverSignature", getSaved("driverSignature"));
  setPrintSignature("printMentorSignature", getSaved("mentorSignature"));
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

function bindEvents() {
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

  document.querySelectorAll(".task-check").forEach((input) => {
    input.addEventListener("change", () => {
      setSaved(input.dataset.id, input.checked);
      updateRowState(input);
      updateProgress();
    });
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
      saveRatingHistory(input);
      updateRatingAverage();
    });
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeChartZoom();
      closeLineSummary();
    }
  });

  document.getElementById("lineSearch").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("#lineTableBody tr").forEach((row) => {
      row.classList.toggle("line-hidden", query && !row.dataset.line.includes(query));
    });
  });

  document.getElementById("printBtn").addEventListener("click", () => {
    buildPrintSummary();
    window.print();
  });
  window.addEventListener("beforeprint", buildPrintSummary);

  document.getElementById("emailShareBtn").addEventListener("click", () => {
    const subject = encodeURIComponent("Mentormap nieuwe chauffeurs Nijmegen");
    const body = encodeURIComponent(
      `Hallo,\n\nHierbij de mentormap nieuwe chauffeurs Nijmegen:\n${window.location.href}\n\nVoor een A4-overzicht met dashboard en chauffeurgegevens: open de mentormap en kies Print / Bewaar als PDF.\n\nGroet,`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  document.getElementById("whatsappBtn").addEventListener("click", () => {
    const text = `Mentormap nieuwe chauffeurs Nijmegen:\n${window.location.href}\n\nA4-overzicht delen? Open de mentormap en kies Print / Bewaar als PDF.`;
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
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!window.confirm("Alle afgevinkte onderdelen en notities wissen?")) return;
    const profilePrefix = `${driverDataPrefix}${getActiveDriverId()}:`;
    const profileName = getActiveDriverProfile()?.name || "Nieuwe chauffeur";
    Object.keys(localStorage)
      .filter((name) => name.startsWith(profilePrefix))
      .forEach((name) => localStorage.removeItem(name));
    setSaved("driverName", profileName);
    queueCloudSave();
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
restoreState();
bindEvents();
updateProgress();
updateRatingAverage();

window.MentorCloud?.init({
  onRemoteChange: () => {
    renderDriverProfiles();
    restoreState();
    updateProgress();
    updateRatingAverage();
  },
});
