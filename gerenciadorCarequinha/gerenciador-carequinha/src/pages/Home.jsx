import classNames from "classnames";
import { useState } from "react";
import SalasListComp from "../blueprints/SalasListComp";
import { useSalas } from "../hooks/useSalas";

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

    const { salas, createSala, deleteSala, searchAlunos } = useSalas();

    return (
        <div className="home-container">
            <div className="dashboard-column">
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

                <div className="salas-list">
                    <div className="home-title">
                        <h2>Lista de Salas</h2>
                    </div>

                    <SalasListComp salas={salas} onDelete={deleteSala} />
                </div>
            </div>

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