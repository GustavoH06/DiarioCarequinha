import { useSalas } from '../hooks/useSalas';

export default function SalasListComp({ salas: salasProp, onDelete: onDeleteProp }) {
  const hook = useSalas();

  const salas    = salasProp    ?? hook.salas;
  const onDelete = onDeleteProp ?? hook.deleteSala;

  if (hook.loading && !salasProp) return <p>Carregando salas...</p>;
  if (hook.error   && !salasProp) return <p style={{ color: 'red' }}>{hook.error}</p>;

  return (
    <div className="list-items">
      <div className="item-list header">
        <label>ID</label>
        <label>Nome</label>
        <label>Tipo</label>
        <label>Turno</label>
        <label>Horário</label>
        <label>Alunos</label>
        <label>Ação</label>
      </div>

      {salas.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
          Nenhuma sala cadastrada.
        </p>
      )}

      {salas.map(sala => (
        <div className="item-list content" key={sala.sid}>
          <label>{sala.sid}</label>
          <label>{sala.nome}</label>
          <label>{sala.tipo}</label>
          <label>{sala.turno}</label>
          <label>
            {sala.horarioInicio && sala.horarioTermino
              ? `${sala.horarioInicio} – ${sala.horarioTermino}`
              : '—'}
          </label>
          <label>{sala.totalAlunos}</label>
          <button onClick={() => onDelete(sala.sid)}>Remover</button>
        </div>
      ))}
    </div>
  );
}
