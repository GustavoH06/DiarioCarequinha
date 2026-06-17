const CODESPACE_URL = 'https://glorious-goldfish-7vwvw9xr9v6rhpgvv-5000.app.github.dev';

const getBaseUrl = () => {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return CODESPACE_URL;
  }
  return 'http://localhost:5000';
};

export const BASE_URL = getBaseUrl();

export const API_ALUNOS = `${BASE_URL}/api/alunos`;
export const API_SALAS = `${BASE_URL}/api/salas`;
export const API_ALUNOS_BASE = `${BASE_URL}/api/alunos`;

export const API = BASE_URL;