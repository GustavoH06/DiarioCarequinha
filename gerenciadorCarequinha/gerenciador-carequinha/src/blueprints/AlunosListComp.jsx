import { useAlunos } from '../hooks/useAlunos';

export default function AlunosListComp({ alunos: alunosProp, onDelete: onDeleteProp }) {
  const hook = useAlunos();

  const alunos   = alunosProp  ?? hook.alunos;
  const onDelete = onDeleteProp ?? hook.deleteAluno;

  if (hook.loading && !alunosProp) return <div className="loading-message">Carregando alunos...</div>;
  if (hook.error   && !alunosProp) return <div className="error-message">{hook.error}</div>;

  return (
    <div className="list-items">
      <div className="item-list header">
        <label className="col-id-aluno">ID</label>
        <label className="col-nome-aluno">Nome</label>
        <label className="col-sala-aluno">Sala</label>
        <label className="col-sexo-aluno">Sexo</label>
        <label className="col-idade-aluno">Idade</label>
        <label className="col-acoes-aluno">Ações</label>
      </div>

      {alunos.length === 0 && (
        <div className="item-list empty">
          <label>Nenhum aluno encontrado</label>
        </div>
      )}

      {alunos.map(aluno => (
        <div className="item-list content" key={aluno.pid}>
          <label className="col-id-aluno">{aluno.pid}</label>
          <label className="col-nome-aluno">{aluno.nome}</label>
          <label className="col-sala-aluno">{aluno.sala  || '—'}</label>
          <label className="col-sexo-aluno">
            <span className={`sexo-badge ${aluno.sexo === 'M' ? 'sexo-m' : aluno.sexo === 'F' ? 'sexo-f' : ''}`}>
              {aluno.sexo === 'M' ? 'M' : aluno.sexo === 'F' ? 'F' : aluno.sexo || '—'}
            </span>
          </label>
          <label className="col-idade-aluno">{aluno.idade || '—'}</label>
          <label className="col-acoes-aluno">
            <i className="bi bi-eye acao-icon" title="Visualizar"></i>
            <i className="bi bi-pencil acao-icon" title="Editar"></i>
            <i className="bi bi-trash acao-icon" title="Excluir" onClick={() => onDelete(aluno.pid)}></i>
          </label>
        </div>
      ))}
    </div>
  );
}