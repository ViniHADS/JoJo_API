# Meu top 3 de JoJo

Página acadêmica responsiva em HTML, CSS e JavaScript puro, com Giorno Giovanna e **Gold Experience**, Gyro Zeppeli e suas **esferas de aço / Spin**, e Dio Brando com **The World**. A ordem segue a seleção do usuário.

## Como executar

Página pública: [abrir o projeto no GitHub Pages](https://vinihads.github.io/JoJo_API/).

O site é publicado pelo GitHub Pages a partir da raiz da branch `main`. Novos commits enviados para essa branch atualizam a publicação automaticamente.

Abra a pasta no VS Code e execute `index.html` com Live Server. Alternativamente, no terminal desta pasta, com Python 3 instalado:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Acesse http://127.0.0.1:8765. Não abra o HTML diretamente por `file://`, pois o navegador pode bloquear o `fetch()` dos JSONs.

## Consumo dos dados

O JavaScript faz duas requisições HTTP locais via Fetch API: `data/jojo.json` e `data/personagens-extras.json`. A primeira é um recorte da base original da JojoAPI, preservando os registros de Giorno, Dio, Jonathan, Joseph e Jotaro. A segunda é uma extensão editorial para Gyro e para as versões de Jonathan (Phantom Blood) e Joseph (Battle Tendency) com Hamon. Os nomes e poderes dos cards vêm desses arquivos; as descrições curtas e a seleção de imagens estão no JavaScript.

O serviço original da JojoAPI está indisponível segundo seu autor, que recomenda o uso de `app/data.json`. Portanto, esta página **consome uma cópia local de dados JSON, não a API REST original ao vivo**. Não há autenticação, chave de API, banco de dados ou backend de negócio. Os registros foram obtidos em 08/10/2026.

## Estrutura e requisitos

- `index.html`: header, título principal, descrição, duas seções com seis cards no total e footer.
- `style.css`: CSS Grid, duas colunas abaixo de 950px (Dio ocupa uma linha com imagem e texto lado a lado) e uma abaixo de 600px; espaçamento, box-sizing, tipografia fluida, foco visível e preferência por movimento reduzido.
- `script.js`: leitura dos dados, montagem dos cards e um botão em cada card para revelar a habilidade e voltar ao personagem.
- `data/`: recorte original e personagens extras separados.
- `assets/`: imagens locais em WebP, a imagem JPEG fornecida pelo usuário e SVGs leves, sem fontes ou bibliotecas externas.

Somente uma apresentação fica aberta por vez. Ao sair da aba, a apresentação é fechada. Há mensagem de falha para os dados e imagem substituta para arquivos ausentes. Gyro não tem suas esferas classificadas como Stand.

## Estado das animações

**Nenhum clipe WebM ou MP4 foi incluído nesta primeira versão.** Os botões mostram imagens e informações reais; a interface informa que a apresentação ainda é estática. A imagem exibida pelo botão de Gyro foi fornecida por mim (`Gyro_Zeppeli.jpg`). O recorte transparente é servido como `assets/gyro-steel-balls-cutout.webp`; o JPEG original foi preservado. A fonte original dessa imagem não foi informada.

O código já prevê clipes no objeto `clips` de `script.js`. Depois de selecionar, revisar e creditar os arquivos, adicione-os em `assets/` e configure, por exemplo:

```js
const clips = {
  giorno: { webm: 'assets/giorno.webm', mp4: 'assets/giorno.mp4' },
  gyro: { webm: 'assets/gyro.webm', mp4: 'assets/gyro.mp4' },
  dio: { webm: 'assets/dio.webm', mp4: 'assets/dio.mp4' }
};
```

O elemento de vídeo só é criado após o clique; WebM é a primeira opção e MP4 é a alternativa conforme o suporte do navegador. A reprodução é sem áudio, com controles e repetição; movimento reduzido exige reprodução manual. Voltar ao personagem interrompe o vídeo. É necessário validar os clipes nos navegadores-alvo antes de considerar essa etapa concluída. Recomenda-se duração de 3–6 segundos e resolução moderada, sem áudio, evitando arquivos grandes.

## Fontes e créditos

- Dados originais: [ItzSylex/JojoAPI](https://github.com/ItzSylex/JojoAPI), arquivo [app/data.json](https://raw.githubusercontent.com/ItzSylex/JojoAPI/master/app/data.json).
- Gyro e Spin: [Gyro Zeppeli](https://jojowiki.com/Gyro_Zeppeli) e [Steel Ball](https://jojowiki.com/Steel_Ball).
- Stands: [Gold Experience](https://jojowiki.com/Gold_Experience) e [The World](https://jojowiki.com/The_World).
- Imagens de personagens e Stands: JoJo Wiki, obtidas dos endereços registrados em `data/jojo.json` e `data/personagens-extras.json`, convertidas para WebP. Dio usa a imagem de Stardust Crusaders, segunda imagem do registro original. The World usa a versão original do arquivo indicado na base, sem o caminho de miniatura.
- Ilustrações e personagens de JoJo’s Bizarre Adventure pertencem a seus respectivos titulares. A autoria desta página não implica autoria das imagens. Conteúdo textual da JoJo Wiki: observar [créditos e licença da fonte](https://jojowiki.com/JoJo_Wiki:Copyrights); imagens possuem condições próprias. Não há licença geral atribuída aos materiais de terceiros.

## Validação

Verifique os seis cards em telas pequenas e grandes, navegação por Tab/Enter, botões de abrir/fechar e carregamento pelo servidor local. A reprodução de vídeo só poderá ser verificada após a inclusão dos clipes.

## Direção visual

Composição editorial inspirada na expressividade do mangá: cores contrastantes, retícula em CSS, contornos de painéis, títulos grandes e retratos em destaque. O card de Gyro tem um deslocamento vertical no desktop; no celular, todos seguem uma coluna. A reformulação utiliza as mesmas imagens locais, fontes do sistema e nenhuma biblioteca adicional.

## Padrões de manutenção

- Arquivos textuais em UTF-8, com finais de linha LF e indentação de dois espaços. O `.editorconfig` orienta editores compatíveis; a declaração `<meta charset="UTF-8">` informa a codificação do HTML ao navegador.
- HTML e CSS separados do comportamento em JavaScript; comentários explicam os blocos e decisões, sem comentar cada instrução óbvia.
- Hierarquia de títulos h1 → h2 → h3, navegação com `nav`, conteúdo com `main`, seções identificadas e um `article` nomeado para cada personagem.
- Botões nativos com nomes acessíveis específicos, `aria-controls` e `aria-expanded`; foco visível, textos alternativos e aviso de carregamento.
- Para alterar textos e ordem, edite `selections` no JavaScript. Para mudar os dados de origem, edite os JSONs; JSON não aceita comentários, então sua documentação fica neste README.
- As cores globais ficam no início de `style.css`; as cores por personagem ficam em `.card`, `.card.gyro` e `.card.dio`. As regras de tablet, celular e movimento reduzido ficam nos blocos finais.

## Refinamentos de leitura e desempenho

Textos de descrição em 15px, informações dos poderes e partes em 12px e créditos em 13px. Imagens usam moldura consistente e `object-fit: contain`, sem zoom que corte as bordas. A imagem de detalhe de Gyro foi convertida para WebP com transparência, preservando o PNG e JPEG de origem.

Se os JSONs falharem ou excederem 10 segundos por requisição, o botão **Tentar novamente** repete a leitura sem atualizar a página. Cliques repetidos durante o carregamento são bloqueados; depois da recuperação, o foco retorna ao primeiro card.

A lista de fontes exatas e a convenção para os vídeos futuros estão em [CREDITOS.md](CREDITOS.md). O rodapé também traz créditos recolhíveis. Nenhum clipe foi acrescentado nesta etapa.

## Três gerações

Os favoritos continuam em destaque. A segunda seção contém Jonathan Joestar com Hamon (Phantom Blood), Joseph jovem com Hamon (Battle Tendency) e Jotaro com Star Platinum (Stardust Crusaders).

A base original associa Jonathan e Joseph a registros de Stands da parte 3. Esses registros foram preservados; as versões anteriores, com Hamon, ficam separadas em `personagens-extras.json`. Os botões de Hamon revelam explicações e mantêm os retratos, sem fingir uma animação da técnica. Jotaro troca seu retrato pela imagem de Star Platinum.

O campo opcional `group: 'joestars'` define a segunda galeria. Seus retratos usam carregamento tardio (`loading="lazy"`). Os seis cards compartilham interação, recuperação de erros e apenas uma apresentação aberta por vez. Os vídeos continuam opcionais e pendentes.

## Sobre o projeto na página

A seção antes do rodapé apresenta as funcionalidades documentadas da JojoAPI, o download de `data.json` e o consumo dos arquivos locais com Fetch API. Explica a inclusão manual de Gyro e as adaptações de Jonathan e Joseph para Hamon. Também distingue a descrição antiga do README original (três partes) do arquivo baixado, que inclui Stone Ocean. Não executamos o backend Flask original; servimos uma seleção dos seus dados estáticos.
