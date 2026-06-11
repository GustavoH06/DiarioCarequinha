import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

const API = 'http://localhost:5000/api/alunos';

const COMPETENCIAS_DEF = [
        {
            id: 1,
            titulo: "Competência 01",
            descricao: "Valores Humanos",
            itens: [
                { id: "1D1", texto: "Conhece sua história pessoal e valoriza positivamente sua experiência de vida." },
                { id: "1D2", texto: "Reconhece seus dons e talentos e os do próximo." },
                { id: "1D3", texto: "Faz opções e escolhas adequadas considerando o bem e o mal." },
                { id: "1D4", texto: "Busca soluções para seus conflitos." },
                { id: "1D5", texto: "Convive sem preconceito respeitando fatos e ou situações." },
                { id: "1D6", texto: "Busca por meio de experiências, a aprimoração de atitudes e valores." },
                { id: "1D7", texto: "Demonstra harmonia entre pensamento, palavra e ação." }
            ],
        },
        {
            id: 2,
            titulo: "Competência 02",
            descricao: "Autocuidado e Responsabilidade",
            itens: [
                { id: "2D1", texto: "Responsabiliza-se por seus atos." },
                { id: "2D2", texto: "Cuida da sua higiene." },
                { id: "2D3", texto: "Cuida do seu material com zelo." },
                { id: "2D4", texto: "Cuida do material da escola." }
            ]
        }
    ];

export default function AlunoInfo() {
    const { pid }   = useParams();
    const navigate  = useNavigate();

    const [aluno,       setAluno]       = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);

    const [editMode,    setEditMode]    = useState(false);
    const [formData,    setFormData]    = useState({});
    const [saving,      setSaving]      = useState(false);

    const [compMap, setCompMap] = useState({});
    const [expandedC, setExpandedC] = useState(null);
    const [expandedSub, setExpandedSub] = useState({});

    useEffect(()=> { fetchAluno(); }, [pid]);

    async function fetchAluno(){
        setLoading(true);
        setError(null);
        try{
            const res = await fetch (`${API}/${pid}`);
            if (!res.ok) throw new Error('Aluno não encontrado');
            const data = await res.json();
            setAluno(data);
            setFormData(data);

            //Mapa de competências
            const map = {};
            (data.competencias || []).forEach(c => {
                map[c.itemId] = {nota: c.nota, observacao: c.observacao};
            });
            setCompMap(map);
        } catch (err){
            setError(err.message);
        } finally{
            setLoading(false);
        }
    }

    async function handleSaveAluno() {
        setSaving(true);
        try{
            const res = await fetch(`${API}/${pid}`,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error ('Erro ao salvar');
            const alunoAtualizado = await res.json();
            setAluno(alunoAtualizado);
            setEditMode(false);
        } catch(err){
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveCompetencia(itemId){
        const { nota, observacao } = compMap[itemId] || {};
        try{
            await fetch(`${API}/${pid}/competencias`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, nota, observacao: observacao || ''}),
            });
        } catch {
            alert('Erro ao salvar competência');
        }
    }

    function setComp(itemId, field, value){
        setCompMap(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [field]: value },
        }));
    }

    if (loading)    return <div className="loading-message">Carregando...</div>;
    if (error)      return <div className="error-message">{error}</div>;
    if (!aluno)     return null;

    return (
        <div className="info-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
                <h1>{aluno.nome}</h1>
            </div>

            <div className="form-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>Dados do Aluno</h2>
                    {editMode
                        ? <div style={{display: 'flex', gap: '8px'}}>
                            <button onClick={handleSaveAluno} disabled={saving}>
                                {saving ? 'Salvando': 'Salvar'}

                            </button>
                            <button onClick={() => { setEditMode(false); setFormData(aluno); }}>
                                Cancelar
                            </button>
                        </div>
                        : <button onClick={()=> setEditMode(true)}>
                            <i className="bi bi-pencil"/> Editar
                        </button>
                    }
                </div>

                <div className="form-grid-">
                    {[
                        { label: 'Nome',            field: 'nome',              type: 'text'},
                        { label: 'Data Nascimento', field: 'dataNascimento',    type: 'date'},
                        { label: 'Idade',           field: 'idade',             type: 'number'},
                        { label: 'Sexo',            field: 'sexo',              type: 'text'},
                        { label: 'Telefone',        field: 'telefone',          type: 'tel'},
                        { label: 'Endereço',        field: 'endereco',          type: 'text'},
                        { label: 'Número',          field: 'numero',            type: 'text'},
                        { label: 'Responsável 1',   field: 'nomePai1',          type: 'text'},
                        { label: 'Responsável 2',   field: 'nomePai2',          type: 'text'},
                    ].map(({label, field, type}) =>(
                        <div className="form-input" key={field}>
                            <label>{label}</label>
                            {editMode
                                ? <input type={type} value={formData[field] || ''}
                                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value}))} />
                                : <span className="info-value">{aluno[field] || '—'}</span>    
                            }
                        </div>
                    ))}
                </div>

                {aluno.salas?.length > 0 && (
                    <div style ={{ marginTop: '1rem'}}>
                        <strong>Turmas:</strong>
                        {AlunosListComp.salas.map(s => (
                            <span
                                key={s.sid}
                                className="aluno-chip"
                                style={{cursor: 'pointer' }}
                                onClick={() => navigate(`/salas/${s.sid}`)}
                            >
                                {s.nome}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <br />

            <h2>Competências</h2>
            <div className="competencias-container">
                {COMPETENCIAS_DEF.map(comp => {
                    const isOpen = expandedC === comp.id;
                    
                    return (
                        <div key={comp.id} className="competencia-card">
                            <div className="competencia-header" onClick={() => 
                                setExpandedC(isOpen ? null : comp.id)}>
                                <div className="competencia-titulo-area">
                                    <span className="competencia-numero">{comp.titulo}</span>
                                    <span className="competencia-descricao">{comp.descricao}</span>
                                </div>
                                <div className={`competencia-arrow ${isOpen ? 'expanded' : ''}`}>▼</div>
                            </div>

                            <div className={`competencia-subitens ${isOpen ? 'show' : ''}`}>
                                {comp.itens.map(item => {
                                    const key = `${comp.id}-${item.id}`;
                                    const isSubOpen = expandedSub[key];
                                    const saved = compMap[item.id] || {};
                                    
                                    return (
                                        <div key={item.id} className="subitem-container">
                                            <div className="subitem-header"
                                                onClick={() => setExpandedSub(p => ({ ...p, [key]: !p[key] }))}>
                                                <span className="subitem-id">{item.id}</span>
                                                <span className="subitem-texto">{item.texto}</span>
                                                {saved.nota && (
                                                    <span className={`comp-nota compt-nota-${saved.nota.toLowerCase()}`}>
                                                        {saved.nota}
                                                    </span>
                                                )}
                                                <div className={`subitem-arrow ${isSubOpen ? 'expanded' : ''}`}>▼</div>
                                            </div>
                                            
                                            <div className={`subitem-avaliacao ${isSubOpen ? 'show' : ''}`}>
                                                <div className="avaliacao-content">
                                                    <div className="avaliacao-opcoes">
                                                        {['S', 'PS', 'NS'].map(opcao => (
                                                            <label key={opcao} className="avalicao-label">
                                                                <input 
                                                                    type="radio"
                                                                    name={`${item.id}-avaliacao`}
                                                                    value={opcao}
                                                                    checked={saved.nota === opcao}
                                                                    onChange={() => setComp (item.id, 'nota', opcao)} 
                                                                />
                                                                {opcao === 'S'  && 'Satisfatório'}
                                                                {opcao === 'PS' && 'Parcialmente Satisfatório'}
                                                                {opcao === 'NS' && 'Não Satisfatório'}
                                                            </label>
                                                        ))}
                                                        
                                                    </div>

                                                    <textarea 
                                                        className="avaliacao-obs" 
                                                        placeholder="Observações (opcional)..."
                                                        rows="2"
                                                        value={saved.observacao || ''}
                                                        onChange={e => setComp(item.id, 'observacao', e.target.value)}
                                                    />
                                                    <button
                                                        className="btn-salvar-comp"
                                                        onClick={() => handleSaveCompetencia(item.id)}
                                                    >
                                                        Salvar Atualizações
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};