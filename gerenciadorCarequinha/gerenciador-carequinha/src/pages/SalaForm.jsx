import React, { useState } from 'react';

  const SalaForm = () => {
    const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    dataNascimento: '',
    telefone: '',
    sexo: 'menino',
    nomePai: '',
    nomeMae: '',
    endereco: '',
    numero: '',
    sala: 'maternal2'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      if (checked) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Aluno:', formData);
    alert('Aluno cadastrado com sucesso!');
  };

  return (
    <div className="form-container">
        <h1>Cadastrar Aluno</h1>
      <div className="register-card">
        
        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Dados do Aluno</h2>
          
          <div className="form-grid">
            {/* Linha 1: Nome | Idade */}
            <div className="grid-row">
              <div className="grid-cell label-cell">Nome</div>
              <div className="grid-cell input-cell">
                <input
                  type="text"
                  name="nome"
                  placeholder="Ex: João Pedro"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>
              <div className="grid-cell label-cell">Idade</div>
              <div className="grid-cell input-cell">
                <input
                  type="text"
                  name="idade"
                  placeholder="Ex: 05"
                  value={formData.idade}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 2: Data de Nascimento | Telefone | Sexo */}
            <div className="grid-row">
              <div className="grid-cell label-cell">Data de Nascimento</div>
              <div className="grid-cell input-cell">
                <input
                  type="text"
                  name="dataNascimento"
                  placeholder="Ex: 03/12/2026"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                />
              </div>
              <div className="grid-cell label-cell">Telefone</div>
              <div className="grid-cell input-cell">
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Ex: (34)99765-1344"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid-cell label-cell">Sexo</div>
              <div className="grid-cell radio-cell">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sexo"
                    value="menino"
                    checked={formData.sexo === 'menino'}
                    onChange={handleChange}
                  />
                  Menino
                </label>
              </div>
            </div>

            {/* Linha 3: Nome dos Pais (ocupando 2 colunas) */}
            <div className="grid-row">
              <div className="grid-cell label-cell">Nome dos Pais</div>
              <div className="grid-cell input-cell" colSpan="3">
                <input
                  type="text"
                  name="nomePai"
                  placeholder="Ex: Arthur Arantes Almêida"
                  value={formData.nomePai}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 4: Nome da Mãe (sem label, apenas input) */}
            <div className="grid-row">
              <div className="grid-cell empty-cell"></div>
              <div className="grid-cell input-cell" colSpan="3">
                <input
                  type="text"
                  name="nomeMae"
                  placeholder="Ex: Carmen Cristina Caixeta"
                  value={formData.nomeMae}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 5: Endereço | Número */}
            <div className="grid-row">
              <div className="grid-cell label-cell">Endereço</div>
              <div className="grid-cell input-cell">
                <input
                  type="text"
                  name="endereco"
                  placeholder="Ex: Rua do Limão, Bairro do Limoeiro"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              <div className="grid-cell label-cell">Número</div>
              <div className="grid-cell input-cell">
                <input
                  type="text"
                  name="numero"
                  placeholder="Ex: 365"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 6: Sala */}
            <div className="grid-row">
              <div className="grid-cell label-cell">Sala</div>
              <div className="grid-cell radio-group-cell" colSpan="3">
                <div className="radio-group-horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sala"
                      value="maternal1"
                      checked={formData.sala === 'maternal1'}
                      onChange={handleChange}
                    />
                    Maternal 1
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sala"
                      value="maternal2"
                      checked={formData.sala === 'maternal2'}
                      onChange={handleChange}
                    />
                    Maternal 2
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sala"
                      value="jardim1"
                      checked={formData.sala === 'jardim1'}
                      onChange={handleChange}
                    />
                    Jardim 1
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sala"
                      value="jardim2"
                      checked={formData.sala === 'jardim2'}
                      onChange={handleChange}
                    />
                    Jardim 2
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Cadastrar Aluno
          </button>
        </form>
      </div>
    </div>
  );
}

export default SalaForm;