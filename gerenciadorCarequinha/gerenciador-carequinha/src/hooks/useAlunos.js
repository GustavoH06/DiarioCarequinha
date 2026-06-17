import { useState, useEffect } from 'react';
import { API_ALUNOS } from './configApi';

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAlunos(); }, []);

  async function fetchAlunos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ALUNOS);
      if (!res.ok) throw new Error('Erro ao carregar alunos');
      setAlunos(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createAluno(payload) {
    const res = await fetch(API_ALUNOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao cadastrar aluno');
    const novo = await res.json();
    setAlunos(prev => [...prev, novo]);
    return novo;
  }

  async function updateAluno(pid, payload) {
    const res = await fetch(`${API_ALUNOS}/${pid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao atualizar aluno');
    const atualizado = await res.json();
    setAlunos(prev => prev.map(a => a.pid === pid ? atualizado : a));
    return atualizado;
  }

  async function deleteAluno(pid) {
    const res = await fetch(`${API_ALUNOS}/${pid}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover aluno');
    setAlunos(prev => prev.filter(a => a.pid !== pid));
  }

  async function saveCompetencia(pid, itemId, nota, observacao) {
    const res = await fetch(`${API_ALUNOS}/${pid}/competencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, nota, observacao }),
    });
    if (!res.ok) throw new Error('Erro ao salvar competência');
    return res.json();
  }

  //Add Aluno
  async function addAlunoToSala(sid, pid) {
    const res = await fetch(`${API_ALUNOS}/salas/${sid}/alunos/${pid}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Erro ao adicionar aluno à sala');
    
    //Retorna o aluno atualizado
    const alunoRes = await fetch(`${API_ALUNOS}/${pid}`);
    if (alunoRes.ok) {
      const alunoAtualizado = await alunoRes.json();
      setAlunos(prev => prev.map(a => a.pid === pid ? alunoAtualizado : a));
    }
    return res.json();
  }

  //Buscar aluno
  async function fetchAluno(pid) {
    const res = await fetch(`${API_ALUNOS}/${pid}`);
    if (!res.ok) throw new Error('Aluno não encontrado');
    return res.json();
  }

  return { 
    alunos, loading, error, 
    createAluno, updateAluno, deleteAluno, 
    saveCompetencia, addAlunoToSala, fetchAluno,
    fetchAlunos
  };
}