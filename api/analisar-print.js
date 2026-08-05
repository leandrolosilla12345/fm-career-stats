export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido."
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                erro: "A chave do Gemini não foi encontrada."
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "API conectada com sucesso."
        });

    } catch (erro) {
        return res.status(500).json({
            erro: "Erro ao processar a imagem."
        });
    }
}
