'use strict';

/* 1. Conteúdo editorial. Os nomes e poderes são lidos dos JSONs locais.
   Para mudar a seleção, mantenha name e part iguais aos valores da base. */
const selections = [
  {
    id: 'giorno',
    name: 'Giorno Giovanna',
    part: 'Vento Aureo',
    button: 'Ver Stand',
    description: 'Determinação e um sonho que move sua jornada pela Itália.',
    detail: 'Gold Experience é o Stand de Giorno. Sua habilidade dá vida a objetos inanimados.',
    source: 'https://jojowiki.com/Gold_Experience',
    image: 'assets/giorno-detail.webp',
  },
  {
    id: 'gyro',
    name: 'Gyro Zeppeli',
    part: 'Steel Ball Run',
    button: 'Ver esferas de aço',
    description: 'Um competidor de Steel Ball Run que domina a técnica do Spin.',
    detail: 'Gyro usa suas esferas de aço para aplicar o Spin. As esferas são instrumentos dessa técnica, não um Stand.',
    source: 'https://jojowiki.com/Steel_Ball',
    image: 'assets/gyro-steel-balls-cutout.webp',
  },
  {
    id: 'dio',
    name: 'Dio Brando',
    part: 'Stardust Crusaders',
    button: 'Ver Stand',
    description: 'Uma presença marcante na obra, acompanhada pelo poderoso The World.',
    detail: 'The World é o Stand de Dio, conhecido por sua força e capacidade de parar o tempo.',
    source: 'https://jojowiki.com/The_World',
    image: 'assets/dio-detail.webp',
  },
  {
    id: 'jonathan',
    name: 'Jonathan Joestar',
    part: 'Phantom Blood',
    group: 'joestars',
    button: 'Ver Hamon',
    description: 'O primeiro JoJo: coragem e determinação na origem da saga.',
    detail: 'Jonathan aprende com Will Anthonio Zeppeli a controlar o Hamon, uma energia produzida pela respiração. Aqui ele é apresentado na fase Phantom Blood, como usuário de Hamon.',
    source: 'https://jojowiki.com/Jonathan_Joestar',
    image: 'assets/jonathan-portrait.webp',
    imageAlt: 'Jonathan Joestar na fase Phantom Blood',
  },
  {
    id: 'joseph',
    name: 'Joseph Joestar',
    part: 'Battle Tendency',
    group: 'joestars',
    button: 'Ver Hamon',
    description: 'O jovem Joseph combina Hamon, improviso e muita astúcia.',
    detail: 'Em Battle Tendency, Joseph utiliza Hamon e estratégias imprevisíveis para enfrentar seus adversários. Este card representa sua juventude, antes da fase de Hermit Purple.',
    source: 'https://jojowiki.com/Joseph_Joestar',
    image: 'assets/joseph-portrait.webp',
    imageAlt: 'Joseph Joestar jovem, na fase Battle Tendency',
  },
  {
    id: 'jotaro',
    name: 'Jotaro Kujo',
    part: 'Stardust Crusaders',
    group: 'joestars',
    button: 'Ver Stand',
    description: 'Um olhar firme e a precisão de Star Platinum em sua jornada.',
    detail: 'Star Platinum é o Stand de Jotaro em Stardust Crusaders. Destaca-se pela força, velocidade e precisão em curta distância.',
    source: 'https://jojowiki.com/Star_Platinum',
    image: 'assets/jotaro-detail.webp',
  },
];

/* 2. Mídia opcional: preencher somente após incluir e creditar os clipes reais.
   Exemplo: giorno: { webm: 'assets/giorno.webm', mp4: 'assets/giorno.mp4' } */
const clips = {};
const dataPaths = ['data/jojo.json', 'data/personagens-extras.json'];
let activeClose = null;
let isLoading = false;

/* 3. Criação segura do conteúdo: textContent evita interpretar dados como HTML. */
function createElement(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/* 4. Cada personagem é um article nomeado pelo seu h3.
   Elementos decorativos não são anunciados pelo leitor de tela. */
function renderCard(selection, record, index) {
  const card = createElement('article', `card ${selection.id}`);
  const heading = createElement('h3', '', record.user);
  heading.id = `title-${selection.id}`;
  card.setAttribute('aria-labelledby', heading.id);

  const portrait = `assets/${selection.id}-portrait.webp`;
  const visual = createElement('div', 'visual');
  const img = createElement('img');
  img.src = portrait;
  img.alt = selection.name;
  img.width = 520;
  img.height = 640;
  img.decoding = 'async';
  // A segunda seção carrega os retratos apenas quando se aproxima da tela.
  if (selection.group === 'joestars') img.loading = 'lazy';
  // O placeholder é a última tentativa, evitando um ciclo se ele também falhar.
  img.addEventListener('error', () => {
    if (!img.src.endsWith('/assets/placeholder.svg')) {
      img.src = 'assets/placeholder.svg';
    }
  });

  const number = createElement('span', 'number', String(index + 1).padStart(2, '0'));
  const backdrop = createElement('span', 'backdrop-name', selection.id.toUpperCase());
  number.setAttribute('aria-hidden', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  visual.append(backdrop, number, img);

  const content = createElement('div', 'content');
  content.append(
    createElement('p', 'part', selection.part),
    heading,
    createElement('p', 'power', record.stand || record.ability),
    createElement('p', 'description', selection.description),
  );

  /* Painel expansível: hidden e aria-expanded permanecem sincronizados. */
  const detail = createElement('div', 'detail');
  detail.id = `detail-${selection.id}`;
  detail.hidden = true;
  const source = createElement('a', '', 'Conhecer a habilidade na JoJo Wiki');
  source.href = selection.source;
  const note = createElement('p', 'media-note');
  note.setAttribute('role', 'status');
  detail.append(createElement('p', '', selection.detail), source, note);

  const button = createElement('button', '', selection.button);
  button.type = 'button';
  button.setAttribute('aria-controls', detail.id);
  let video = null;

  function updateButton(expanded) {
    const label = expanded ? 'Voltar ao personagem' : selection.button;
    button.textContent = label;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', `${label}: ${selection.name}`);
  }
  updateButton(false);

  /* 5. Restaurar o retrato sempre pausa a mídia antes de escondê-la. */
  function close() {
    detail.hidden = true;
    card.classList.remove('is-expanded');
    updateButton(false);
    if (video) {
      video.pause();
      video.hidden = true;
    }
    img.hidden = false;
    img.src = portrait;
    img.alt = selection.name;
  }

  function fallback() {
    if (video) {
      video.pause();
      video.hidden = true;
    }
    img.hidden = false;
    note.textContent = 'Não foi possível reproduzir o vídeo. A imagem foi mantida.';
  }

  /* 6. Vídeo sob demanda: nenhuma requisição de clipe antes do primeiro clique.
     O navegador escolhe entre as fontes conforme os formatos que suporta. */
  function showVideo() {
    if (!video) {
      video = createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.controls = true;
      video.preload = 'none';
      video.setAttribute('aria-label', `Demonstração de ${record.stand || record.ability}`);
      const formats = [['webm', 'video/webm'], ['mp4', 'video/mp4']];
      for (const [format, type] of formats) {
        if (!clips[selection.id][format]) continue;
        const source = createElement('source');
        source.src = clips[selection.id][format];
        source.type = type;
        video.append(source);
      }
      video.addEventListener('error', fallback);
      visual.append(video);
    }
    img.hidden = true;
    video.hidden = false;
    note.textContent = '';
    // Movimento reduzido: deixar a reprodução a cargo do controle nativo.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {
        // Uma promessa atrasada não deve reabrir a mídia de um card já fechado.
        if (!detail.hidden) fallback();
      });
    }
  }

  /* 7. Botões nativos funcionam por clique, toque, Enter e Espaço.
     Apenas um card fica expandido por vez. */
  button.addEventListener('click', () => {
    if (!detail.hidden) {
      close();
      activeClose = null;
      return;
    }
    if (activeClose) activeClose();
    activeClose = close;
    detail.hidden = false;
    card.classList.add('is-expanded');
    updateButton(true);
    img.src = selection.image;
    img.alt = selection.imageAlt || (selection.id === 'gyro'
      ? 'Gyro Zeppeli segurando uma esfera de aço'
      : record.stand);
    if (!clips[selection.id]) {
      note.textContent = 'Apresentação estática · vídeo ainda não adicionado.';
      return;
    }
    showVideo();
  });

  content.append(detail, button);
  card.append(visual, content);
  return card;
}

/* 8. Consumo HTTP de JSONs locais; não depende da API original estar online.
   O fragmento só é inserido após conferir todos os registros da seleção. */
async function load() {
  if (isLoading) return;
  isLoading = true;
  const retry = document.querySelector('#retry');
  const restoreFocus = document.activeElement === retry;
  retry.disabled = true;
  const status = document.querySelector('#status');
  status.textContent = 'Carregando os personagens…';
  const cards = document.querySelector('#cards');
  const joestars = document.querySelector('#joestar-cards');
  cards.setAttribute('aria-busy', 'true');
  joestars.setAttribute('aria-busy', 'true');
  try {
    const datasets = await Promise.all(dataPaths.map(async (url) => {
      // Cada tentativa tem prazo e ignora respostas antigas do cache.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
        return await response.json();
      } finally {
        clearTimeout(timeout);
      }
    }));
    const fragments = {
      favorites: document.createDocumentFragment(),
      joestars: document.createDocumentFragment(),
    };
    selections.forEach((selection, index) => {
      const record = datasets
        .flatMap((dataset) => dataset[selection.part] || [])
        .find((item) => item.user === selection.name);
      if (!record) throw new Error(`Personagem ausente: ${selection.name}`);
      fragments[selection.group || 'favorites'].append(renderCard(selection, record, index));
    });
    cards.replaceChildren(fragments.favorites);
    joestars.replaceChildren(fragments.joestars);
    status.textContent = '';
    retry.hidden = true;
    if (restoreFocus) cards.querySelector('button')?.focus();
  } catch (error) {
    console.error('Não foi possível montar a galeria:', error);
    status.textContent = 'Não foi possível carregar os personagens. Confira se o servidor local está ativo e tente novamente.';
    retry.hidden = false;
  } finally {
    cards.setAttribute('aria-busy', 'false');
    joestars.setAttribute('aria-busy', 'false');
    isLoading = false;
    retry.disabled = false;
  }
}

/* 9. Encerrar a apresentação ao sair da aba evita reprodução em segundo plano. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden && activeClose) {
    activeClose();
    activeClose = null;
  }
});

// O mesmo fluxo é reutilizado na recuperação, sem recarregar a página.
document.querySelector('#retry').addEventListener('click', load);

// O atributo defer no HTML garante que os elementos já existam neste ponto.
load();
