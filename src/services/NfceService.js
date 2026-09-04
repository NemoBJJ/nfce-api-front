import axios from 'axios';

const API_BASE_URL = 'https://nfce-container.neemindev.com/api/nfce';

const NfceService = {
    emitirNota: async (empresaId, dadosNota) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/emitir/${empresaId}`,
                dadosNota
            );

            return response.data;
        } catch (error) {
            console.error('Erro ao emitir NFC-e:', error);
            throw error;
        }
    }
};

export default NfceService;