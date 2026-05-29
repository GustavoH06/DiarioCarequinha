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

  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]); // [{pid, nome}]

  const { salas, createSala, deleteSala, searchAlunos } = useSalas();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSearch(e) {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      const results = await searchAlunos(q);
      setSearchResults(results.filter(r => !alunosSelecionados.find(a => a.pid === r.pid)));
    } else {
      setSearchResults([]);
    }
  }

  function selectAluno(aluno) {
    setAlunosSelecionados(prev => [...prev, { pid: aluno.pid, nome: aluno.nome }]);
    setSearchQuery('');
    setSearchResults([]);
  }

  function removeAluno(pid) {
    setAlunosSelecionados(prev => prev.filter(a => a.pid !== pid));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    try {
      await createSala({
        ...formData,
        alunoIds: alunosSelecionados.map(a => a.pid),
      });
      setFormData(emptyForm);
      setAlunosSelecionados([]);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Cadastrar Sala</h1>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

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
              <option value="Jardim">Jardim</option>
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

        <div className="form-input alunosSearch" style={{ position: 'relative' }}>
          <label>Pesquisar aluno pelo nome</label>
          <input
            type="text"
            placeholder="Ex: João Pedro"
            value={searchQuery}
            onChange={handleSearch}
            autoComplete="off"
          />

          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map(a => (
                <li key={a.pid} onClick={() => selectAluno(a)}>
                  {a.nome}
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
