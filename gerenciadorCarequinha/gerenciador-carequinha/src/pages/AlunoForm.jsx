import React, { useState } from 'react';

  const AlunoForm = () => {
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
    sala: ''
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
            type="text"
            name="dataNascimento"
            placeholder="Ex: 03/12/2026"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-input tel">
          <label>Telefone</label>
          <input
            type="tel"
            name="telefone"
            placeholder="Ex: (34)99765-1344"
            value={formData.telefone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-input pais">
          <label>Nome dos Pais</label>
          <input
            type="text"
            name="nomePai"
            placeholder="Ex: Arthur Arantes Almêida"
            value={formData.nomePai}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nomeMae"
            placeholder="Ex: Carmen Cristina Caixeta"
            value={formData.nomeMae}
            onChange={handleChange}
            required
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
            required
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
            required
          />
        </div>

        <div className="form-input idade">
          <label>Idade</label>
          <input
            type="text"
            name="idade"
            placeholder="Ex: 05"
            value={formData.idade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-input sexo">
          <label>Sexo</label>
          <input
            type="text"
            name="sexo"
            placeholder="Ex: Menino"
            value={formData.sexo}
            onChange={handleChange}
            required
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
            required
          />
        </div>
      </div>
    </div>
  </div>
  );
}

export default AlunoForm;