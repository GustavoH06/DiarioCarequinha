import { useState, useEffect, useRef } from 'react';

export default function NotasEditor({ 
    valorInicial, 
    onSave, 
    placeholder = "Digite suas anotações aqui...",
    label = "Anotações"
}) {
    const [notas, setNotas] = useState(valorInicial || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setNotas(valorInicial || '');
    }, [valorInicial]);

    const handleSave = async () => {
        if (notas === valorInicial) return;
        
        setIsSaving(true);
        setError(null);
        try {
            await onSave(notas);
        } catch (err) {
            setError(' Erro ao salvar anotações');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSave();
        }
    };

    const handleBlur = () => {
        if (notas !== valorInicial) {
            handleSave();
        }
    };

    return (
        <div className="notas-editor">
            <div className="notas-editor-header">
                <label>{label}</label>
                {isSaving && <span className="notas-saving">Salvando...</span>}
                {error && <span className="notas-error">{error}</span>}
                {!isSaving && !error && notas !== valorInicial && (
                    <span className="notas-unsaved">Não salvo</span>
                )}
                {!isSaving && !error && notas === valorInicial && valorInicial && (
                    <span className="notas-saved">✓ Salvo</span>
                )}
            </div>
            <textarea
                className="notas-textarea"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows="3"
            />
        </div>
    );
}