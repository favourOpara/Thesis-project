

const COOKIE_CONSENT_KEY = "cookie_consent_accepted";

export function hasConsentedToCookies() {
  // Return true if user accepted, false otherwise
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
}
