// AlunoInfo.jsx - layout igual ao AlunoForm
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
    const { pid } = useParams();
    const navigate = useNavigate();

    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const [compMap, setCompMap] = useState({});
    const [expandedC, setExpandedC] = useState(null);
    const [expandedSub, setExpandedSub] = useState({});

    useEffect(() => { fetchAluno(); }, [pid]);

    async function fetchAluno() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/${pid}`);
            if (!res.ok) throw new Error('Aluno não encontrado');
            const data = await res.json();
            setAluno(data);
            setFormData(data);

            const map = {};
            (data.competencias || []).forEach(c => {
                map[c.itemId] = { nota: c.nota, observacao: c.observacao };
            });
            setCompMap(map);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSaveAluno() {
        setSaving(true);
        try {
            const res = await fetch(`${API}/${pid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Erro ao salvar');
            const alunoAtualizado = await res.json();
            setAluno(alunoAtualizado);
            setEditMode(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveCompetencia(itemId) {
        const { nota, observacao } = compMap[itemId] || {};
        try {
            await fetch(`${API}/${pid}/competencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, nota, observacao: observacao || '' }),
            });
            alert('Competência salva com sucesso!');
        } catch {
            alert('Erro ao salvar competência');
        }
    }

    function setComp(itemId, field, value) {
        setCompMap(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [field]: value },
        }));
    }

    if (loading) return <div className="loading-message">Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!aluno) return null;

    return (
        <div className="info-container">
            <div className="info-header">
                <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
                <h1>{aluno.nome}</h1>
                {aluno.salas?.length > 0 && (
                    <div className="turmas-chips" style={{ display: 'inline-flex' }}>
                        {aluno.salas.map(s => (
                            <span key={s.sid} className="aluno-chip" style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/salas/${s.sid}`)}>
                                {s.nome}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-body">
                <div className="form-header">
                    <h2>Dados do Aluno</h2>
                    {editMode ? (
                        <div className="form-actions">
                            <button onClick={handleSaveAluno} disabled={saving} className="btn-salvar">
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button onClick={() => { setEditMode(false); setFormData(aluno); }} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="btn-editar">
                            <i className="bi bi-pencil" /> Editar
                        </button>
                    )}
                </div>

                <div className="form-grid">

                    <div className="form-input nome">
                        <label>Nome</label>
                        {editMode ? (
                            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.nome || '—'}</span>
                        )}
                    </div>

                    <div className="form-input data">
                        <label>Data de Nascimento</label>
                        {editMode ? (
                            <input type="date" name="dataNascimento" value={formData.dataNascimento || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.dataNascimento || '—'}</span>
                        )}
                    </div>

                    <div className="form-input idade">
                        <label>Idade</label>
                        {editMode ? (
                            <input type="number" name="idade" value={formData.idade || ''} onChange={handleChange} min="0" max="18" />
                        ) : (
                            <span className="info-value">{aluno.idade || '—'}</span>
                        )}
                    </div>

                    <div className="form-input sexo">
                        <label>Sexo</label>
                        {editMode ? (
                            <select name="sexo" value={formData.sexo || ''} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        ) : (
                            <span className="info-value">
                                {aluno.sexo === 'M' ? 'Masculino' : aluno.sexo === 'F' ? 'Feminino' : aluno.sexo || '—'}
                            </span>
                        )}
                    </div>

                    <div className="form-input tel">
                        <label>Telefone</label>
                        {editMode ? (
                            <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.telefone || '—'}</span>
                        )}
                    </div>

                    <div className="form-input pais">
                        <label>Responsáveis</label>
                        {editMode ? (
                            <>
                                <input type="text" name="nomePai1" placeholder="Responsável 1"
                                    value={formData.nomePai1 || ''} onChange={handleChange} />
                                <input type="text" name="nomePai2" placeholder="Responsável 2 (opcional)"
                                    value={formData.nomePai2 || ''} onChange={handleChange}
                                    style={{ marginTop: '8px' }} />
                            </>
                        ) : (
                            <span className="info-value">
                                {[aluno.nomePai1, aluno.nomePai2].filter(Boolean).join(' / ') || '—'}
                            </span>
                        )}
                    </div>

                    <div className="form-input end">
                        <label>Endereço</label>
                        {editMode ? (
                            <input type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.endereco || '—'}</span>
                        )}
                    </div>

                    <div className="form-input numero">
                        <label>Número</label>
                        {editMode ? (
                            <input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.numero || '—'}</span>
                        )}
                    </div>

                </div>
            </div>

            <br />

            <h2>Competências</h2>
            <div className="competencias-container">
                {COMPETENCIAS_DEF.map(comp => {
                    const isOpen = expandedC === comp.id;

                    return (
                        <div key={comp.id} className="competencia-card">
                            <div className="competencia-header" onClick={() => setExpandedC(isOpen ? null : comp.id)}>
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
                                            <div className="subitem-header" onClick={() => setExpandedSub(p => ({ ...p, [key]: !p[key] }))}>
                                                <span className="subitem-id">{item.id}</span>
                                                <span className="subitem-texto">{item.texto}</span>
                                                {saved.nota && (
                                                    <span className={`comp-nota comp-nota-${saved.nota.toLowerCase()}`}>
                                                        {saved.nota === 'S' ? 'Satisfatório' : saved.nota === 'PS' ? 'Parcial' : 'Não Satisfatório'}
                                                    </span>
                                                )}
                                                <div className={`subitem-arrow ${isSubOpen ? 'expanded' : ''}`}>▼</div>
                                            </div>

                                            <div className={`subitem-avaliacao ${isSubOpen ? 'show' : ''}`}>
                                                <div className="avaliacao-content">
                                                    <div className="avaliacao-opcoes">
                                                        {['S', 'PS', 'NS'].map(opcao => (
                                                            <label key={opcao} className="avaliacao-label">
                                                                <input
                                                                    type="radio"
                                                                    name={`${item.id}-avaliacao`}
                                                                    value={opcao}
                                                                    checked={saved.nota === opcao}
                                                                    onChange={() => setComp(item.id, 'nota', opcao)}
                                                                />
                                                                {opcao === 'S' && 'Satisfatório'}
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
                                                    <button className="btn-salvar-comp" onClick={() => handleSaveCompetencia(item.id)}>
                                                        Salvar Avaliação
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
}
