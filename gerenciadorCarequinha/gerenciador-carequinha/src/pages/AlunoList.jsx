import React, { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import AlunosListComp from '../blueprints/AlunosListComp';
import { useNavigate } from 'react-router';


function AlunoList() {

    const { alunos, deleteAluno } = useAlunos();
    
    const navigate = useNavigate();


    const totalAlunos = alunos?.length || 0;


    return (
        <div className="aluno-list-container">
            <h1>Lista de Alunos</h1>
            
            <div className="aluno-stats-top">
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
                        placeholder="Nome do Aluno"
                    />
                    <input 
                        type="text" 
                        name="turno" 
                        placeholder="Turno"
                    />
                    <input 
                        type="text" 
                        name="id" 
                        placeholder="ID"
                    />
                    <input 
                        type="text" 
                        name="sala" 
                        placeholder="Sala"
                    />
                </div>
                <div className="filter-buttons">
                    <i className="bi bi-search" title="Buscar"></i>
                </div>
            </div>

            <div 
                className="stats-card-top" 
                onClick={() => navigate("/aluno-form/")}
                style={{cursor: 'pointer', marginBottom: '20px', justifyContent: 'center', background: 'green'}}
            >
                <span className="stats-label-top" >Cadastrar Aluno</span>
            </div>

            <div className="list-items">
                <AlunosListComp alunos={alunos} onDelete={deleteAluno} />
            </div>
        </div>
    );
}

export default AlunoList;