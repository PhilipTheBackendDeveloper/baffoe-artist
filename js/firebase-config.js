// Firebase Configuration for Baffoe Kwabena Studio CMS
// Project: baffoe-art
export const firebaseConfig = {
  apiKey: "AIzaSyC57tisUVwUF7ki2U-Ie4cOOcZqc_9JOTo",
  authDomain: "baffoe-art.firebaseapp.com",
  projectId: "baffoe-art",
  storageBucket: "baffoe-art.firebasestorage.app",
  messagingSenderId: "471563397132",
  appId: "1:471563397132:web:f3eb5627f0369de4c82629",
  measurementId: "G-1RD208C9DN"
};

// Whitelisted studio admin emails
export const AUTHORIZED_EMAILS = [
  "odamephilip966@gmail.com",
  "philipodametech@gmail.com",
  "baffoekwabena.art@gmail.com"
];

// Helper to check if an email is authorized
export function isAuthorizedEmail(email) {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return AUTHORIZED_EMAILS.some(e => e.toLowerCase() === cleanEmail);
}
