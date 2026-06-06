(function () {
  const storagePrefix = "mentor-checklist-nijmegen";
  const driverProfilesKey = `${storagePrefix}:driver-profiles`;
  const activeDriverKey = `${storagePrefix}:active-driver-id`;
  const driverDataPrefix = `${storagePrefix}:driver:`;
  const cloudDocPath = ["mentorMaps", "nijmegen"];

  const firebaseConfig = {
    apiKey: "AIzaSyAtY4D75hLK-7HPurvIiHTdTM_mKeO2j9U",
    authDomain: "mentormap-chauffeurs.firebaseapp.com",
    projectId: "mentormap-chauffeurs",
    storageBucket: "mentormap-chauffeurs.firebasestorage.app",
    messagingSenderId: "990642405903",
    appId: "1:990642405903:web:de07a88e3c1477ea5dd97a",
    measurementId: "G-MR5JJLZXLC",
  };

  let firestoreTools;
  let cloudDoc;
  let saveTimer;
  let isApplyingRemote = false;
  let isReady = false;
  let onRemoteChange = () => {};
  let onStatusChange = () => {};

  function setStatus(text, tone = "secondary") {
    onStatusChange(text, tone);
    document.querySelectorAll("[data-cloud-status]").forEach((element) => {
      element.textContent = text;
      element.className = `cloud-status text-${tone}`;
    });
  }

  function getLocalCloudState() {
    const driverData = {};
    Object.keys(localStorage)
      .filter((key) => key.startsWith(driverDataPrefix))
      .forEach((key) => {
        driverData[key.slice(driverDataPrefix.length)] = localStorage.getItem(key);
      });

    return {
      profiles: JSON.parse(localStorage.getItem(driverProfilesKey) || "[]"),
      driverData,
    };
  }

  function applyCloudState(state) {
    if (!state || !Array.isArray(state.profiles) || !state.driverData) return;

    isApplyingRemote = true;
    try {
      localStorage.setItem(driverProfilesKey, JSON.stringify(state.profiles));

      Object.keys(localStorage)
        .filter((key) => key.startsWith(driverDataPrefix))
        .forEach((key) => localStorage.removeItem(key));

      Object.entries(state.driverData).forEach(([key, value]) => {
        if (typeof value === "string") {
          localStorage.setItem(`${driverDataPrefix}${key}`, value);
        }
      });

      const activeDriver = localStorage.getItem(activeDriverKey);
      if (!state.profiles.some((profile) => profile.id === activeDriver)) {
        localStorage.setItem(activeDriverKey, state.profiles[0]?.id || "");
      }
    } finally {
      isApplyingRemote = false;
    }

    onRemoteChange();
  }

  async function saveNow() {
    if (!isReady || isApplyingRemote || !firestoreTools || !cloudDoc) return;

    setStatus("Synchroniseren...", "secondary");
    try {
      await firestoreTools.setDoc(cloudDoc, {
        ...getLocalCloudState(),
        updatedAt: firestoreTools.serverTimestamp(),
      });
      setStatus("Cloud opgeslagen", "success");
    } catch (error) {
      console.warn("Firebase sync failed", error);
      setStatus("Cloud niet bereikbaar", "danger");
    }
  }

  function queueSave() {
    if (!isReady || isApplyingRemote) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 600);
  }

  async function loadFirebase() {
    const [appModule, firestoreModule, analyticsModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js"),
    ]);

    return {
      initializeApp: appModule.initializeApp,
      getAnalytics: analyticsModule.getAnalytics,
      doc: firestoreModule.doc,
      getDoc: firestoreModule.getDoc,
      getFirestore: firestoreModule.getFirestore,
      onSnapshot: firestoreModule.onSnapshot,
      serverTimestamp: firestoreModule.serverTimestamp,
      setDoc: firestoreModule.setDoc,
    };
  }

  async function init(options = {}) {
    onRemoteChange = options.onRemoteChange || onRemoteChange;
    onStatusChange = options.onStatusChange || onStatusChange;
    setStatus("Cloud verbinden...", "secondary");

    try {
      const firebase = await loadFirebase();
      const app = firebase.initializeApp(firebaseConfig);
      try {
        firebase.getAnalytics(app);
      } catch (error) {
        console.warn("Firebase analytics is niet beschikbaar op dit apparaat.", error);
      }
      const db = firebase.getFirestore(app);
      cloudDoc = firebase.doc(db, ...cloudDocPath);
      firestoreTools = {
        serverTimestamp: firebase.serverTimestamp,
        setDoc: firebase.setDoc,
      };
      isReady = true;

      const snapshot = await firebase.getDoc(cloudDoc);
      if (snapshot.exists()) {
        applyCloudState(snapshot.data());
      } else {
        await saveNow();
      }

      firebase.onSnapshot(cloudDoc, (nextSnapshot) => {
        if (nextSnapshot.exists()) {
          applyCloudState(nextSnapshot.data());
          setStatus("Cloud bijgewerkt", "success");
        }
      }, (error) => {
        console.warn("Firebase listener failed", error);
        setStatus("Cloud niet bereikbaar", "danger");
      });
    } catch (error) {
      console.warn("Firebase init failed", error);
      setStatus("Alleen lokaal", "warning");
    }
  }

  window.MentorCloud = {
    init,
    queueSave,
    saveNow,
  };
}());
