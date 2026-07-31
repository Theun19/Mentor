const translateStorageKey = "mentor-checklist-nijmegen:language";
let pendingTranslateLanguage = localStorage.getItem(translateStorageKey) || "nl";

function getTranslateCookieDomain() {
  return window.location.hostname ? `;domain=.${window.location.hostname}` : "";
}

function clearTranslateCookie() {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;${expires};path=/`;
  document.cookie = `googtrans=;${expires};path=/${getTranslateCookieDomain()}`;
}

function setTranslateCookie(language) {
  clearTranslateCookie();
  if (language === "nl") return;
  const value = `/nl/${language}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/${getTranslateCookieDomain()}`;
}

function syncTranslateSelect(language) {
  document.querySelectorAll(".translate-select").forEach((select) => {
    select.value = language;
  });
}

function applyGoogleTranslate(language) {
  syncTranslateSelect(language);
  const googleSelect = document.querySelector(".goog-te-combo");
  if (!googleSelect) return false;

  if (language === "nl") {
    clearTranslateCookie();
    localStorage.setItem(translateStorageKey, "nl");
    if (document.documentElement.classList.contains("translated-ltr") || document.documentElement.classList.contains("translated-rtl")) {
      window.location.reload();
    }
    return true;
  }

  setTranslateCookie(language);
  googleSelect.value = language;
  googleSelect.dispatchEvent(new Event("change"));
  return true;
}

function setSiteLanguage(language) {
  pendingTranslateLanguage = language;
  localStorage.setItem(translateStorageKey, language);
  setTranslateCookie(language);

  if (applyGoogleTranslate(language)) return;

  window.setTimeout(() => {
    if (!applyGoogleTranslate(language) && language !== "nl") {
      window.alert("De vertaalfunctie kon nog niet worden geladen. Controleer je internetverbinding en probeer het opnieuw.");
    }
  }, 1400);
}

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google?.translate?.TranslateElement) return;

  new window.google.translate.TranslateElement({
    pageLanguage: "nl",
    includedLanguages: "en,ar,tr,ro,hu,bg",
    autoDisplay: false,
  }, "google_translate_element");

  window.setTimeout(() => applyGoogleTranslate(pendingTranslateLanguage), 500);
};

document.addEventListener("DOMContentLoaded", () => {
  syncTranslateSelect(pendingTranslateLanguage);
  document.querySelectorAll(".translate-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      setSiteLanguage(event.target.value);
    });
  });
});
