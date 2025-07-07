// ✅ Enable App Check debug token in local dev (SAFE for localhost only)
if (location.hostname === "localhost") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBC0aHWAW6mh8uOZ6ZOFdjP7YCWkWKC9QM",
  authDomain: "loginsys-62057.firebaseapp.com",
  projectId: "loginsys-62057",
  storageBucket: "loginsys-62057.appspot.com",
  messagingSenderId: "800840239367",
  appId: "1:800840239367:web:a1805941085aedfdd69da2",
  measurementId: "G-3TL1ZF48K2"
};

const app = initializeApp(firebaseConfig);

// ✅ Setup App Check with reCAPTCHA v3 for production
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LdMPnsrAAAAAKCetxe591GRjUmj8XE9FNjSFRfR"), // ✅ Your site key
  isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app);

// ✅ Toast
window.showToast = function (message, type = "error") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = type === "success" ? "#2e7d32" : "#e53935";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  toast.style.fontSize = "15px";
  toast.style.fontFamily = "Arial, sans-serif";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0.95";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// ✅ Login
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  if (!email || !password) return showToast("⚠️ Enter both email and password.");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("authenticated", "true");
    showToast("✅ Login successful!", "success");
    setTimeout(() => (window.location.href = "admin.html"), 1000);
  } catch (error) {
    let message = "❌ Login failed.";
    if (error.code === "auth/user-not-found") message = "❌ No account found.";
    else if (error.code === "auth/wrong-password") message = "❌ Incorrect password.";
    else if (error.code === "auth/too-many-requests") message = "🚫 Too many attempts.";
    showToast(message);
  }
};

// ✅ Signup
window.signupUser = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  if (!email || !password) return showToast("⚠️ Enter both email and password.");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem("authenticated", "true");
    showToast("✅ Account created!", "success");
    setTimeout(() => (window.location.href = "admin.html"), 1000);
  } catch (error) {
    let message = "❌ Signup failed.";
    if (error.code === "auth/email-already-in-use") message = "⚠️ Email in use.";
    else if (error.code === "auth/invalid-email") message = "⚠️ Invalid email.";
    else if (error.code === "auth/weak-password") message = "⚠️ Weak password.";
    showToast(message);
  }
};

// ✅ Logout
window.logoutUser = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem("authenticated");
    showToast("✅ Logged out!", "success");
    setTimeout(() => (window.location.href = "login.html"), 500);
  } catch {
    showToast("❌ Logout failed.");
  }
};

// ✅ Google Sign-In
window.googleSignIn = async function () {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    localStorage.setItem("authenticated", "true");
    showToast("✅ Signed in with Google!", "success");
    setTimeout(() => (window.location.href = "admin.html"), 1000);
  } catch (error) {
    console.error("Google Sign-In error:", error.message);
    showToast("❌ Google Sign-In failed.");
  }
};

// ✅ Protect admin page
if (window.location.pathname.includes("admin.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user || localStorage.getItem("authenticated") !== "true") {
      window.location.href = "login.html";
    }
  });
}
