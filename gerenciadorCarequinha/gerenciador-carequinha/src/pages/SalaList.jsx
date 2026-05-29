import React, { useState } from 'react';
import { useSalas } from '../hooks/useSalas';
import SalasListComp from '../blueprints/SalasListComp';

function SalaList() {
    const [filtros, setFiltros] = useState({
        nome: '',
        tipo: '',
        id: '',
        turno: ''
    });

    const { salas, createSala, deleteSala, searchAlunos } = useSalas();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const limparFiltros = () => {
        setFiltros({
            nome: '',
            tipo: '',
            id: '',
            turno: ''
        });
    };

    const salasFiltradas = salas.filter(sala => {
        const matchNome = sala.nome.toLowerCase().includes(filtros.nome.toLowerCase());
        const matchTipo = sala.tipo.toLowerCase().includes(filtros.tipo.toLowerCase());
        const matchId = filtros.id === '' || sala.id.toString().includes(filtros.id);
        const matchTurno = sala.turno.toLowerCase().includes(filtros.turno.toLowerCase());
        return matchNome && matchTipo && matchId && matchTurno;
    });

    const totalAlunos = salasFiltradas.reduce((acc, sala) => acc + sala.alunos, 0);

    return (
        <div className="sala-list-container">
            <h1>Lista de Salas</h1>
            
            <div className="sala-stats-top">
                <div className="stats-card-top">
                    <span className="stats-label-top">Total de Salas</span>
                    <span className="stats-value-top">{salasFiltradas.length}</span>
                </div>
                <div className="stats-card-top">
                    <span className="stats-label-top">Total de Alunos</span>
                    <span className="stats-value-top">{totalAlunos}</span>
                </div>
            </div>

            <div className="filter-container">
                <div className="filter-input">
                    <input 
                        type="text" 
                        name="nome" 
                        placeholder="Nome da Sala" 
                        value={filtros.nome}
                        onChange={handleFilterChange}
                    />
                    <input 
                        type="text" 
                        name="tipo" 
                        placeholder="Tipo de Turma" 
                        value={filtros.tipo}
                        onChange={handleFilterChange}
                    />
                    <input 
                        type="text" 
                        name="id" 
                        placeholder="ID" 
                        value={filtros.id}
                        onChange={handleFilterChange}
                    />
                    <input 
                        type="text" 
                        name="turno" 
                        placeholder="Turno" 
                        value={filtros.turno}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-buttons">
                    <i className="bi bi-trash" onClick={limparFiltros} title="Limpar Filtros"></i>
                    <i className="bi bi-search" title="Buscar"></i>
                </div>
            </div>

            <div className="list-items">

                <SalasListComp salas={salas} onDelete={deleteSala} />
            </div>
        </div>
    );
}

export default SalaList;