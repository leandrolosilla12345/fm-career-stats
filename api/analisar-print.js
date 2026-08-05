export const config = {
  maxDuration: 60
};

const TIPOS_VALIDOS = new Set([
  "elenco",
  "estatisticas",
  "classificacao",
  "resultados",
  "transferencias",
  "perfil_jogador",
  "outro"
]);

function limparBase64(valor = "") {
  return String(valor).replace(/^data:[^;]+;base64,/, "").trim();
}

function criarInstrucao(tipo, temporada) {
  const contextoTemporada = temporada
    ? `A temporada selecionada pelo usuário é "${temporada}".`
    : "A temporada não foi informada.";

  const instrucoesPorTipo = {
    elenco: `
Analise uma tela de elenco do Football Manager.
Extraia cada jogador visível com nome, número, posição, nacionalidade, idade e status,
somente quando essas informações estiverem claramente visíveis.
`,

    estatisticas: `
Analise uma tabela de estatísticas de jogadores do Football Manager.
Extraia cada jogador visível com jogos, gols, assistências, nota média, minutos,
titularidades e outros números que estejam claramente identificados.
Não troque uma coluna por outra.
`,

    classificacao: `
Analise uma tabela de classificação do Football Manager.
Extraia as equipes e as colunas visíveis, como posição, jogos, vitórias, empates,
derrotas, gols marcados, gols sofridos, saldo e pontos.
`,

    resultados: `
Analise uma tela de resultados ou calendário do Football Manager.
Extraia data, competição, adversário, local, placar e resultado das partidas visíveis.
`,

    transferencias: `
Analise uma tela de transferências do Football Manager.
Extraia jogador, tipo de transferência, clube de origem, clube de destino, valor,
data ou temporada, somente quando estiver claramente visível.
`,

    perfil_jogador: `
Analise o perfil de um jogador do Football Manager.
Extraia nome, idade, nacionalidade, posição, clube, número e estatísticas visíveis.
`,

    outro: `
Analise a tela do Football Manager e extraia as informações esportivas visíveis
de forma estruturada.
`
  };

  return `
Você está analisando um print do Football Manager para o aplicativo FM Career Stats.

${contextoTemporada}

Tipo de tela selecionado: ${tipo}.

${instrucoesPorTipo[tipo] || instrucoesPorTipo.outro}

REGRAS IMPORTANTES:
1. Não invente nenhum dado.
2. Quando não conseguir ler um valor, use null.
3. Preserve nomes exatamente como aparecem.
4. Diferencie corretamente jogos, gols, assistências e nota média.
5. Não misture linhas ou colunas.
6. Use números sem símbolos quando forem valores numéricos.
7. Retorne apenas o JSON exigido pelo esquema.
8. Inclua avisos sobre partes ilegíveis ou duvidosas.
`;
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    tipoDetectado: {
      type: "STRING"
    },
    confiancaGeral: {
      type: "NUMBER"
    },
    temporada: {
      type: ["STRING", "NULL"]
    },
    jogadores: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          nome: { type: ["STRING", "NULL"] },
          numero: { type: ["INTEGER", "NULL"] },
          posicao: { type: ["STRING", "NULL"] },
          nacionalidade: { type: ["STRING", "NULL"] },
          idade: { type: ["INTEGER", "NULL"] },
          status: { type: ["STRING", "NULL"] },
          jogos: { type: ["INTEGER", "NULL"] },
          titular: { type: ["INTEGER", "NULL"] },
          minutos: { type: ["INTEGER", "NULL"] },
          gols: { type: ["INTEGER", "NULL"] },
          assistencias: { type: ["INTEGER", "NULL"] },
          notaMedia: { type: ["NUMBER", "NULL"] }
        },
        required: [
          "nome",
          "numero",
          "posicao",
          "nacionalidade",
          "idade",
          "status",
          "jogos",
          "titular",
          "minutos",
          "gols",
          "assistencias",
          "notaMedia"
        ]
      }
    },
    classificacao: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          posicao: { type: ["INTEGER", "NULL"] },
          equipe: { type: ["STRING", "NULL"] },
          jogos: { type: ["INTEGER", "NULL"] },
          vitorias: { type: ["INTEGER", "NULL"] },
          empates: { type: ["INTEGER", "NULL"] },
          derrotas: { type: ["INTEGER", "NULL"] },
          golsMarcados: { type: ["INTEGER", "NULL"] },
          golsSofridos: { type: ["INTEGER", "NULL"] },
          saldo: { type: ["INTEGER", "NULL"] },
          pontos: { type: ["INTEGER", "NULL"] }
        },
        required: [
          "posicao",
          "equipe",
          "jogos",
          "vitorias",
          "empates",
          "derrotas",
          "golsMarcados",
          "golsSofridos",
          "saldo",
          "pontos"
        ]
      }
    },
    partidas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          data: { type: ["STRING", "NULL"] },
          competicao: { type: ["STRING", "NULL"] },
          adversario: { type: ["STRING", "NULL"] },
          local: { type: ["STRING", "NULL"] },
          golsTime: { type: ["INTEGER", "NULL"] },
          golsAdversario: { type: ["INTEGER", "NULL"] },
          resultado: { type: ["STRING", "NULL"] }
        },
        required: [
          "data",
          "competicao",
          "adversario",
          "local",
          "golsTime",
          "golsAdversario",
          "resultado"
        ]
      }
    },
    transferencias: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          jogador: { type: ["STRING", "NULL"] },
          tipo: { type: ["STRING", "NULL"] },
          origem: { type: ["STRING", "NULL"] },
          destino: { type: ["STRING", "NULL"] },
          valor: { type: ["NUMBER", "NULL"] },
          data: { type: ["STRING", "NULL"] },
          temporada: { type: ["STRING", "NULL"] }
        },
        required: [
          "jogador",
          "tipo",
          "origem",
          "destino",
          "valor",
          "data",
          "temporada"
        ]
      }
    },
    perfilJogador: {
      type: ["OBJECT", "NULL"],
      properties: {
        nome: { type: ["STRING", "NULL"] },
        idade: { type: ["INTEGER", "NULL"] },
        nacionalidade: { type: ["STRING", "NULL"] },
        posicao: { type: ["STRING", "NULL"] },
        clube: { type: ["STRING", "NULL"] },
        numero: { type: ["INTEGER", "NULL"] },
        jogos: { type: ["INTEGER", "NULL"] },
        gols: { type: ["INTEGER", "NULL"] },
        assistencias: { type: ["INTEGER", "NULL"] },
        notaMedia: { type: ["NUMBER", "NULL"] }
      },
      required: [
        "nome",
        "idade",
        "nacionalidade",
        "posicao",
        "clube",
        "numero",
        "jogos",
        "gols",
        "assistencias",
        "notaMedia"
      ]
    },
    avisos: {
      type: "ARRAY",
      items: {
        type: "STRING"
      }
    }
  },
  required: [
    "tipoDetectado",
    "confiancaGeral",
    "temporada",
    "jogadores",
    "classificacao",
    "partidas",
    "transferencias",
    "perfilJogador",
    "avisos"
  ]
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      erro: "Método não permitido. Use POST."
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({
        erro: "A chave GEMINI_API_KEY não está configurada."
      });
    }

    const {
      imagemBase64,
      mimeType,
      tipo = "outro",
      temporada = ""
    } = request.body || {};

    const tipoNormalizado = TIPOS_VALIDOS.has(tipo) ? tipo : "outro";
    const imagemLimpa = limparBase64(imagemBase64);

    if (!imagemLimpa) {
      return response.status(400).json({
        erro: "Nenhuma imagem foi enviada."
      });
    }

    if (!String(mimeType || "").startsWith("image/")) {
      return response.status(400).json({
        erro: "O arquivo enviado precisa ser uma imagem."
      });
    }

    const endereco =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const resultado = await fetch(endereco, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: criarInstrucao(tipoNormalizado, temporada)
              },
              {
                inlineData: {
                  mimeType,
                  data: imagemLimpa
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema
        }
      })
    });

    const dados = await resultado.json();

    if (!resultado.ok) {
      console.error("Erro retornado pelo Gemini:", dados);

      return response.status(resultado.status).json({
        erro:
          dados?.error?.message ||
          "O Gemini não conseguiu analisar a imagem."
      });
    }

    const texto =
      dados?.candidates?.[0]?.content?.parts
        ?.map((parte) => parte.text || "")
        .join("") || "";

    if (!texto) {
      return response.status(502).json({
        erro: "A IA não retornou dados para esta imagem."
      });
    }

    let analise;

    try {
      analise = JSON.parse(texto);
    } catch (erro) {
      console.error("JSON inválido retornado pelo Gemini:", texto);

      return response.status(502).json({
        erro: "A IA retornou um resultado que não pôde ser interpretado."
      });
    }

    return response.status(200).json({
      sucesso: true,
      analise
    });
  } catch (erro) {
    console.error("Erro em analisar-print:", erro);

    return response.status(500).json({
      erro: "Erro interno ao processar a imagem."
    });
  }
}
