import { useState, useEffect } from 'react';

const API       = 'http://localhost:5000/api/salas';
const API_ALUNOS = 'http://localhost:5000/api/alunos';

export function useSalas() {
  const [salas,   setSalas]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => { fetchSalas(); }, []);

  async function fetchSalas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Erro ao carregar salas');
      setSalas(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createSala(payload) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao cadastrar sala');
    const nova = await res.json();
    setSalas(prev => [...prev, nova]);
    return nova;
  }

  async function updateSala(sid, payload) {
    const res = await fetch(`${API}/${sid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao atualizar sala');
    const atualizada = await res.json();
    setSalas(prev => prev.map(s => s.sid === sid ? atualizada : s));
    return atualizada;
  }

  async function deleteSala(sid) {
    const res = await fetch(`${API}/${sid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover sala');
    setSalas(prev => prev.filter(s => s.sid !== sid));
  }

  async function addAlunoToSala(sid, pid) {
    const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'POST' });
    if (!res.ok) throw new Error('Erro ao adicionar aluno');
    const atualizada = await res.json();
    setSalas(prev => prev.map(s => s.sid === sid ? atualizada : s));
    return atualizada;
  }

  async function removeAlunoFromSala(sid, pid) {
    const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover aluno da sala');
    const atualizada = await res.json();
    setSalas(prev => prev.map(s => s.sid === sid ? atualizada : s));
    return atualizada;
  }

  async function searchAlunos(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(API_ALUNOS);
      if (!res.ok) throw new Error();
      const todos = await res.json();
      const q = query.toLowerCase();
      return todos.filter(a => a.nome.toLowerCase().includes(q));
    } catch {
      return [];
    }
  }

  async function fetchPresencas(sid) {
    const res = await fetch(`${API}/${sid}/presencas`);
    if (!res.ok) throw new Error('Erro ao carregar presenças');
    return res.json();
  }

  async function markPresenca(sid, alunoId, data, presente) {
    const res = await fetch(`${API}/${sid}/presencas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alunoId, data, presente }),
    });
    if (!res.ok) throw new Error('Erro ao registrar presença');
    return res.json();
  }

  async function deletePresenca(sid, registroId) {
    const res = await fetch(`${API}/${sid}/presencas/${registroId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover presença');
    return res.json();
  }

  return { salas, loading, error, createSala, updateSala, deleteSala,
           addAlunoToSala, removeAlunoFromSala, searchAlunos,
           fetchPresencas, markPresenca, deletePresenca };
}
