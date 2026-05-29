import React, { useState } from 'react';

function SalaList() {
    const [filtros, setFiltros] = useState({
        nome: '',
        tipo: '',
        id: '',
        turno: ''
    });

    const [salas] = useState([
        { id: 1, nome: "Berçario 1", tipo: "Berçario", turno: "Manhã", alunos: 17 },
        { id: 2, nome: "Berçario 2", tipo: "Berçario", turno: "Tarde", alunos: 14 },
        { id: 3, nome: "Maternal 1", tipo: "Maternal", turno: "Manhã", alunos: 15 },
        { id: 4, nome: "Maternal 2", tipo: "Maternal", turno: "Tarde", alunos: 13 },
        { id: 5, nome: "Jardim 1", tipo: "Jardim", turno: "Manhã", alunos: 18 },
        { id: 6, nome: "Jardim 2", tipo: "Jardim", turno: "Tarde", alunos: 16 },
        { id: 7, nome: "Primeiro Período", tipo: "Primário", turno: "Manhã", alunos: 20 },
        { id: 8, nome: "Segundo Período", tipo: "Primário", turno: "Tarde", alunos: 19 },
    ]);

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
                <div className="item-list header">
                    <label className="col-id-sala">ID</label>
                    <label className="col-nome-sala">Nome</label>
                    <label className="col-tipo-sala">Tipo</label>
                    <label className="col-turno-sala">Turno</label>
                    <label className="col-alunos-sala">Alunos</label>
                    <label className="col-acoes-sala">Ações</label>
                </div>

                {salasFiltradas.length > 0 ? (
                    salasFiltradas.map((sala) => (
                        <div key={sala.id} className="item-list content">
                            <label className="col-id-sala">{sala.id}</label>
                            <label className="col-nome-sala">{sala.nome}</label>
                            <label className="col-tipo-sala">
                                <span className={`tipo-badge ${sala.tipo === 'Berçario' ? 'tipo-bercario' : sala.tipo === 'Maternal' ? 'tipo-maternal' : sala.tipo === 'Jardim' ? 'tipo-jardim' : 'tipo-primario'}`}>
                                    {sala.tipo}
                                </span>
                            </label>
                            <label className="col-turno-sala">
                                <span className={`turno-badge ${sala.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
                                    {sala.turno}
                                </span>
                            </label>
                            <label className="col-alunos-sala">
                                <span className="alunos-count">{sala.alunos}</span>
                            </label>
                            <label className="col-acoes-sala">
                                <i className="bi bi-eye acao-icon" title="Visualizar"></i>
                                <i className="bi bi-pencil acao-icon" title="Editar"></i>
                                <i className="bi bi-trash acao-icon" title="Excluir"></i>
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="item-list empty">
                        <label>Nenhuma sala encontrada</label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalaList;