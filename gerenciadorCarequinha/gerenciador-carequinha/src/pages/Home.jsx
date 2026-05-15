import classNames from "classnames";

function Home(){
    const dashBlocks = [
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
    ];


    return (
        <div className="home-container">

            <div className="dashboard-column">
                <div className="dashboard">
                    <div className="home-title">
                        <h2>Dashboard</h2>
                    </div>

                    <div className="dashBlock-container">
                        {dashBlocks.map(dashItems =>
                        <div key={dashItems.label} className="dash-block" style={{backgroundColor: dashItems.blockBackground}}>
                            <div className="dashBlock-left">
                                <i
                                    style={{backgroundColor: dashItems.iconBackground}}
                                    className={classNames({
                                        "dashblock-icon": true,
                                        [dashItems.icon]: true,
                                    })}
                                >
                                </i>
                            </div>
                            <div className="dashBlock-right">
                                <span>{dashItems.label}</span>
                                <span>{dashItems.qtd}</span>
                            </div>
                        </div>
                        )}

                    </div>
                </div>

                <div className="salas-list">
                    <div className="home-title">
                        <h2>Lista</h2>
                    </div>
                    <div className="list-container">
                        <div className="item-list header">
                            <label>Id</label>
                            <label>Período</label>
                            <label>Turno</label>
                            <label>Alunos</label>
                        </div>

                        <div className="item-list content">
                            <label>1</label>
                            <label>3</label>
                            <label>Manhã</label>
                            <label>17</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="notes-column">
                <div className="notes">
                    <h3>Notas</h3>
                    <div className="notes-container">
                        <span>Professor:João da Silva</span>
                        <span>Turno:Tarde</span>
                        <span>Qtd Alunos:16</span>
                        <span>‎ </span> 
                        <span>Horario de Inicio:09:00</span>
                        <span>Horario de Termino:12:00</span>
                        <span>‎ </span>
                        <div className="notes-line-container">
                            <div className="notes-header">
                                <span>Notas: </span>
                                <div className="notes-line"></div>
                            </div>
                            <div className="notes-line"></div>
                            <div className="notes-line"></div>
                            <div className="notes-line"></div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home;