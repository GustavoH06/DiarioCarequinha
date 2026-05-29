import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import AlunosListComp from '../blueprints/AlunosListComp';

const emptyForm = {
  nome: '',
  dataNascimento: '',
  telefone: '',
  responsavel1: '',
  responsavel2: '',
  endereco: '',
  numero: '',
  sala: '',
  idade: '',
  sexo: '',
};

export default function AlunoForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { alunos, deleteAluno, createAluno } = useAlunos();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    try {
      await createAluno({
        ...formData,
        idade:        formData.idade        ? parseInt(formData.idade) : null,
        responsavel1: formData.responsavel1 || null,
        responsavel2: formData.responsavel2 || null,
      });
      setFormData(emptyForm);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Cadastrar Aluno</h1>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

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
            <input type="tel" name="telefone" placeholder="Ex: (34)99765-1344"
              value={formData.telefone} onChange={handleChange} />
          </div>

          <div className="form-input sala">
            <label>Sala</label>
            <input type="text" name="sala" placeholder="Ex: Maternal 2"
              value={formData.sala} onChange={handleChange} />
          </div>

          <div className="form-input responsaveis">
            <label>Responsáveis</label>
            <input type="text" name="responsavel1" placeholder="Responsável 1"
              value={formData.responsavel1} onChange={handleChange} />
            <input type="text" name="responsavel2" placeholder="Responsável 2 (opcional)"
              value={formData.responsavel2} onChange={handleChange}
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

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
        </button>
      </div>

      <br />

      <AlunosListComp alunos={alunos} onDelete={deleteAluno} />
    </div>
  );
}
