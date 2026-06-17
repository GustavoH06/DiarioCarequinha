import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { API_ALUNOS, API_SALAS } from '../hooks/configApi';
import NotasEditor from '../blueprints/NotasEditor';

function hojeISO() {
    return new Date().toISOString().split('T')[0];
}

function calcularFrequenciaClass(frequencia) {
    if (frequencia >= 75) return 'frequencia-alta';
    if (frequencia >= 50) return 'frequencia-media';
    return 'frequencia-baixa';
}

export default function SalaInfo() {
    const { sid } = useParams();
    const navigate = useNavigate();

    const [sala, setSala] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [presencas, setPresencas] = useState([]);
    const [presencaLoading, setPresencaLoading] = useState(true);
    const [dataAula, setDataAula] = useState(hojeISO());
    const [expandedFreq, setExpandedFreq] = useState(null);

    useEffect(() => { fetchSala(); }, [sid]);
    useEffect(() => { fetchPresencas(); }, [sid]);

    async function fetchSala() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_SALAS}/${sid}`);
            if (!res.ok) throw new Error('Sala não encontrada');
            const data = await res.json();
            setSala(data);
            setFormData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchPresencas() {
        setPresencaLoading(true);
        try {
            const res = await fetch(`${API_SALAS}/${sid}/presencas`);
            if (!res.ok) throw new Error();
            setPresencas(await res.json());
        } catch {
            setPresencas([]);
        } finally {
            setPresencaLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSaveSala() {
        setSaving(true);
        try {
            const res = await fetch(`${API_SALAS}/${sid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(' Erro ao salvar');
            const atualizada = await res.json();
            setSala(atualizada);
            setEditMode(false);
            alert(' Dados da sala salvos com sucesso!');
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleSearch(e) {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.trim().length < 2) { setSearchResults([]); return; }
        try {
            const res = await fetch(API_ALUNOS);
            const todos = await res.json();
            const alunosNaSala = sala.alunos.map(a => a.pid);
            setSearchResults(
                todos.filter(a =>
                    a.nome.toLowerCase().includes(q.toLowerCase()) &&
                    !alunosNaSala.includes(a.pid)
                )
            );
        } catch { setSearchResults([]); }
    }

    async function addAluno(pid) {
        try {
            const res = await fetch(`${API_SALAS}/${sid}/alunos/${pid}`, { method: 'POST' });
            if (!res.ok) throw new Error();
            setSala(await res.json());
            setSearchQuery('');
            setSearchResults([]);
            fetchPresencas();
        } catch { alert('Erro ao adicionar aluno'); }
    }

    async function removeAluno(pid) {
        try {
            const res = await fetch(`${API_SALAS}/${sid}/alunos/${pid}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setSala(await res.json());
            fetchPresencas();
        } catch { alert('Erro ao remover aluno'); }
    }

    async function marcarPresenca(alunoId, presente) {
        try {
            const res = await fetch(`${API_SALAS}/${sid}/presencas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alunoId, data: dataAula, presente }),
            });
            if (!res.ok) throw new Error();
            fetchPresencas();
        } catch {
            alert('Erro ao registrar presença');
        }
    }

    async function handleSaveNotas(notas) {
        const response = await fetch(`${API_SALAS}/${sid}/notas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notas }),
        });
        
        if (!response.ok) throw new Error('Erro ao salvar notas');
        const data = await response.json();
        
        setSala(prev => ({ ...prev, notas: data.notas }));
        setFormData(prev => ({ ...prev, notas: data.notas }));
        
        return data;
    }

    function registroDaData(aluno) {
        return aluno.registros?.find(r => r.data === dataAula);
    }

    if (loading) return <div className="loading-message">Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!sala) return null;

    return (
        <div className="info-container">
            <div className="info-header">
                <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
                <h1>{sala.nome}</h1>
                <span className={`tipo-badge tipo-${sala.tipo?.toLowerCase().replace('á', 'a').replace('ç', 'c')}`}>
                    {sala.tipo}
                </span>
                <span className={`turno-badge ${sala.turno === 'Manhã' ? 'turno-manha' : 'turno-tarde'}`}>
                    {sala.turno}
                </span>
            </div>

            <div className="form-body">
                <div className="form-header">
                    <h2>Dados da Sala</h2>
                    {editMode ? (
                        <div className="form-actions">
                            <button onClick={handleSaveSala} disabled={saving} className="btn-salvar">
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button onClick={() => { setEditMode(false); setFormData(sala); }} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="btn-editar">
                            <i className="bi bi-pencil" /> Editar
                        </button>
                    )}
                </div>

                <div className="form-grid-sala">
                    <div className="form-input nome">
                        <label>Nome da Sala</label>
                        {editMode ? (
                            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{sala.nome || '—'}</span>
                        )}
                    </div>

                    <div className="form-input tipoSala">
                        <label>Tipo</label>
                        {editMode ? (
                            <select name="tipo" value={formData.tipo || ''} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="Berçario">Berçario</option>
                                <option value="Maternal">Maternal</option>
                                <option value="Primário">Primário</option>
                            </select>
                        ) : (
                            <span className="info-value">{sala.tipo || '—'}</span>
                        )}
                    </div>

                    <div className="form-input turnoSala">
                        <label>Turno</label>
                        {editMode ? (
                            <select name="turno" value={formData.turno || ''} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                            </select>
                        ) : (
                            <span className="info-value">{sala.turno || '—'}</span>
                        )}
                    </div>

                    <div className="form-input horarioInicio">
                        <label>Horário Início</label>
                        {editMode ? (
                            <input type="time" name="horarioInicio" value={formData.horarioInicio || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{sala.horarioInicio || '—'}</span>
                        )}
                    </div>

                    <div className="form-input horarioTermino">
                        <label>Horário Término</label>
                        {editMode ? (
                            <input type="time" name="horarioTermino" value={formData.horarioTermino || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{sala.horarioTermino || '—'}</span>
                        )}
                    </div>
                </div>
            </div>

            <br />

            <div className="form-body">
                <h2>Alunos ({sala.totalAlunos || 0})</h2>

                <div className="form-input alunosSearch">
                    <label>Adicionar aluno</label>
                    <input
                        type="text"
                        placeholder="Pesquisar pelo nome..."
                        value={searchQuery}
                        onChange={handleSearch}
                        autoComplete="off"
                    />
                    {searchResults.length > 0 && (
                        <ul className="search-dropdown">
                            {searchResults.map(a => (
                                <li key={a.pid} onClick={() => addAluno(a.pid)}>
                                    <strong>{a.nome}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {sala.alunos.length > 0 && (
                    <div className="alunos-chips">
                        {sala.alunos.map(a => (
                            <span key={a.pid} className="aluno-chip">
                                <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/alunos/${a.pid}`)}>
                                    {a.nome}
                                </span>
                                <button type="button" onClick={() => removeAluno(a.pid)} title="Remover da sala">×</button>
                            </span>
                        ))}
                    </div>
                )}

                {sala.alunos.length === 0 && (
                    <div className="list-items" style={{ marginTop: '1rem' }}>
                        <div className="item-list empty">
                            <label>Nenhum aluno nesta sala</label>
                        </div>
                    </div>
                )}
            </div>

            <br />

            <div className="form-body">
                <h2>Presença</h2>

                {sala.alunos.length === 0 ? (
                    <div className="list-items">
                        <div className="item-list empty">
                            <label>Adicione alunos à sala para registrar presença</label>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="form-input" style={{ maxWidth: '220px', marginBottom: '1rem' }}>
                            <label>Data da aula</label>
                            <input
                                type="date"
                                value={dataAula}
                                onChange={e => setDataAula(e.target.value)}
                            />
                        </div>

                        {presencaLoading ? (
                            <div className="loading-message-small">Carregando frequência...</div>
                        ) : (
                            <div className="frequencia-container">
                                <div className="frequencia-list-header">
                                    <div>Nome do Aluno</div>
                                    <div>Total de Faltas</div>
                                    <div>Frequência</div>
                                    <div>{dataAula}</div>
                                </div>

                                <div className="frequencia-student-list">
                                    {presencas.map(p => {
                                        const isExpanded = expandedFreq === p.alunoId;
                                        const freqClass = calcularFrequenciaClass(p.frequencia);
                                        const registroHoje = registroDaData(p);

                                        return (
                                            <div key={p.alunoId} className="frequencia-student-item">
                                                <div className="frequencia-student-row" onClick={() =>
                                                    setExpandedFreq(isExpanded ? null : p.alunoId)}>
                                                    <div className="frequencia-student-name">{p.nome}</div>
                                                    <div className="frequencia-total-faltas">{p.faltas}</div>
                                                    <div className={`frequencia-value ${freqClass}`}>{p.frequencia}%</div>

                                                    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            type="button"
                                                            className={`btn-presenca ${registroHoje?.presente === true ? 'ativo-presente' : ''}`}
                                                            onClick={() => marcarPresenca(p.alunoId, true)}
                                                            title="Marcar presença"
                                                        >
                                                            Presente
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn-presenca ${registroHoje?.presente === false ? 'ativo-falta' : ''}`}
                                                            onClick={() => marcarPresenca(p.alunoId, false)}
                                                            title="Marcar falta"
                                                        >
                                                            Falta
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={`frequencia-absence-details ${isExpanded ? 'show' : ''}`}>
                                                    <div className="frequencia-details-content">
                                                        <div className="frequencia-details-title">
                                                            {p.diasFalta.length > 0 ? 'Dias que faltou:' : 'Nenhuma falta registrada'}
                                                        </div>
                                                        <div className="frequencia-absence-dates">
                                                            {p.diasFalta.map((data, index) => (
                                                                <span key={index} className="frequencia-absence-date">{data}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <br />

            <div className="form-body">
                <h2>Notas da Sala</h2>
                <NotasEditor
                    valorInicial={sala.notas || ''}
                    onSave={handleSaveNotas}
                    placeholder="Digite suas anotações sobre esta sala..."
                    label="Anotações sobre a sala "
                />
            </div>
            
        </div>
    );
}