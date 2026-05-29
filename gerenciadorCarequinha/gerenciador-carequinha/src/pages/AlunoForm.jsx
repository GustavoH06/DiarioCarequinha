import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/alunos';

const emptyForm = {
  nome: '',
  dataNascimento: '',
  telefone: '',
  nomePai: '',
  nomeMae: '',
  endereco: '',
  numero: '',
  sala: '',
  idade: '',
  sexo: '',
};

export default function AlunoForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

  async function fetchAlunos() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Erro ao buscar alunos');
      const data = await res.json();
      setAlunos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        idade: formData.idade ? parseInt(formData.idade) : null,
      };

      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao cadastrar aluno');

      const novoAluno = await res.json();
      setAlunos(prev => [...prev, novoAluno]);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pid) {
    try {
      const res = await fetch(`${API}/${pid}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao remover aluno');
      setAlunos(prev => prev.filter(a => a.pid !== pid));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-container">
      <h1>Cadastrar Aluno</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="form-body">
        <h2>Dados do Aluno</h2>
        <div className="form-grid">

          <div className="form-input nome">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: João Pedro"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input data">
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input idade">
            <label>Idade</label>
            <input
              type="number"
              name="idade"
              placeholder="Ex: 5"
              value={formData.idade}
              onChange={handleChange}
              min="0"
              max="18"
            />
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
              placeholder="Ex: (34)99765-1344"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-input sala">
            <label>Sala</label>
            <input
              type="text"
              name="sala"
              placeholder="Ex: Maternal 2"
              value={formData.sala}
              onChange={handleChange}
            />
          </div>

          <div className="form-input pais">
            <label>Nome dos Pais</label>
            <input
              type="text"
              name="nomePai"
              placeholder="Nome do pai"
              value={formData.nomePai}
              onChange={handleChange}
            />
            <input
              type="text"
              name="nomeMae"
              placeholder="Nome da mãe"
              value={formData.nomeMae}
              onChange={handleChange}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div className="form-input end">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Ex: Rua do Limão, Bairro do Limoeiro"
              value={formData.endereco}
              onChange={handleChange}
            />
          </div>

          <div className="form-input numero">
            <label>Número</label>
            <input
              type="text"
              name="numero"
              placeholder="Ex: 365"
              value={formData.numero}
              onChange={handleChange}
            />
          </div>

        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
        </button>
      </div>

      <br />

      <div className="list-items">
        <div className="item-list header">
          <label>ID</label>
          <label>Nome</label>
          <label>Sala</label>
          <label>Sexo</label>
          <label>Idade</label>
          <label>Ação</label>
        </div>

        {alunos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
            Nenhum aluno cadastrado.
          </p>
        )}

        {alunos.map(aluno => (
          <div className="item-list content" key={aluno.pid}>
            <label>{aluno.pid}</label>
            <label>{aluno.nome}</label>
            <label>{aluno.sala || '—'}</label>
            <label>{aluno.sexo || '—'}</label>
            <label>{aluno.idade || '—'}</label>
            <button onClick={() => handleDelete(aluno.pid)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
}
