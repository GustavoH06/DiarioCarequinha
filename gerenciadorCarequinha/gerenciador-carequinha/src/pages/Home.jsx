import classNames from "classnames";
import { useState } from "react";

function Home() {
    const [dashBlocks] = useState([
        {
            blockBackground: "#B7F281",
            label: "Salas",
            qtd: 5,
            icon: "bi bi-display",
            iconBackground: "#D2FDAA",
        },
        {
            blockBackground: "#FF9DEF",
            label: "Alunos",
            qtd: 73,
            icon: "bi bi-person",
            iconBackground: "#FFC8F5",
        }
    ]);

    const [salasList] = useState([
        { id: 1, periodo: "Berçario 1", turno: "Manhã", alunos: 17 },
        { id: 2, periodo: "Berçario 2", turno: "Tarde", alunos: 14 },
        { id: 3, periodo: "Maternal 1", turno: "Manhã", alunos: 15 },
        { id: 4, periodo: "Maternal 2", turno: "Tarde", alunos: 13 },
        { id: 5, periodo: "Jardim 1", turno: "Manhã", alunos: 18 },
    ]);

    return (
        <div className="home-container">
            <div className="dashboard-column">
                {/* Dashboard Cards */}
                <div className="dashboard">
                    <div className="home-title">
                        <h2>Dashboard</h2>
                    </div>

                    <div className="dashBlock-container">
                        {dashBlocks.map((dashItems, index) => (
                            <div key={index} className="dash-block" style={{ backgroundColor: dashItems.blockBackground }}>
                                <div className="dashBlock-left">
                                    <i
                                        style={{ backgroundColor: dashItems.iconBackground }}
                                        className={classNames({
                                            "dashblock-icon": true,
                                            [dashItems.icon]: true,
                                        })}
                                    ></i>
                                </div>
                                <div className="dashBlock-right">
                                    <span className="dash-label">{dashItems.label}</span>
                                    <span className="dash-qtd">{dashItems.qtd}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lista de Salas */}
                <div className="salas-list">
                    <div className="home-title">
                        <h2>Lista de Salas</h2>
                    </div>
                    <div className="list-container">
                        <div className="item-list header">
                            <label className="col-id-home">ID</label>
                            <label className="col-periodo-home">Período</label>
                            <label className="col-turno-home">Turno</label>
                            <label className="col-alunos-home">Alunos</label>
                        </div>

                        {salasList.map((sala) => (
                            <div key={sala.id} className="item-list content">
                                <label className="col-id-home">{sala.id}</label>
                                <label className="col-periodo-home">{sala.periodo}</label>
                                <label className="col-turno-home">
                                    <span className={`turno-badge ${sala.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
                                        {sala.turno}
                                    </span>
                                </label>
                                <label className="col-alunos-home">
                                    <span className="alunos-count">{sala.alunos}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coluna de Notas/Informações */}
            <div className="notes-column">
                <div className="notes-header-section">
                    <h3>Informações do Professor</h3>
                </div>
                <div className="notes-container">
                    <div className="info-row">
                        <span className="info-label">Professor:</span>
                        <span className="info-value">João da Silva</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Turno:</span>
                        <span className="info-value">Tarde</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Qtd Alunos:</span>
                        <span className="info-value">16</span>
                    </div>
                    <div className="divider"></div>
                    <div className="info-row">
                        <span className="info-label">Horário Início:</span>
                        <span className="info-value">09:00</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Horário Término:</span>
                        <span className="info-value">12:00</span>
                    </div>
                    <div className="divider"></div>
                    
                    <div className="notes-section">
                        <div className="notes-header">
                            <span>Anotações</span>
                            <div className="notes-line"></div>
                        </div>
                        <div className="notes-textarea">
                            <textarea 
                                placeholder="Digite suas observações aqui..."
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <div className="calendar-info">
                        <div className="calendar-header">
                            <span>Próximos Eventos</span>
                        </div>
                        <div className="calendar-event">
                            <span className="event-date">15/06</span>
                            <span className="event-name">Reunião de Pais</span>
                        </div>
                        <div className="calendar-event">
                            <span className="event-date">20/06</span>
                            <span className="event-name">Festa Junina</span>
                        </div>
                        <div className="calendar-event">
                            <span className="event-date">30/06</span>
                            <span className="event-name">Entrega de Notas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;