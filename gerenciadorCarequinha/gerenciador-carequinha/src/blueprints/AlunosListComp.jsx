import { useAlunos } from '../hooks/useAlunos';

export default function AlunosListComp({ alunos: alunosProp, onDelete: onDeleteProp }) {
  const hook = useAlunos();

  const alunos   = alunosProp  ?? hook.alunos;
  const onDelete = onDeleteProp ?? hook.deleteAluno;

  if (hook.loading && !alunosProp) return <p>Carregando alunos...</p>;
  if (hook.error   && !alunosProp) return <p style={{ color: 'red' }}>{hook.error}</p>;

  return (
    <div className="list-items">
      <div className="item-list header">
        <label>ID</label>
        <label>Nome</label>
        <label>Sala</label>
        <label>Sexo</label>
        <label>Idade</label>
        <label>Ação</label>
      </div>

      {alunos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
          Nenhum aluno cadastrado.
        </p>
      )}

      {alunos.map(aluno => (
        <div className="item-list content" key={aluno.pid}>
          <label>{aluno.pid}</label>
          <label>{aluno.nome}</label>
          <label>{aluno.sala  || '—'}</label>
          <label>{aluno.sexo  || '—'}</label>
          <label>{aluno.idade || '—'}</label>
          <button onClick={() => onDelete(aluno.pid)}>Remover</button>
        </div>
      ))}
    </div>
  );
}
