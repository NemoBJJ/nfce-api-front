import React, { useState } from 'react';
import NfceService from '../services/NfceService';
import './EmissaoNfce.css';

const EmissaoNfce = () => {
    const [formData, setFormData] = useState({
        cnpj_emitente: '',
        natureza_operacao: 'VENDA AO CONSUMIDOR',
        data_emissao: new Date().toISOString().slice(0, 19) + '-03:00',
        presenca_comprador: 1,
        modalidade_frete: 9,
        items: [
            {
                numero_item: 1,
                codigo_produto: '',
                descricao: '',
                codigo_ncm: '',
                cfop: '5102',
                unidade_comercial: 'UN',
                quantidade_comercial: 1,
                valor_unitario_comercial: 0,
                valor_unitario_tributavel: 0,
                icms_situacao_tributaria: '102',
                icms_origem: '0'
            }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;

        const valor =
            name.includes('valor') || name.includes('quantidade')
                ? parseFloat(value)
                : value;

        const itemAtualizado = {
            ...formData.items[0],
            [name]: valor
        };

        if (name === 'valor_unitario_comercial') {
            itemAtualizado.valor_unitario_tributavel = valor;
        }

        setFormData({
            ...formData,
            items: [itemAtualizado]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setResultado(null);

        try {
            const response = await NfceService.emitirNota(1, formData);
            setResultado(response);
        } catch (error) {
            console.error('Erro ao emitir NFC-e:', error);
            alert('Erro ao emitir nota. Verifique o console e o backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="emissao-container">
            <h1>📄 Emissão de NFC-e (Produto)</h1>

            <div className="form-section">
                <h2>Dados da Empresa</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>CNPJ do Emitente *</label>
                            <input
                                type="text"
                                name="cnpj_emitente"
                                value={formData.cnpj_emitente}
                                onChange={handleChange}
                                placeholder="40.582.663/0001-86"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Natureza da Operação *</label>
                            <input
                                type="text"
                                name="natureza_operacao"
                                value={formData.natureza_operacao}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h2>Dados do Produto</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Código do Produto *</label>
                            <input
                                type="text"
                                name="codigo_produto"
                                value={formData.items[0].codigo_produto}
                                onChange={handleItemChange}
                                placeholder="PECA-TESTE-001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Descrição *</label>
                            <input
                                type="text"
                                name="descricao"
                                value={formData.items[0].descricao}
                                onChange={handleItemChange}
                                placeholder="PEÇA DE MOTOCICLETA"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>NCM *</label>
                            <input
                                type="text"
                                name="codigo_ncm"
                                value={formData.items[0].codigo_ncm}
                                onChange={handleItemChange}
                                placeholder="87141000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>CFOP *</label>
                            <input
                                type="text"
                                name="cfop"
                                value={formData.items[0].cfop}
                                onChange={handleItemChange}
                                placeholder="5102"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantidade *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="quantidade_comercial"
                                value={formData.items[0].quantidade_comercial}
                                onChange={handleItemChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor Unitário (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="valor_unitario_comercial"
                                value={formData.items[0].valor_unitario_comercial}
                                onChange={handleItemChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Emitindo...' : '💰 Emitir NFC-e'}
                    </button>
                </form>
            </div>

            {resultado && resultado.status === 'autorizado' && (
                <div className="result-section">
                    <h3>✅ Nota Autorizada!</h3>

                    <p>
                        <strong>Status:</strong> {resultado.status}
                    </p>

                    <p>
                        <strong>Chave NFC-e:</strong> {resultado.chaveNfe}
                    </p>

                    <p>
                        <strong>Número:</strong> {resultado.numero}
                    </p>

                    {resultado.caminhoDanfe && (
                        <p>
                            <strong>DANFE:</strong>{' '}
                            <a
                                href={`https://homologacao.focusnfe.com.br${resultado.caminhoDanfe}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📄 Visualizar DANFE
                            </a>
                        </p>
                    )}

                    {resultado.caminhoDanfe && (
                        <p>
                            <strong>XML da Nota:</strong>{' '}
                            <a
                                href={`https://homologacao.focusnfe.com.br${resultado.caminhoDanfe.replace(
                                    '.html',
                                    '.xml'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📄 Baixar XML
                            </a>
                        </p>
                    )}

                    {resultado.qrcodeUrl && (
                        <p>
                            <strong>QR Code:</strong>{' '}
                            <a
                                href={resultado.qrcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Consultar na SEFAZ
                            </a>
                        </p>
                    )}
                </div>
            )}

            {resultado && resultado.status === 'processando_autorizacao' && (
                <div className="result-section">
                    <h3>⏳ Nota em Processamento</h3>
                    <p>
                        A nota foi enviada e está aguardando autorização da SEFAZ.
                    </p>
                </div>
            )}

            {resultado &&
                resultado.status !== 'autorizado' &&
                resultado.status !== 'processando_autorizacao' && (
                    <div className="result-section">
                        <h3>Erro na emissão</h3>

                        <p>
                            <strong>Status:</strong> {resultado.status}
                        </p>

                        {resultado.mensagemSefaz && (
                            <p>
                                <strong>SEFAZ:</strong> {resultado.mensagemSefaz}
                            </p>
                        )}

                        {resultado.mensagemErro && (
                            <p>
                                <strong>Erro:</strong> {resultado.mensagemErro}
                            </p>
                        )}
                    </div>
                )}
        </div>
    );
};

export default EmissaoNfce;