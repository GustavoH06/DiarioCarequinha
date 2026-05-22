import React, { useState } from 'react';

  const SalaForm = () => {
    const [formData, setFormData] = useState({
    nomeSala: '',
    tipoSala: '',
    turnoSala: '',
    horarioInicio: '',
    horarioTermino: '',
    alunos: ''
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
      <h1>Cadastrar Sala</h1>
      <div className="form-body">
        <h2>Dados da Sala</h2>
        <div className="form-grid-sala">
          <div className="form-input nome">
            <label>Nome Sala</label>
            <input
              type="text"
              name="nomeSala"
              placeholder="Ex: Segundo Período"
              value={formData.nomeSala}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input tipoSala">
            <label>Tipo Sala</label>
            <input
              type="text"
              name="tipoSala"
              placeholder="Ex: Primário"
              value={formData.tipoSala}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input turnoSala">
            <label>Turno</label>
            <input
              type="text"
              name="turnoSala"
              placeholder="Ex: Manhã"
              value={formData.turnoSala}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input horarioInicio">
            <label>Horário Inicio</label>
            <input
              type="text"
              name="horarioInicio"
              placeholder="Ex: 8:00"
              value={formData.horarioInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input horarioTermino">
            <label>HorarioTermino</label>
            <input
              type="text"
              name="horarioTermino"
              placeholder="Ex: 12:00"
              value={formData.horarioTermino}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input alunosLista">
            <label>Alunos</label>
            <input
              type="text"
              name="horarioLista"
              placeholder="Ex: João Pedro"
              value={formData.alunos}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <br />
      <div className="list-items">
          <div className="item-list header">
              <label>Id</label>
              <label>Nome</label>
              <label>Tipo</label>
              <label>Turno</label>
              <label>Alunos</label>
          </div>

          <div className="item-list content">
              <label>1</label>
              <label>Berçario 1</label>
              <label>Berçario</label>
              <label>Manhã</label>
              <label>17</label>
          </div>
      </div>
    </div>
  );
}

export default SalaForm;