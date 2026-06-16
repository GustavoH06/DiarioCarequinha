import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import { useSalas } from '../hooks/useSalas';
import AlunosListComp from '../blueprints/AlunosListComp';

const emptyForm = {
  nome: '',
  dataNascimento: '',
  telefone: '',
  nomePai1: '',
  nomePai2: '',
  endereco: '',
  numero: '',
  idade: '',
  sexo: '',
};

function formatarTelefone(valor) {
  const digits = valor.replace(/\D/g, '').slice(0, 13);
  if (digits.length === 0) return '';
  if (digits.length <= 2)  return `+${digits}`;
  if (digits.length <= 4)  return `+${digits.slice(0,2)} (${digits.slice(2)}`;
  if (digits.length <= 9)  return `+${digits.slice(0,2)} (${digits.slice(2,4)}) ${digits.slice(4)}`;
  if (digits.length <= 13) {
    const local = digits.slice(4);
    const cut = local.length === 9 ? 5 : 4;
    return `+${digits.slice(0,2)} (${digits.slice(2,4)}) ${local.slice(0,cut)}-${local.slice(cut)}`;
  }
  return valor;
}

function telefoneValido(tel) {
  return /^\+\d{2} \(\d{2}\) \d{4,5}-\d{4}$/.test(tel);
}

export default function AlunoForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [salaSearch, setSalaSearch] = useState('');
  const [salaDropdownOpen, setSalaDropdownOpen] = useState(false);
  const [salasSelecionadas, setSalasSelecionadas] = useState([]);

  const { alunos, deleteAluno, createAluno, addAlunoToSala } = useAlunos();
  const { salas } = useSalas();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleTelefone(e) {
    setFormData(prev => ({ ...prev, telefone: formatarTelefone(e.target.value) }));
  }

  const salasFiltradas = salas.filter(s =>
    s.nome.toLowerCase().includes(salaSearch.toLowerCase()) &&
    !salasSelecionadas.find(sel => sel.sid === s.sid)
  );

  function selectSala(sala) {
    setSalasSelecionadas(prev => [...prev, { sid: sala.sid, nome: sala.nome }]);
    setSalaSearch('');
  }

  function removeSala(sid) {
    setSalasSelecionadas(prev => prev.filter(s => s.sid !== sid));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.telefone && !telefoneValido(formData.telefone)) {
      setSubmitError('Telefone inválido. Use o formato +55 (XX) XXXXX-XXXX');
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      const novoAluno = await createAluno({
        ...formData,
        idade:    formData.idade ? parseInt(formData.idade) : null,
        nomePai1: formData.nomePai1 || null,
        nomePai2: formData.nomePai2 || null,
      });

      for (const sala of salasSelecionadas) {
        await addAlunoToSala(sala.sid, novoAluno.pid);
      }

      setFormData(emptyForm);
      setSalasSelecionadas([]);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Cadastrar Aluno</h1>

      {submitError && <p className="error-message">{submitError}</p>}

      <div className="form-body">
        <h2>Dados do Aluno</h2>
        <div className="form-grid">

          <div className="form-input nome">
            <label>Nome</label>
            <input type="text" name="nome" placeholder="Ex: João Pedro"
              value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-input data">
            <label>Data de Nascimento</label>
            <input type="date" name="dataNascimento"
              value={formData.dataNascimento} onChange={handleChange} required />
          </div>

          <div className="form-input idade">
            <label>Idade</label>
            <input type="number" name="idade" placeholder="Ex: 5"
              value={formData.idade} onChange={handleChange} min="0" max="18" />
          </div>

          <div className="form-input sexo">
            <label>Sexo</label>
            <select name="sexo" value={formData.sexo} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div className="form-input tel">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              placeholder="+55 (34) 99765-1344"
              value={formData.telefone}
              onChange={handleTelefone}
            />
            {formData.telefone && !telefoneValido(formData.telefone) && (
              <span className="field-hint">Ex: +55 (34) 99765-1344</span>
            )}
          </div>

          <div className="form-input pais">
            <label>Responsáveis</label>
            <input type="text" name="nomePai1" placeholder="Responsável 1"
              value={formData.nomePai1} onChange={handleChange} />
            <input type="text" name="nomePai2" placeholder="Responsável 2 (opcional)"
              value={formData.nomePai2} onChange={handleChange}
              style={{ marginTop: '8px' }} />
          </div>

          <div className="form-input end">
            <label>Endereço</label>
            <input type="text" name="endereco"
              placeholder="Ex: Rua do Limão, Bairro do Limoeiro"
              value={formData.endereco} onChange={handleChange} />
          </div>

          <div className="form-input numero">
            <label>Número</label>
            <input type="text" name="numero" placeholder="Ex: 365"
              value={formData.numero} onChange={handleChange} />
          </div>

        </div>

        <h2>Salas</h2>

        <div className="form-input alunosSearch">
          <label>Adicionar à sala</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Pesquisar sala..."
              value={salaSearch}
              onChange={e => { setSalaSearch(e.target.value); setSalaDropdownOpen(true); }}
              onFocus={() => setSalaDropdownOpen(true)}
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-editar"
              style={{ whiteSpace: 'nowrap', marginTop: 0 }}
              onClick={() => setSalaDropdownOpen(o => !o)}
            >
              {salaDropdownOpen ? 'Fechar ▲' : 'Ver todas ▼'}
            </button>
          </div>

          {salaDropdownOpen && (
            <ul className="search-dropdown">
              {salasFiltradas.length === 0 && (
                <li style={{ color: '#a0aec0', cursor: 'default' }}>Nenhuma sala encontrada</li>
              )}
              {salasFiltradas.map(s => (
                <li key={s.sid} onClick={() => { selectSala(s); setSalaDropdownOpen(false); }}>
                  <strong>{s.nome}</strong>
                  <span className="aluno-sala-badge">{s.tipo} · {s.turno}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {salasSelecionadas.length > 0 && (
          <div className="alunos-chips">
            {salasSelecionadas.map(s => (
              <span key={s.sid} className="aluno-chip">
                {s.nome}
                <button type="button" onClick={() => removeSala(s.sid)}>×</button>
              </span>
            ))}
          </div>
        )}

        <br />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
        </button>
      </div>

      <br />
      <AlunosListComp alunos={alunos} onDelete={deleteAluno} />
    </div>
  );
}
