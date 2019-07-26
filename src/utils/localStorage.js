export function getLocalStorage() {
  // return localStorage.getItem('username') || 'admin';
  return localStorage.getItem('username');
}

export function setLocalStorage(username) {
  return localStorage.setItem('username', username);
}
