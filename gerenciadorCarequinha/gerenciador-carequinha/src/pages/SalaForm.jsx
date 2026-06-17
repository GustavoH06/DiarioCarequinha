import { useState } from 'react';
import { useSalas } from '../hooks/useSalas';
import SalasListComp from '../blueprints/SalasListComp';

const emptyForm = {
  nome:           '',
  tipo:           '',
  turno:          '',
  horarioInicio:  '',
  horarioTermino: '',
};

export default function SalaForm() {
  const [formData,    setFormData]    = useState(emptyForm);
  const [submitError, setSubmitError] = useState(null);
  const [loading,     setLoading]     = useState(false);

  const [alunoSearch,        setAlunoSearch]        = useState('');
  const [alunoDropdownOpen,  setAlunoDropdownOpen]  = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const { salas, createSala, deleteSala, searchAlunos } = useSalas();

  const [todosAlunos, setTodosAlunos] = useState([]);

  async function abrirDropdown() {
    if (!alunoDropdownOpen && todosAlunos.length === 0) {
      const results = await searchAlunos('');
      setTodosAlunos(results);
    }
    setAlunoDropdownOpen(o => !o);
  }

  const alunosFiltrados = todosAlunos.filter(a =>
    a.nome.toLowerCase().includes(alunoSearch.toLowerCase()) &&
    !alunosSelecionados.find(sel => sel.pid === a.pid)
  );

  function selectAluno(aluno) {
    setAlunosSelecionados(prev => [...prev, { pid: aluno.pid, nome: aluno.nome }]);
    setAlunoSearch('');
  }

  function removeAluno(pid) {
    setAlunosSelecionados(prev => prev.filter(a => a.pid !== pid));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.nome || !formData.nome.trim()) {
        setSubmitError('O campo "Nome" é obrigatório');
        return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      await createSala({
        ...formData,
        alunoIds: alunosSelecionados.map(a => a.pid),
      });
      setFormData(emptyForm);
      setAlunosSelecionados([]);
      setTodosAlunos([]);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Cadastrar Sala</h1>

      {submitError && <p className="error-message">{submitError}</p>}

      <div className="form-body">
        <h2>Dados da Sala</h2>
        <div className="form-grid-sala">

          <div className="form-input nome">
            <label>Nome da Sala</label>
            <input type="text" name="nome" placeholder="Ex: Segundo Período"
              value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-input tipoSala">
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="Berçario">Berçario</option>
              <option value="Maternal">Maternal</option>
              <option value="Primário">Primário</option>
            </select>
          </div>

          <div className="form-input turnoSala">
            <label>Turno</label>
            <select name="turno" value={formData.turno} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>

          <div className="form-input horarioInicio">
            <label>Horário Início</label>
            <input type="time" name="horarioInicio"
              value={formData.horarioInicio} onChange={handleChange} />
          </div>

          <div className="form-input horarioTermino">
            <label>Horário Término</label>
            <input type="time" name="horarioTermino"
              value={formData.horarioTermino} onChange={handleChange} />
          </div>

        </div>

        <h2>Alunos</h2>

        <div className="form-input alunosSearch">
          <label>Adicionar aluno</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Pesquisar pelo nome..."
              value={alunoSearch}
              onChange={e => { setAlunoSearch(e.target.value); if (!alunoDropdownOpen) setAlunoDropdownOpen(true); }}
              onFocus={() => { if (!alunoDropdownOpen) abrirDropdown(); }}
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-editar"
              style={{ whiteSpace: 'nowrap', marginTop: 0 }}
              onClick={abrirDropdown}
            >
              {alunoDropdownOpen ? 'Fechar ▲' : 'Ver todos ▼'}
            </button>
          </div>

          {alunoDropdownOpen && (
            <ul className="search-dropdown">
              {alunosFiltrados.length === 0 && (
                <li style={{ color: '#a0aec0', cursor: 'default' }}>Nenhum aluno encontrado</li>
              )}
              {alunosFiltrados.map(a => (
                <li key={a.pid} onClick={() => selectAluno(a)}>
                  <strong>{a.nome}</strong>
                  {a.salas?.length > 0 && (
                    <span className="aluno-sala-badge">{a.salas.map(s => s.nome).join(', ')}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {alunosSelecionados.length > 0 && (
          <div className="alunos-chips">
            {alunosSelecionados.map(a => (
              <span key={a.pid} className="aluno-chip">
                {a.nome}
                <button type="button" onClick={() => removeAluno(a.pid)}>×</button>
              </span>
            ))}
          </div>
        )}

        <br />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Sala'}
        </button>
      </div>

      <br />
      <SalasListComp salas={salas} onDelete={deleteSala} />
    </div>
  );
}