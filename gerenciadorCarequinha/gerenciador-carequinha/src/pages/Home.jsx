import classNames from "classnames";
import { useState } from "react";
import SalasListComp from "../blueprints/SalasListComp";
import { useSalas } from "../hooks/useSalas";
import { useAlunos } from "../hooks/useAlunos";
import { useNavigate } from 'react-router';

function Home() {
    const { salas, deleteSala } = useSalas();
    const { alunos } = useAlunos();

    const navigate = useNavigate();
    
    const [selectedSala, setSelectedSala] = useState(null);
    const [salaInfo, setSalaInfo] = useState(null);
    const [loadingInfo, setLoadingInfo] = useState(false);

    const totalSalas = salas?.length || 0;
    const totalAlunos = alunos?.length || 0;

    const dashBlocks = [
        {
            blockBackground: "#B7F281",
            label: "Salas",
            qtd: totalSalas,
            icon: "bi bi-display",
            iconBackground: "#D2FDAA",
            route: "/sala-list/"
        },
        {
            blockBackground: "#FF9DEF",
            label: "Alunos",
            qtd: totalAlunos,
            icon: "bi bi-person",
            iconBackground: "#FFC8F5",
            route: "/aluno-list/"
        }
    ];

    async function handleSelectSala(sala) {
        setSelectedSala(sala);
        setLoadingInfo(true);
        
        try {
            const response = await fetch(`http://localhost:5000/api/salas/${sala.sid}`);
            if (response.ok) {
                const data = await response.json();
                setSalaInfo(data);
            } else {
                setSalaInfo(null);
            }
        } catch (error) {
            console.error('Erro ao carregar informações da sala:', error);
            setSalaInfo(null);
        } finally {
            setLoadingInfo(false);
        }
    }

    return (
        <div className="home-container">
            <div className="dashboard-column">
                <div className="dashboard">
                    <div className="home-title">
                        <h2>Dashboard</h2>
                    </div>

                    <div className="dashBlock-container">
                        
                        {dashBlocks.map((dashItems, index) => (
                            <div key={index} className="dash-block" style={{ backgroundColor: dashItems.blockBackground }} onClick={() => navigate(dashItems.route)}>
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

                    <SalasListComp 
                        salas={salas} 
                        onDelete={deleteSala}
                        onSelect={handleSelectSala}
                    />
                </div>
            </div>

            <div className="notes-column">
                <div className="notes-header-section">
                    <h3>Informações da Sala</h3>
                </div>
                <div className="notes-container">
                    {loadingInfo && (
                        <div className="loading-message-small">Carregando informações...</div>
                    )}
                    
                    {!loadingInfo && !selectedSala && (
                        <div className="empty-info-message">
                            <i className="bi bi-info-circle"></i>
                            <p>Clique em uma sala para ver suas informações</p>
                        </div>
                    )}

                    {!loadingInfo && selectedSala && salaInfo && (
                        <>
                            <div className="info-row">
                                <span className="info-label">Sala:</span>
                                <span className="info-value">{salaInfo.nome}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tipo:</span>
                                <span className="info-value">{salaInfo.tipo || '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Turno:</span>
                                <span className="info-value">{salaInfo.turno || '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Qtd Alunos:</span>
                                <span className="info-value">{salaInfo.totalAlunos || 0}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="info-row">
                                <span className="info-label">Horário Início:</span>
                                <span className="info-value">{salaInfo.horarioInicio || '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Horário Término:</span>
                                <span className="info-value">{salaInfo.horarioTermino || '—'}</span>
                            </div>
                            <div className="divider"></div>
                            
                            {salaInfo.alunos && salaInfo.alunos.length > 0 && (
                                <div className="alunos-info-section">
                                    <div className="notes-header">
                                        <span>Alunos da Sala</span>
                                        <div className="notes-line"></div>
                                    </div>
                                    <div className="alunos-info-list">
                                        {salaInfo.alunos.map(aluno => (
                                            <div key={aluno.pid} className="aluno-info-item">
                                                <span className="aluno-info-nome">{aluno.nome}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!loadingInfo && selectedSala && !salaInfo && (
                        <div className="empty-info-message">
                            <p>Não foi possível carregar as informações da sala</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;