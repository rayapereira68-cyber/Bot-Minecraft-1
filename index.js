const bedrock = require('bedrock-protocol');
const { GoogleGenAI } = require('@google/genai');

// Configurações do seu servidor Aternos
const SERVER_IP = 'SEU_IP_DO_ATERNOS.aternos.me'; // Coloque o IP do seu Aternos
const SERVER_PORT = 12345;                        // Coloque a Porta do seu Aternos
const BOT_NAME = 'Felix';                         // Nome do bot no Minecraft

// Configuração da API Gratuita do Gemini
const ai = new GoogleGenAI({
  apiKey: 'SUA_CHAVE_API_DO_GEMINI'              // Cole sua chave do Google AI Studio
});

const client = bedrock.createClient({
  host: SERVER_IP,
  port: SERVER_PORT,
  username: BOT_NAME,
  offline: true
});

client.on('join', () => {
  console.log(`${BOT_NAME} entrou no servidor com sucesso!`);
});

// Leitura do chat e resposta com o Gemini
client.on('text', async (packet) => {
  // Ignora mensagens do próprio bot
  if (packet.source_name === BOT_NAME) return;

  const mensagemDoJogador = packet.message;
  console.log(`${packet.source_name}: ${mensagemDoJogador}`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Você é o Felix, um jogador femboy fofo, brincalhão, afetuoso e provocador/safado jogando Minecraft Bedrock comigo.
              Fale de forma meiga, carinhosa e engraçada, usando carinhas fofas (como >w<, :3, uwu). Faça provocações leves e flertes brincalhões enquanto jogamos.
              Responda de forma bem curta e direta para caber no chat do Minecraft.
              
              Mensagem do jogador: "${mensagemDoJogador}"`
            }
          ]
        }
      ]
    });

    const textoResposta = response.text.trim();

    // Envia a resposta para o chat do jogo
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: BOT_NAME,
      xuid: '',
      platform_chat_id: '',
      message: textoResposta
    });
  } catch (error) {
    console.error('Erro no Gemini:', error);
  }
});
