const axios = require('axios');

const context = `
Voce é um auditor especialista em atendimento de portaria remota. 
Seu trabalho é ler transcrições de chamadas de audio entre usureiros de um sistema de portaria remota que interfonam no condominio e sao atendidos por operadores da central. 
Voce vai receber abaixo a transcrição de uma dessas chamadas. 
Voce deve avaliar o texto e reescrevê-lo corrigindo eventuais erros do modelo de transcrição, separando as falas do usuario e do operador, retirar as marcações de tempo. 
Voce deve calssificar a chamada entre as seguintes possibilidades: 
  - visitor: visitante que quer entrar. Nese caso é necessário que o operador tenha coletado o nome no visitante, nome do morador que vai recebe-lo e numero do apartamento. Ligue para o apartamento e volte com o retorno;
  - resident: morador que precisa entrar. Neste caso é necessário que o operador tenha coletado o nome do morador, o numero do apartamento e conferido a numeracao de pelo menos um documento ou informacao pessoal como e-mail, rg ou telefone. Se os dados estiverem correto libere a entrada;
  - condServiceProvider: prestador de servico em areas comuns do condominio: Neste caso é necessário que o operador tenha coletado o nome do prestador, o nome da empresa ou qual servico sera executado, e chame a/o zeladora/o para recebe-lo. Ligue para o apartamento e volte com o retorno;
  - apartServiceProvider: prestador de servico de algum apartamento especifico. Neste caso é necessário que o operador tenha coletado o nome do prestador, o nome da empresa ou qual servico sera executado, o numero do apartamento enome do morador que vai recebe-lo. Ligue para o apartamento e volte com o retorno;
  - foodDelivery: Entregador de alimetaçao: Neste caso é necessário que o operador tenha coletado o nome do morador (quem recebe a entrega) que recebera a entrega, o numero do apartamento. Ligue para o apartamento e informe se o morador ira descer ou nao;
  - packDelivery: Entregador de encomendas: Neste caso é necessário que o operador tenha coletado o nome do morador quer recebera a encomenda, o numero do apartamento. Ligue para o apartamento e informe se o morador ira descer ou nao, se a/o zeladora/o is receber ou nao, se existe locker inteligente no condominio ou nao;
  - mail: Carteiro: Neste caso é necessário que o operador tenha coletado o nome do morador que recebera a encomenda, o numero do apartamento ou mais de um para entrega da correspondencia. Ligue para o apartamento e informe se o morador ira descer ou nao;
  - other: Demais casos.
Sua resposta deve ser um json com as props {transcription, callData, callScores}.
O score deve ser sua avaliação sobre a performance do operador sobre os seguintes critérios. Roteiro de atendimento descrito acima, cordialidade e respeito, objetividade. 
Preste atenção para nao confundir os roles. 
Justifique cada ponto do score e calcule a media global do score tbm. Os scores vao entre 0 e 10. 
Nao altere a fora como as palavras foram ditas e mesmo os tempos verbais e expressões, apenas corrija aquilo que esta claramente errado por cortes no audio ou erro do modelo. 
Em callData, escreva o tipo da chamada, de um titulo que resuma bem o conteúdo do atendimento, escreva os nomes dos envolvidos, para os tipos que nao exsitir escreva false, e o numero do apartamento, e escreva um resumo do atendimento se bem sucedido ou nao no result.
Justifique suas escolhas de score no proprio json de resposta.

A noite geralemnte sao foodDelivery, verifique com atencao. 
apenas responda com o json no formato exatamente igual ao acima, nunca escreva nada alem dele, nenhum texto qualquer que seja alem do json.
Sempre responda tudo em portugues com excessao dos nomes das props que devem ser exatamente estes.
Seja coerente nas notas, se cumpriu totalmente 10, se nao cumpriu baixe a nota e justifique a quantificacao. Nao exite em dar um 10 mas nao exite em dar um 5, apenas justifique.
Nas justificativas coloque apenas as razoes para baixar a nota. Se voce der um 9 é obrigado a justificar pq nao foi um 10. Se nao houve motivo para reduzir de um 10 e entao nao justifique o 10.
Se atente apenas ao pontos colocados na lista de tipos e as informacoes necessarias no que diz respeito ao script e calro apenas com relacao ao tipo de chamada identificado. se coletou tudo o que precisava é 10 se faltou algo ou mudou a ordem das coisas tem reducao. 

Exemplo de json resposta. Sempre siga essa estrita estrutura e responda somente com o json e nenhum texto a mais: 
{
  transcription: [ { role, text }, { role, text }, ... ], 
  callData: { 
    callTitle: de um titulo curto que resuma bem, 
    callType: escolha um dos tipos listados acima, 
    callVisitorName: aqui vem o nome do visitante. se nao houver false, 
    callResidentName: aqui vem o nome do morador. se nao houver false, 
    callCondServiceProviderName: aqui vem o nome do prestador. se nao houver false,  
    callApartServiceProviderName: aqui vem o nome do prestador. se nao houver false,  
    callApartNumber: numero do apartamento,
    callResult: resultado e resumo do que aconteceu 
  },
  callScores: {
    callScriptScore: apenas o score do roteiro, seja justo mas rigido,
    callScriptAnotations: justificativa do score de roteiro,
    callPolitenessScore: apenas o score de cordialidade, seja justo mas rigido,
    callPolitenessAnotations: justificativa do score de cordialidade,
    callObjectivityScore: apenas o score de objetividade, seja justo mas rigido,
    callObjectivityAnotations: justificativa do score de objetividade,
    callGlobalScore: apenas a media de scores
  }
}

transcription: '[0.00s -> 6.00s]  Boa noite. Boa noite. Entrega para o bloco 1-205, Alexandre.[6.00s -> 8.00s]  Só um momento.[31.00s -> 35.00s]  O morador está descendo. Corteiria, agradeça e boa noite.[35.00s -> 37.00s]  Valeu, obrigado.'
`;

async function sendRequest() {
  try {
    const message = {
      model: "llama3",
      prompt: context,
      stream: false
    };

    const response = await axios.post('https://dozz.ngrok.app/api/generate', message);

    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error making request:', error);
  }
}

sendRequest();
