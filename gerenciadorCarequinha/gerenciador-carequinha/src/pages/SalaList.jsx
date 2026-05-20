function SalaList(){
    return(
        <div className="list-container">
            <h1>Lista de Salas</h1>
            <div className="filter-container">
                <div className="filter-input">
                    <input type="text" name="sala-name" placeholder="Nome"/>
                    <input type="text" name="sala-tipo" placeholder="Tipo de Turma"/>
                    <input type="text" name="sala-id" placeholder="Id"/>
                    <input type="text" name="sala-turno" placeholder="Tipo"/>
                </div>
                <div className="filter-buttons">
                    <i class="bi bi-trash"></i>
                    <i class="bi bi-search" style={{}}></i>
                </div>
            </div>

            <div className="list-items">
                <div className="item-list header">
                    <label>Id</label>
                    <label>Nome</label>
                    <label>Tipo</label>
                    <label>Turno</label>
                    <label>Alunos</label>
                </div>

                <div className="item-list content">
                    <label>1</label>
                    <label>Berçario 1</label>
                    <label>Berçario</label>
                    <label>Manhã</label>
                    <label>17</label>
                </div>
            </div>
        </div>

    );
}

export default SalaList;