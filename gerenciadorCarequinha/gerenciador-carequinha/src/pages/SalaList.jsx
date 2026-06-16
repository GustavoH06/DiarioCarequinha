import { useState } from 'react';
import { useSalas } from '../hooks/useSalas';
import SalasListComp from '../blueprints/SalasListComp';
import { useNavigate } from 'react-router';

function SalaList() {
    const { salas, deleteSala } = useSalas();
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({ nome: '', tipo: '', id: '', turno: '' });

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    function limparFiltros() {
        setFiltros({ nome: '', tipo: '', id: '', turno: '' });
    }

    const salasFiltradas = salas.filter(sala => {
        const matchNome  = sala.nome.toLowerCase().includes(filtros.nome.toLowerCase());
        const matchTipo  = sala.tipo.toLowerCase().includes(filtros.tipo.toLowerCase());
        const matchTurno = sala.turno.toLowerCase().includes(filtros.turno.toLowerCase());
        const matchId    = filtros.id === '' || sala.sid.toString().includes(filtros.id);
        return matchNome && matchTipo && matchTurno && matchId;
    });

    return (
        <div className="sala-list-container">
            <h1>Lista de Salas</h1>

            <div className="sala-stats-top">
                <div className="stats-card-top">
                    <span className="stats-label-top">Total de Salas</span>
                    <span className="stats-value-top">{salasFiltradas.length}</span>
                </div>
                <div className="stats-card-top" onClick={() => navigate('/sala-form')}
                    style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #68d391, #38a169)', maxWidth: '200px' }}>
                    <span className="stats-label-top">+ Nova Sala</span>
                </div>
            </div>

            <div className="filter-container">
                <div className="filter-input">
                    <input type="text" name="nome"  placeholder="Nome da Sala"
                        value={filtros.nome}  onChange={handleFilterChange} />
                    <input type="text" name="tipo"  placeholder="Tipo de Turma"
                        value={filtros.tipo}  onChange={handleFilterChange} />
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

            <SalasListComp salas={salasFiltradas} onDelete={deleteSala} />
        </div>
    );
}

export default SalaList;
