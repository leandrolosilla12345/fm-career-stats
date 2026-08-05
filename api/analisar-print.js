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
  const instrucoes = {
    elenco: "Extraia os jogadores visíveis com nome, número, posição, nacionalidade, idade e status.",
    estatisticas: "Extraia os jogadores e as colunas visíveis, principalmente jogos, gols, assistências, minutos, titularidades e nota média.",
    classificacao: "Extraia posição, equipe, jogos, vitórias, empates, derrotas, gols marcados, gols sofridos, saldo e pontos.",
    resultados: "Extraia data, competição, adversário, local, placar e resultado das partidas visíveis.",
    transferencias: "Extraia jogador, tipo, origem, destino, valor, data e temporada.",
    perfil_jogador: "Extraia nome, idade, nacionalidade, posição, clube, número e estatísticas visíveis.",
    outro: "Extraia as informações esportivas legíveis da tela."
  };

  return `
Analise este print do Football Manager para o aplicativo FM Career Stats.

Tipo escolhido: ${tipo}
Temporada escolhida: ${temporada || "não informada"}

${instrucoes[tipo] || instrucoes.outro}

REGRAS:
- Não invente informações.
- Quando um texto não estiver legível, use uma string vazia.
- Quando um número não estiver legível, use 0.
- Não troque as colunas de jogos, gols, assistências e nota.
- Preserve os nomes como aparecem no print.
- Devolva SOMENTE um JSON válido, sem markdown e sem explicações.

Formato obrigatório:
{
  "tipoDetectado": "",
  "confiancaGeral": 0,
  "temporada": "",
  "jogadores": [
    {
      "nome": "",
      "numero": 0,
      "posicao": "",
      "nacionalidade": "",
      "idade": 0,
      "status": "",
      "jogos": 0,
      "titular": 0,
      "minutos": 0,
      "gols": 0,
      "assistencias": 0,
      "notaMedia": 0
    }
  ],
  "classificacao": [
    {
      "posicao": 0,
      "equipe": "",
      "jogos": 0,
      "vitorias": 0,
      "empates": 0,
      "derrotas": 0,
      "golsMarcados": 0,
      "golsSofridos": 0,
      "saldo": 0,
      "pontos": 0
    }
  ],
  "partidas": [
    {
      "data": "",
      "competicao": "",
      "adversario": "",
      "local": "",
      "golsTime": 0,
      "golsAdversario": 0,
      "resultado": ""
    }
  ],
  "transferencias": [
    {
      "jogador": "",
      "tipo": "",
      "origem": "",
      "destino": "",
      "valor": 0,
      "data": "",
      "temporada": ""
    }
  ],
  "perfilJogador": {
    "nome": "",
    "idade": 0,
    "nacionalidade": "",
    "posicao": "",
    "clube": "",
    "numero": 0,
    "jogos": 0,
    "gols": 0,
    "assistencias": 0,
    "notaMedia": 0
  },
  "avisos": []
}

Use listas vazias quando o tipo da tela não possuir aquela categoria.
`;
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    tipoDetectado: { type: "STRING" },
    confiancaGeral: { type: "NUMBER" },
    temporada: { type: "STRING" },
    jogadores: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          nome: { type: "STRING" },
          numero: { type: "INTEGER" },
          posicao: { type: "STRING" },
          nacionalidade: { type: "STRING" },
          idade: { type: "INTEGER" },
          status: { type: "STRING" },
          jogos: { type: "INTEGER" },
          titular: { type: "INTEGER" },
          minutos: { type: "INTEGER" },
          gols: { type: "INTEGER" },
          assistencias: { type: "INTEGER" },
          notaMedia: { type: "NUMBER" }
        },
        required: [
          "nome", "numero", "posicao", "nacionalidade", "idade", "status",
          "jogos", "titular", "minutos", "gols", "assistencias", "notaMedia"
        ]
      }
    },
    classificacao: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          posicao: { type: "INTEGER" },
          equipe: { type: "STRING" },
          jogos: { type: "INTEGER" },
          vitorias: { type: "INTEGER" },
          empates: { type: "INTEGER" },
          derrotas: { type: "INTEGER" },
          golsMarcados: { type: "INTEGER" },
          golsSofridos: { type: "INTEGER" },
          saldo: { type: "INTEGER" },
          pontos: { type: "INTEGER" }
        },
        required: [
          "posicao", "equipe", "jogos", "vitorias", "empates", "derrotas",
          "golsMarcados", "golsSofridos", "saldo", "pontos"
        ]
      }
    },
    partidas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          data: { type: "STRING" },
          competicao: { type: "STRING" },
          adversario: { type: "STRING" },
          local: { type: "STRING" },
          golsTime: { type: "INTEGER" },
          golsAdversario: { type: "INTEGER" },
          resultado: { type: "STRING" }
        },
        required: [
          "data", "competicao", "adversario", "local",
          "golsTime", "golsAdversario", "resultado"
        ]
      }
    },
    transferencias: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          jogador: { type: "STRING" },
          tipo: { type: "STRING" },
          origem: { type: "STRING" },
          destino: { type: "STRING" },
          valor: { type: "NUMBER" },
          data: { type: "STRING" },
          temporada: { type: "STRING" }
        },
        required: [
          "jogador", "tipo", "origem", "destino", "valor", "data", "temporada"
        ]
      }
    },
    perfilJogador: {
      type: "OBJECT",
      properties: {
        nome: { type: "STRING" },
        idade: { type: "INTEGER" },
        nacionalidade: { type: "STRING" },
        posicao: { type: "STRING" },
        clube: { type: "STRING" },
        numero: { type: "INTEGER" },
        jogos: { type: "INTEGER" },
        gols: { type: "INTEGER" },
        assistencias: { type: "INTEGER" },
        notaMedia: { type: "NUMBER" }
      },
      required: [
        "nome", "idade", "nacionalidade", "posicao", "clube",
        "numero", "jogos", "gols", "assistencias", "notaMedia"
      ]
    },
    avisos: {
      type: "ARRAY",
      items: { type: "STRING" }
    }
  },
  required: [
    "tipoDetectado", "confiancaGeral", "temporada", "jogadores",
    "classificacao", "partidas", "transferencias", "perfilJogador", "avisos"
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
        erro: "O arquivo precisa ser uma imagem."
      });
    }

    const endereco =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-2.0-flash:generateContent?key=" +
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
              { text: criarInstrucao(tipoNormalizado, temporada) },
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
      console.error("Erro do Gemini:", dados);
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
        erro: "A IA não retornou dados."
      });
    }

    let analise;

    try {
      analise = JSON.parse(texto);
    } catch (erro) {
      console.error("Resposta inválida:", texto);
      return response.status(502).json({
        erro: "A resposta da IA não pôde ser interpretada."
      });
    }

    return response.status(200).json({
      sucesso: true,
      analise
    });
  } catch (erro) {
    console.error("Erro interno:", erro);
    return response.status(500).json({
      erro: "Erro interno ao analisar o print."
    });
  }
}
