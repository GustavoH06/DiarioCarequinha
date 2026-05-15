function SalaList(){
    return(
        <div className="list-container">
            <h1>Lista de Alunos</h1>
            <div className="filter-container">
                <div className="filter-input">
                    <input type="text" name="name" placeholder="Nome"/>
                    <input type="text" name="age" placeholder="Turno"/>
                    <input type="text" name="job" placeholder="Id"/>
                    <input type="text" name="a" placeholder="Sala"/>
                </div>
                <div className="filter-buttons">
                    <i class="bi bi-trash"></i>
                    <i class="bi bi-search" style={{}}></i>
                </div>
            </div>

            <div className="salas-list">
                <div className="list-container">
                    <div className="item-list header">
                        <label>Id</label>
                        <label>Nome</label>
                        <label>Sala</label>
                        <label>Sexo</label>
                        <label>Idade</label>
                    </div>

                    <div className="item-list content">
                        <label>1</label>
                        <label>Kaique Fernandes</label>
                        <label>Berçario 1</label>
                        <label>M</label>
                        <label>6</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalaList;