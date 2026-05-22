import React, { useState } from 'react';

const SalaInfo = () => {
    const [formData, setFormData] = useState({
        nomeSala: '',
        tipoSala: '',
        turnoSala: '',
        horarioInicio: '',
        horarioTermino: '',
        alunos: ''
    });

    const [alunos, setAlunos] = useState([
        {
        id: 1,
        nome: "João Pedro Silva",
        totalAulas: 40,
        faltas: 3,
        diasFalta: ["03/03/2026", "10/03/2026", "17/03/2026"]
        },
        {
        id: 2,
        nome: "Maria Eduarda Santos",
        totalAulas: 40,
        faltas: 8,
        diasFalta: ["05/02/2026", "12/02/2026", "19/02/2026", "26/02/2026", "05/03/2026", "12/03/2026", "19/03/2026", "26/03/2026"]
        },
        {
        id: 3,
        nome: "Lucas Gabriel Oliveira",
        totalAulas: 40,
        faltas: 1,
        diasFalta: ["15/03/2026"]
        },
        {
        id: 4,
        nome: "Ana Beatriz Costa",
        totalAulas: 40,
        faltas: 12,
        diasFalta: ["01/02/2026", "08/02/2026", "15/02/2026", "22/02/2026", "01/03/2026", "08/03/2026", "15/03/2026", "22/03/2026", "29/03/2026", "05/04/2026", "12/04/2026", "19/04/2026"]
        },
        {
        id: 5,
        nome: "Pedro Henrique Lima",
        totalAulas: 40,
        faltas: 5,
        diasFalta: ["07/03/2026", "14/03/2026", "21/03/2026", "28/03/2026", "04/04/2026"]
        }
    ]);

    const [expandedStudent, setExpandedStudent] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados da Sala:', formData);
        alert('Sala cadastrada com sucesso!');
    };

    const calcularFrequencia = (totalAulas, faltas) => {
        const presencas = totalAulas - faltas;
        const percentual = (presencas / totalAulas) * 100;
        return percentual.toFixed(1);
    };

    const getFrequenciaClass = (percentual) => {
        if (percentual >= 75) return "frequencia-alta";
        if (percentual >= 50) return "frequencia-media";
        return "frequencia-baixa";
    };

    const toggleDetails = (studentId) => {
        if (expandedStudent === studentId) {
        setExpandedStudent(null);
        } else {
        setExpandedStudent(studentId);
        }
    };

    return (
        <div className="info-container">
        <h1>Cadastrar Sala</h1>
        <div className="form-body">
            <h2>Dados da Sala</h2>
            <div className="form-grid-sala">
            <div className="form-input nomeSala">
                <label>Nome Sala</label>
                <input
                type="text"
                name="nomeSala"
                placeholder="Segundo Período"
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
                placeholder="Primário"
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
                placeholder="Manhã"
                value={formData.turnoSala}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-input horarioInicio">
                <label>Horário Início</label>
                <input
                type="text"
                name="horarioInicio"
                placeholder="8:00"
                value={formData.horarioInicio}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-input horarioTermino">
                <label>Horário Término</label>
                <input
                type="text"
                name="horarioTermino"
                placeholder="12:00"
                value={formData.horarioTermino}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-input alunosLista">
                <label>Alunos</label>
                <input
                type="text"
                name="alunos"
                placeholder="João Pedro"
                value={formData.alunos}
                onChange={handleChange}
                required
                />
            </div>
            </div>
        </div>

        <br />
        <h2>Lista de Alunos</h2>
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

        <br />
      
        <h2>Frequência dos Alunos</h2>
      <div className="frequencia-container">

        <div className="frequencia-list-header">
          <div>Nome do Aluno</div>
          <div>Total de Faltas</div>
          <div>Frequência</div>
          <div></div>
        </div>

        <div className="frequencia-student-list">
          {alunos.map(aluno => {
            const frequencia = calcularFrequencia(aluno.totalAulas, aluno.faltas);
            const freqClass = getFrequenciaClass(frequencia);
            const isExpanded = expandedStudent === aluno.id;

            return (
              <div key={aluno.id} className="frequencia-student-item">
                <div 
                  className="frequencia-student-row"
                  onClick={() => toggleDetails(aluno.id)}
                >
                  <div className="frequencia-student-name">{aluno.nome}</div>
                  <div className="frequencia-total-faltas">{aluno.faltas}</div>
                  <div className={`frequencia-value ${freqClass}`}>{frequencia}%</div>
                  <div className={`frequencia-arrow ${isExpanded ? 'expanded' : ''}`}>▼</div>
                </div>
                
                <div className={`frequencia-absence-details ${isExpanded ? 'show' : ''}`}>
                  <div className="frequencia-details-content">
                    <div className="frequencia-details-title">Dias que faltou:</div>
                    <div className="frequencia-absence-dates">
                      {aluno.diasFalta.map((data, index) => (
                        <span key={index} className="frequencia-absence-date">{data}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalaInfo;