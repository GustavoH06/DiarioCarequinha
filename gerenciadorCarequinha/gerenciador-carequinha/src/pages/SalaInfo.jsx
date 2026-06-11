import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

const API        = 'http://localhost:5000/api/salas';
const API_ALUNOS = 'http://localhost:5000/api/alunos';

export default function SalaInfo() {
  const { sid }  = useParams();
  const navigate = useNavigate();

  const [sala,      setSala]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [editMode,  setEditMode]  = useState(false);
  const [formData,  setFormData]  = useState({});
  const [saving,    setSaving]    = useState(false);

  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => { fetchSala(); }, [sid]);

  async function fetchSala() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/${sid}`);
      if (!res.ok) throw new Error('Sala não encontrada');
      const data = await res.json();
      setSala(data);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSala() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${sid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erro ao salvar');
      const atualizada = await res.json();
      setSala(atualizada);
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSearch(e) {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    try {
      const res  = await fetch(API_ALUNOS);
      const todos = await res.json();
      const alunosNaSala = sala.alunos.map(a => a.pid);
      setSearchResults(
        todos.filter(a =>
          a.nome.toLowerCase().includes(q.toLowerCase()) &&
          !alunosNaSala.includes(a.pid)
        )
      );
    } catch { setSearchResults([]); }
  }

  async function addAluno(pid) {
    try {
      const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setSala(await res.json());
      setSearchQuery('');
      setSearchResults([]);
    } catch { alert('Erro ao adicionar aluno'); }
  }

  async function removeAluno(pid) {
    try {
      const res = await fetch(`${API}/${sid}/alunos/${pid}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setSala(await res.json());
    } catch { alert('Erro ao remover aluno'); }
  }

  if (loading) return <div className="loading-message">Carregando...</div>;
  if (error)   return <div className="error-message">{error}</div>;
  if (!sala)   return null;

  return (
    <div className="info-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
        <h1>{sala.nome}</h1>
        <span className={`tipo-badge tipo-${sala.tipo?.toLowerCase().replace('á','a').replace('ç','c')}`}>
          {sala.tipo}
        </span>
        <span className={`turno-badge ${sala.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
          {sala.turno}
        </span>
      </div>

      <div className="form-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Dados da Sala</h2>
          {editMode
            ? <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSaveSala} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button onClick={() => { setEditMode(false); setFormData(sala); }}>
                  Cancelar
                </button>
              </div>
            : <button onClick={() => setEditMode(true)}>
                <i className="bi bi-pencil" /> Editar
              </button>
          }
        </div>

        <div className="form-grid-sala">
          {[
            { label: 'Nome',            field: 'nome',           type: 'text' },
            { label: 'Horário Início',  field: 'horarioInicio',  type: 'time' },
            { label: 'Horário Término', field: 'horarioTermino', type: 'time' },
          ].map(({ label, field, type }) => (
            <div className="form-input" key={field}>
              <label>{label}</label>
              {editMode
                ? <input type={type} value={formData[field] || ''}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))} />
                : <span className="info-value">{sala[field] || '—'}</span>
              }
            </div>
          ))}

          {editMode && (
            <>
              <div className="form-input">
                <label>Tipo</label>
                <select value={formData.tipo || ''} onChange={e => setFormData(p => ({ ...p, tipo: e.target.value }))}>
                  {['Berçario','Maternal','Jardim','Primário'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-input">
                <label>Turno</label>
                <select value={formData.turno || ''} onChange={e => setFormData(p => ({ ...p, turno: e.target.value }))}>
                  {['Manhã','Tarde'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <br />

      <div className="form-body">
        <h2>Alunos ({sala.totalAlunos})</h2>

        <div className="form-input alunosSearch" style={{ position: 'relative', maxWidth: '360px' }}>
          <label>Adicionar aluno</label>
          <input
            type="text"
            placeholder="Pesquisar pelo nome..."
            value={searchQuery}
            onChange={handleSearch}
            autoComplete="off"
          />
          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map(a => (
                <li key={a.pid} onClick={() => addAluno(a.pid)}>{a.nome}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="list-items" style={{ marginTop: '1rem' }}>
          <div className="item-list header">
            <label>ID</label>
            <label>Nome</label>
            <label>Ação</label>
          </div>
          {sala.alunos.length === 0 && (
            <div className="item-list empty"><label>Nenhum aluno nesta sala</label></div>
          )}
          {sala.alunos.map(a => (
            <div className="item-list content" key={a.pid}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/alunos/${a.pid}`)}>
              <label>{a.pid}</label>
              <label>{a.nome}</label>
              <label onClick={e => e.stopPropagation()}>
                <i className="bi bi-trash acao-icon" title="Remover da sala"
                  onClick={() => removeAluno(a.pid)} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
