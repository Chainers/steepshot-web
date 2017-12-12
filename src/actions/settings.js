export function getSettings() {
  return JSON.parse(localStorage.getItem('settings'))
}

export function updateSettings(newSettings) {
  localStorage.removeItem('settings');
  localStorage.setItem('settings', JSON.stringify(newSettings));
}
