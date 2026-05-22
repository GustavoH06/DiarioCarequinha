import React, { useState } from 'react';

const AlunoInfo = () => {
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
    const [expandedCompetencia, setExpandedCompetencia] = useState(null);
    const [expandedSubCompetencia, setExpandedSubCompetencia] = useState({});

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

    const toggleCompetencia = (competenciaId) => {
        if (expandedCompetencia === competenciaId) {
            setExpandedCompetencia(null);
        } else {
            setExpandedCompetencia(competenciaId);
        }
    };

    const toggleSubCompetencia = (competenciaId, subId) => {
        const key = `${competenciaId}-${subId}`;
        setExpandedSubCompetencia(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Dados das competências
    const competenciasData = [
        {
            id: 1,
            titulo: "Competência 01",
            descricao: "Valores Humanos",
            itens: [
                { id: "1D1", texto: "Conhece sua história pessoal e valoriza positivamente sua experiência de vida." },
                { id: "1D2", texto: "Reconhece seus dons e talentos e os do próximo." },
                { id: "1D3", texto: "Faz opções e escolhas adequadas considerando o bem e o mal." },
                { id: "1D4", texto: "Busca soluções para seus conflitos." },
                { id: "1D5", texto: "Convive sem preconceito respeitando fatos e ou situações." },
                { id: "1D6", texto: "Busca por meio de experiências, a aprimoração de atitudes e valores." },
                { id: "1D7", texto: "Demonstra harmonia entre pensamento, palavra e ação." }
            ]
        },
        {
            id: 2,
            titulo: "Competência 02",
            descricao: "Autocuidado e Responsabilidade",
            itens: [
                { id: "2D1", texto: "Responsabiliza-se por seus atos." },
                { id: "2D2", texto: "Cuida da sua higiene." },
                { id: "2D3", texto: "Cuida do seu material com zelo." },
                { id: "2D4", texto: "Cuida do material da escola." }
            ]
        }
    ];

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

            <h2>Competências</h2>
            <div className="competencias-container">
                {competenciasData.map(competencia => {
                    const isCompExpanded = expandedCompetencia === competencia.id;
                    
                    return (
                        <div key={competencia.id} className="competencia-card">
                            <div 
                                className="competencia-header"
                                onClick={() => toggleCompetencia(competencia.id)}
                            >
                                <div className="competencia-titulo-area">
                                    <span className="competencia-numero">{competencia.titulo}</span>
                                    <span className="competencia-descricao">{competencia.descricao}</span>
                                </div>
                                <div className={`competencia-arrow ${isCompExpanded ? 'expanded' : ''}`}>▼</div>
                            </div>

                            <div className={`competencia-subitens ${isCompExpanded ? 'show' : ''}`}>
                                {competencia.itens.map(item => {
                                    const subKey = `${competencia.id}-${item.id}`;
                                    const isSubExpanded = expandedSubCompetencia[subKey];
                                    
                                    return (
                                        <div key={item.id} className="subitem-container">
                                            <div 
                                                className="subitem-header"
                                                onClick={() => toggleSubCompetencia(competencia.id, item.id)}
                                            >
                                                <span className="subitem-id">{item.id}</span>
                                                <span className="subitem-texto">{item.texto}</span>
                                                <div className={`subitem-arrow ${isSubExpanded ? 'expanded' : ''}`}>▼</div>
                                            </div>
                                            
                                            <div className={`subitem-avaliacao ${isSubExpanded ? 'show' : ''}`}>
                                                <div className="avaliacao-content">
                                                    <div className="avaliacao-opcoes">
                                                        <label className="avaliacao-label">
                                                            <input type="radio" name={`${item.id}-avaliacao`} value="S" />
                                                            Satisfatório
                                                        </label>
                                                        <label className="avaliacao-label">
                                                            <input type="radio" name={`${item.id}-avaliacao`} value="PS" />
                                                            Parcialmente Satisfatório
                                                        </label>
                                                        <label className="avaliacao-label">
                                                            <input type="radio" name={`${item.id}-avaliacao`} value="NS" />
                                                            Não Satisfatório
                                                        </label>
                                                    </div>
                                                    <textarea 
                                                        className="avaliacao-obs" 
                                                        placeholder="Observações (opcional)..."
                                                        rows="2"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlunoInfo;