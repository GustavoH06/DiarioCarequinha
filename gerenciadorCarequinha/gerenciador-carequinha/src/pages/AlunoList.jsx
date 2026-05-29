import React, { useState } from 'react';

function AlunoList() {
    const [filtros, setFiltros] = useState({
        nome: '',
        turno: '',
        id: '',
        sala: ''
    });

    const [alunos] = useState([
        { id: 1, nome: "João Pedro Silva", sala: "Berçario 1", sexo: "Masculino", idade: 6, turno: "Manhã" },
        { id: 2, nome: "Maria Eduarda Santos", sala: "Berçario 2", sexo: "Feminino", idade: 5, turno: "Tarde" },
        { id: 3, nome: "Lucas Gabriel Oliveira", sala: "Maternal 1", sexo: "Masculino", idade: 4, turno: "Manhã" },
        { id: 4, nome: "Ana Beatriz Costa", sala: "Maternal 2", sexo: "Feminino", idade: 5, turno: "Tarde" },
        { id: 5, nome: "Pedro Henrique Lima", sala: "Jardim 1", sexo: "Masculino", idade: 6, turno: "Manhã" },
        { id: 6, nome: "Beatriz Cristina Rocha", sala: "Jardim 2", sexo: "Feminino", idade: 5, turno: "Tarde" },
        { id: 7, nome: "Rafael Almeida Santos", sala: "Primeiro Período", sexo: "Masculino", idade: 7, turno: "Manhã" },
        { id: 8, nome: "Camila Fernandes Lima", sala: "Segundo Período", sexo: "Feminino", idade: 8, turno: "Tarde" },
    ]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const limparFiltros = () => {
        setFiltros({
            nome: '',
            turno: '',
            id: '',
            sala: ''
        });
    };

    const alunosFiltrados = alunos.filter(aluno => {
        const matchNome = aluno.nome.toLowerCase().includes(filtros.nome.toLowerCase());
        const matchTurno = aluno.turno.toLowerCase().includes(filtros.turno.toLowerCase());
        const matchId = filtros.id === '' || aluno.id.toString().includes(filtros.id);
        const matchSala = aluno.sala.toLowerCase().includes(filtros.sala.toLowerCase());
        return matchNome && matchTurno && matchId && matchSala;
    });

    return (
        <div className="aluno-list-container">
            <h1>Lista de Alunos</h1>
            
            <div className="aluno-stats-top">
                <div className="stats-card-top">
                    <span className="stats-label-top">Total de Alunos</span>
                    <span className="stats-value-top">{alunosFiltrados.length}</span>
                </div>
                <div className="stats-card-top">
                    <span className="stats-label-top">Masculino</span>
                    <span className="stats-value-top">{alunosFiltrados.filter(a => a.sexo === 'Masculino').length}</span>
                </div>
                <div className="stats-card-top">
                    <span className="stats-label-top">Feminino</span>
                    <span className="stats-value-top">{alunosFiltrados.filter(a => a.sexo === 'Feminino').length}</span>
                </div>
            </div>

            <div className="filter-container">
                <div className="filter-input">
                    <input 
                        type="text" 
                        name="nome" 
                        placeholder="Nome do Aluno" 
                        value={filtros.nome}
                        onChange={handleFilterChange}
                    />
                    <input 
                        type="text" 
                        name="turno" 
                        placeholder="Turno" 
                        value={filtros.turno}
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
                        name="sala" 
                        placeholder="Sala" 
                        value={filtros.sala}
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
                    <label className="col-id-aluno">ID</label>
                    <label className="col-nome-aluno">Nome</label>
                    <label className="col-sala-aluno">Sala</label>
                    <label className="col-sexo-aluno">Sexo</label>
                    <label className="col-idade-aluno">Idade</label>
                    <label className="col-turno-aluno">Turno</label>
                    <label className="col-acoes-aluno">Ações</label>
                </div>

                {alunosFiltrados.length > 0 ? (
                    alunosFiltrados.map((aluno) => (
                        <div key={aluno.id} className="item-list content">
                            <label className="col-id-aluno">{aluno.id}</label>
                            <label className="col-nome-aluno">{aluno.nome}</label>
                            <label className="col-sala-aluno">{aluno.sala}</label>
                            <label className="col-sexo-aluno">
                                <span className={`sexo-badge ${aluno.sexo === 'Masculino' ? 'sexo-m' : 'sexo-f'}`}>
                                    {aluno.sexo === 'Masculino' ? 'M' : 'F'}
                                </span>
                            </label>
                            <label className="col-idade-aluno">{aluno.idade} anos</label>
                            <label className="col-turno-aluno">
                                <span className={`turno-badge ${aluno.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
                                    {aluno.turno}
                                </span>
                            </label>
                            <label className="col-acoes-aluno">
                                <i className="bi bi-eye acao-icon" title="Visualizar"></i>
                                <i className="bi bi-pencil acao-icon" title="Editar"></i>
                                <i className="bi bi-trash acao-icon" title="Excluir"></i>
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="item-list empty">
                        <label>Nenhum aluno encontrado</label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AlunoList;