export default async function handler(request, response) {
    if (request.method !== "GET") {
        return response.status(405).json({
            erro: "Método não permitido."
        });
    }

    const nome = String(request.query.nome || "").trim();

    if (nome.length < 2) {
        return response.status(400).json({
            erro: "Digite pelo menos duas letras."
        });
    }

    const apiKey = process.env.THESPORTSDB_API_KEY;

    if (!apiKey) {
        return response.status(500).json({
            erro: "A chave da TheSportsDB não está configurada."
        });
    }

    try {
        const endereco =
            `https://www.thesportsdb.com/api/v1/json/${apiKey}` +
            `/searchteams.php?t=${encodeURIComponent(nome)}`;

        const resultado = await fetch(endereco);

        if (!resultado.ok) {
            throw new Error(`TheSportsDB respondeu ${resultado.status}`);
        }

        const dados = await resultado.json();

        const equipes = (dados.teams || [])
            .filter((equipe) => {
                const esporte = String(equipe.strSport || "").toLowerCase();
                return esporte === "soccer";
            })
            .map((equipe) => ({
                id: equipe.idTeam,
                nome: equipe.strTeam || "",
                nomeAlternativo: equipe.strTeamAlternate || "",
                pais: equipe.strCountry || "",
                liga: equipe.strLeague || "",
                estadio: equipe.strStadium || "",
                cidade: equipe.strLocation || "",
                fundacao: equipe.intFormedYear || "",
                escudo:
                    equipe.strBadge ||
                    equipe.strTeamBadge ||
                    "",
                descricao:
                    equipe.strDescriptionPT ||
                    equipe.strDescriptionEN ||
                    ""
            }));

        return response.status(200).json({
            equipes
        });
    } catch (erro) {
        console.error("Erro na busca de clube:", erro);

        return response.status(500).json({
            erro: "Não foi possível pesquisar o clube agora."
        });
    }
}
