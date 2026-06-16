const getBaseUrl = () => {
  //Se tiver no Codespace
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  //Se tiver local
  return 'http://localhost:5000';
};

export const BASE_URL = getBaseUrl();

export const API_ALUNOS = `${BASE_URL}/api/alunos`;
export const API_SALAS = `${BASE_URL}/api/salas`;
export const API_ALUNOS_BASE = `${BASE_URL}/api/alunos`;

//Fetch direto
export const API = BASE_URL;