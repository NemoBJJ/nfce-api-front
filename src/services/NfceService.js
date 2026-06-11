import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086/api/nfce';

const NfceService = {
    emitirNota: async (empresaId, dadosNota) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/emitir/${empresaId}`, dadosNota);
            return response.data;
        } catch (error) {
            console.error('Erro ao emitir nota:', error);
            throw error;
        }
    }
};

export default NfceService;