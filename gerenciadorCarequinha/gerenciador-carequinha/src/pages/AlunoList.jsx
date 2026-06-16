import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import AlunosListComp from '../blueprints/AlunosListComp';
import { useNavigate } from 'react-router';

function AlunoList() {
    const { alunos, deleteAluno } = useAlunos();
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({ nome: '', turno: '', id: '', sala: '' });

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    function limparFiltros() {
        setFiltros({ nome: '', turno: '', id: '', sala: '' });
    }

    const alunosFiltrados = alunos.filter(aluno => {
        const matchNome = aluno.nome.toLowerCase().includes(filtros.nome.toLowerCase());
        const matchId   = filtros.id === '' || aluno.pid.toString().includes(filtros.id);
        const nomeSalas = aluno.salas?.map(s => s.nome.toLowerCase()).join(' ') || '';
        const matchSala = nomeSalas.includes(filtros.sala.toLowerCase());
        
        const turnoSalas = aluno.salas?.map(s => (s.turno || '').toLowerCase()).join(' ') || '';
        const matchTurno = turnoSalas.includes(filtros.turno.toLowerCase());
        return matchNome && matchId && matchSala && (filtros.turno === '' || matchTurno);
    });

    return (
        <div className="aluno-list-container">
            <h1>Lista de Alunos</h1>

            <div className="aluno-stats-top">
                <div className="stats-card-top">
                    <span className="stats-label-top">Total de Alunos</span>
                    <span className="stats-value-top">{alunosFiltrados.length}</span>
                </div>
                <div className="stats-card-top" onClick={() => navigate('/aluno-form')}
                    style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #68d391, #38a169)', maxWidth: '200px' }}>
                    <span className="stats-label-top">+ Novo Aluno</span>
                </div>
            </div>

            <div className="filter-container">
                <div className="filter-input">
                    <input type="text" name="nome"  placeholder="Nome do Aluno"
                        value={filtros.nome}  onChange={handleFilterChange} />
                    <input type="text" name="sala"  placeholder="Sala"
                        value={filtros.sala}  onChange={handleFilterChange} />
                    <input type="text" name="id"    placeholder="ID"
                        value={filtros.id}    onChange={handleFilterChange} />
                    <input type="text" name="turno" placeholder="Turno"
                        value={filtros.turno} onChange={handleFilterChange} />
                </div>
                <div className="filter-buttons">
                    <i className="bi bi-trash"  onClick={limparFiltros} title="Limpar Filtros" />
                    <i className="bi bi-search" title="Buscar" />
                </div>
            </div>

            <AlunosListComp alunos={alunosFiltrados} onDelete={deleteAluno} />
        </div>
    );
}

export default AlunoList;
