import { useNavigate } from 'react-router';
import { useSalas } from '../hooks/useSalas';

export default function SalasListComp({ salas: salasProp, onDelete: onDeleteProp }) {
  const hook = useSalas();
  const navigate = useNavigate();

  const salas    = salasProp    ?? hook.salas;
  const onDelete = onDeleteProp ?? hook.deleteSala;

  if (hook.loading && !salasProp) return <div className="loading-message">Carregando salas...</div>;
  if (hook.error   && !salasProp) return <div className="error-message">{hook.error}</div>;

  return (
    <div className="list-items">
      <div className="item-list header">
        <label className="col-id-sala">ID</label>
        <label className="col-nome-sala">Nome</label>
        <label className="col-tipo-sala">Tipo</label>
        <label className="col-turno-sala">Turno</label>
        <label className="col-horario-sala">Horário</label>
        <label className="col-alunos-sala">Alunos</label>
        <label className="col-acoes-sala">Ações</label>
      </div>

      {salas.length === 0 && (
        <div className="item-list empty">
          <label>Nenhuma sala encontrada</label>
        </div>
      )}

      {salas.map(sala => (
        <div className="item-list content" 
          key={sala.sid}
          onClick={() => navigate(`/salas/${sala.sid}`)}
          style={{cursor: 'pointer'}}
        >
          <label className="col-id-sala">{sala.sid}</label>
          <label className="col-nome-sala">{sala.nome}</label>
          <label className="col-tipo-sala">
            <span className={`tipo-badge tipo-${sala.tipo?.toLowerCase().replace('á', 'a').replace('ç', 'c')}`}>
              {sala.tipo}
            </span>
          </label>
          <label className="col-turno-sala">
            <span className={`turno-badge ${sala.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
              {sala.turno}
            </span>
          </label>
          <label className="col-horario-sala">
            {sala.horarioInicio && sala.horarioTermino
              ? `${sala.horarioInicio} – ${sala.horarioTermino}` : '—'}
          </label>
          <label className="col-alunos-sala">
            <span className="alunos-count">{sala.totalAlunos || 0}</span>
          </label>
          <label className="col-acoes-sala" onClick={e => e.stopPropagation()}>
            <i className="bi bi-pencil acao-icon" title="Visualizar" onClick={() => navigate(`/salas/${sala.sid}`)}></i>
            <i className="bi bi-trash acao-icon" title="Excluir" onClick={() => onDelete(sala.sid)}></i>
          </label>
        </div>
      ))}
    </div>
  );
}