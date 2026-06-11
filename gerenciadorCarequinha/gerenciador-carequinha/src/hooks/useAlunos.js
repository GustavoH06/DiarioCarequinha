import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/alunos';

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAlunos(); }, []);

  async function fetchAlunos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Erro ao carregar alunos');
      setAlunos(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createAluno(payload) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao cadastrar aluno');
    const novoAluno = await res.json();
    setAlunos(prev => [...prev, novoAluno]);
    return novoAluno;
  }

  async function updateAluno(pid, payload){
    const res = await fetch(`${API}/${pid}`,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if(!res.ok)throw new Error('Erro ao atualizar aluno');
    const atualizaAluno = await res.json();
    setAlunos(prev => prev.map(a =>a.pid === pid ? atualizaAluno : a));
    return atualizaAluno;
  }

  async function deleteAluno(pid) {
    const res = await fetch(`${API}/${pid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover aluno');
    setAlunos(prev => prev.filter(a => a.pid !== pid));
  }

  async function saveCompetencia(pid, itemId, nota, observacao){
    const res = await fetch(`${API}/${pid}/competencias`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, nota, observacao }),
    });
    if(!res.ok) throw new Error("Erro ao salvar competências");
    return res.json();
  }

  return { alunos, loading, error, createAluno, updateAluno, deleteAluno, saveCompetencia };
}