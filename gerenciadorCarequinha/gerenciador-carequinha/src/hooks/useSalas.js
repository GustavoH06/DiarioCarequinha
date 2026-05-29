import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/salas';
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
    const novaSala = await res.json();
    setSalas(prev => [...prev, novaSala]);
    return novaSala;
  }

  async function deleteSala(sid) {
    const res = await fetch(`${API}/${sid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover sala');
    setSalas(prev => prev.filter(s => s.sid !== sid));
  }

  async function addAlunoToSala(sid, pid) {
    const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'POST' });
    if (!res.ok) throw new Error('Erro ao adicionar aluno');
    const salaAtualizada = await res.json();
    setSalas(prev => prev.map(s => s.sid === sid ? salaAtualizada : s));
    return salaAtualizada;
  }

  async function removeAlunoFromSala(sid, pid) {
    const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover aluno da sala');
    const salaAtualizada = await res.json();
    setSalas(prev => prev.map(s => s.sid === sid ? salaAtualizada : s));
    return salaAtualizada;
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

  return { salas, loading, error, createSala, deleteSala, addAlunoToSala, removeAlunoFromSala, searchAlunos };
}