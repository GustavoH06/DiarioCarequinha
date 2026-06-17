import { useState } from 'react';
import { API_ALUNOS } from '../hooks/configApi';

export default function BulkImportModal({ isOpen, onClose, onImportSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.json'))) {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError('Por favor, selecione um arquivo CSV ou JSON válido.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Selecione um arquivo primeiro.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_ALUNOS}/bulk`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                if (data.total_criados > 0 && onImportSuccess) {
                    onImportSuccess();
                }
            } else {
                setError(data.error || 'Erro ao importar alunos');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = `nome,dataNascimento,telefone,nomePai1,nomePai2,endereco,numero,sexo,sala
"João Pedro Silva","2020-03-15","+55 (34) 99765-1344","Arthur Arantes Almêida","Carmen Cristina Caixeta","Rua do Limão, Bairro do Limoeiro","365","M","Berçario 1"
"Maria Eduarda Santos","2019-07-22","+55 (34) 98888-7777","Carlos Santos","Ana Santos","Rua das Flores, 100","100","F","Maternal 1"
"Pedro Henrique Lima","2020-11-10","+55 (34) 97777-6666","José Lima","Clara Lima","Rua das Palmeiras, 200","200","M","Jardim 1"`;

        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_alunos.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Importar Alunos</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <p>Importe múltiplos alunos usando um arquivo <strong>CSV</strong> ou <strong>JSON</strong>.</p>
                        
                        <button type="button" className="btn-template" onClick={downloadTemplate}>
                            Baixar Template CSV
                        </button>

                        <div className="format-info">
                            <h4>Campos suportados:</h4>
                            <p><strong>Obrigatórios:</strong> nome, dataNascimento</p>
                            <p><strong>Opcionais:</strong> telefone, nomePai1, nomePai2, endereco, numero, idade, sexo, sala</p>
                            <p><small>Importante: O campo "sala" deve corresponder ao nome exato de uma sala existente.</small></p>
                        </div>

                        <div className="file-upload">
                            <label className="file-upload-label">
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                                <div>
                                    <span style={{ fontSize: '32px', display: 'block' }}>📁</span>
                                    {file ? file.name : 'Clique para selecionar ou arraste um arquivo CSV/JSON'}
                                </div>
                            </label>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        
                        {result && (
                            <div className="result-message">
                                <p>{result.message}</p>
                                {result.total_erros > 0 && (
                                    <div className="errors-list">
                                        <strong>⚠️ Erros encontrados ({result.total_erros}):</strong>
                                        <ul>
                                            {result.erros.map((err, idx) => (
                                                <li key={idx}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={!file || loading}>
                            {loading ? 'Importando...' : 'Importar Alunos'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}