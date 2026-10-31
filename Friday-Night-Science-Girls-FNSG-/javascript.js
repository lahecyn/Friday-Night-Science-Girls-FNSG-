/* =====================================================================
   RITMO NA CIÊNCIA – jogo estilo Friday Night Funkin' (web)
   ---------------------------------------------------------------------
   COMO PERSONALIZAR (veja CONFIGURAÇÃO abaixo):
   • Sprites do personagem em /characters/  →  Pose_id.png
       Poses: Idle, Left, Down, Up, Right   (ex.: Idle_sonia.png)
       Na tela de semanas aparece o Idle de cada um.
   • Ícones da barra de vida em /icons/  →  id_estado.png
       Jogador (id "jogador"):  normal, vitoria, derrota
       Oponente (id da semana, ex. "sonia"):
          normal  = vida normal
          vitoria = quando o jogador está quase perdendo
          derrota = quando a vida DELE está baixa (jogador indo muito bem)
          (ele nunca perde a partida, é só um ícone "cansado")
       Se faltar um estado, usa o "normal"; se faltar tudo, mostra um emoji.
       Jogador olhando para a ESQUERDA, oponente olhando para a DIREITA.
   • Fundo da batalha: PNG 1920x1080 em /backgrounds/ (campo "fundo" da semana; "animacao" = ita, vulcao ou tv, veja fundos.js)
   • Música: mp3 em /songs/ e preencha "audio", "bpm" e "offset" da faixa.
   • Notas: edite "padroes". Cada texto = 1 compasso de 8 passos
       d=esquerda  f=baixo  j=cima  k=direita  -=vazio
       No modo solo: compassos pares = oponente, ímpares = sua vez.
       No multiplayer: os dois jogam TODAS as notas ao mesmo tempo.
   ===================================================================== */

/* ---------- CONFIGURAÇÃO ---------- */
const JOGADOR = "makoto";      // id dos sprites do seu personagem
const inv = (a) => a.map((s) => [...s].reverse().join(""));

const SEMANAS = [
  {
    id: "sonia", nome: "Sônia Guimarães", cor: "#f9cf51", extra: null,
    fundo: { imagem: "backgrounds/sonia.png", animacao: "ita" },   // extra = id de um 3º personagem (opcional)
    faixas: [
      { nome: "Infravermelho", bpm: 100, offset: 0, audio: null,
        padroes: ["d---j---", "-f---k--", "d-f-j-k-", "k-j-f-d-", "d---d---", "-f---j--", "d-f-k---", "---kjfd-"] },
      { nome: "Semicondutor", bpm: 115, offset: 0, audio: null,
        padroes: inv(["d---j---", "-f---k--", "d-f-j-k-", "k-j-f-d-", "d---d---", "-f---j--", "d-f-k---", "---kjfd-"]) }
    ],
    bio: {
      titulo: "Sônia Guimarães – física brasileira",
      texto: [
        "Sônia Guimarães nasceu em Cruzeiro (SP), em 1957. Fez doutorado na Universidade de Manchester, na Inglaterra, e é reconhecida como a primeira mulher negra brasileira a obter doutorado em Física.",
        "Professora do ITA (Instituto Tecnológico de Aeronáutica), pesquisa materiais semicondutores e sensores de radiação infravermelha, além de incentivar meninas e jovens negros a seguirem carreira na ciência."
      ],
      curiosidade: "Sensores infravermelhos, área em que ela pesquisa, estão presentes em equipamentos de visão noturna, termômetros e sistemas de monitoramento."
    }
  },
  {
    id: "katia", nome: "Katia Krafft", cor: "#e8644f", extra: null,
    fundo: { imagem: "backgrounds/katia.png", animacao: "vulcao" },
    faixas: [
      { nome: "Magma", bpm: 120, offset: 0, audio: null,
        padroes: ["d-f-j-k-", "k-j-f-d-", "dfd-jkj-", "-f-j-f-k", "d-dfj-jk", "k-kjf-fd", "dfjk-fjd", "d-k-j-f-"] },
      { nome: "Erupção", bpm: 130, offset: 0, audio: null,
        padroes: inv(["d-f-j-k-", "k-j-f-d-", "dfd-jkj-", "-f-j-f-k", "d-dfj-jk", "k-kjf-fd", "dfjk-fjd", "d-k-j-f-"]) }
    ],
    bio: {
      titulo: "Katia Krafft – vulcanóloga francesa",
      texto: [
        "Katia Krafft (1942–1991) foi uma vulcanóloga francesa que dedicou a vida a estudar vulcões ao lado do marido, Maurice Krafft. O casal viajava pelo mundo para observar erupções de perto.",
        "Os dois registraram erupções em fotos e vídeos de grande qualidade, o que ajudou a divulgar ao público os riscos dos vulcões e a ciência por trás deles. Katia morreu em 1991 durante uma erupção do Monte Unzen, no Japão."
      ],
      curiosidade: "As imagens do casal ainda são usadas em documentários e em aulas sobre vulcanologia."
    }
  },
  {
    id: "carol", nome: "Carol Shaw", cor: "#4aa3e0", extra: null,
    fundo: { imagem: "backgrounds/carol.png", animacao: "tv" },
    faixas: [
      { nome: "Pixel", bpm: 140, offset: 0, audio: null,
        padroes: ["dfjk-fjd", "d-fjk-jf", "dfd-jkj-", "kjfd-dfj", "d-dfj-jk", "fjfkdkdj", "dfjkdfjk", "d-f-j-kd"] },
      { nome: "River Raid", bpm: 150, offset: 0, audio: null,
        padroes: inv(["dfjk-fjd", "d-fjk-jf", "dfd-jkj-", "kjfd-dfj", "d-dfj-jk", "fjfkdkdj", "dfjkdfjk", "d-f-j-kd"]) }
    ],
    bio: {
      titulo: "Carol Shaw – pioneira dos videogames",
      texto: [
        "Carol Shaw nasceu nos Estados Unidos em 1955 e estudou em Berkeley e Stanford. É frequentemente citada como a primeira mulher a atuar como designer e programadora profissional de videogames.",
        "Trabalhou na Atari, onde criou o 3-D Tic-Tac-Toe para o Atari 2600, e depois na Activision, onde fez o River Raid (1982), um dos jogos de maior sucesso daquela época."
      ],
      curiosidade: "Você está jogando um jogo… e ela ajudou a inventar a profissão de quem faz jogos. Programação também é ciência!"
    }
  }
];

/* Dificuldade: só muda a velocidade (música + notas). */
const DIFICULDADES = [
  { nome: "FÁCIL",   mult: 0.85, cor: "#4cff6b" },
  { nome: "NORMAL",  mult: 1.0,  cor: "#ffe14d" },
  { nome: "DIFÍCIL", mult: 1.25, cor: "#ff3b3b" }
];

/* ---------- CONSTANTES ---------- */
const LANES = [
  { nome: "left",  glifo: "←", freq: 262, cor: "#c24b99" },
  { nome: "down",  glifo: "↓", freq: 330, cor: "#00e5ff" },
  { nome: "up",    glifo: "↑", freq: 392, cor: "#27e83a" },
  { nome: "right", glifo: "→", freq: 523, cor: "#ff4b52" }
];
const TECLAS_PADRAO = {
  solo: [["d", "arrowleft"], ["f", "arrowdown"], ["j", "arrowup"], ["k", "arrowright"]],
  p1:   [["a", null], ["s", null], ["w", null], ["d", null]],
  p2:   [["arrowleft", null], ["arrowdown", null], ["arrowup", null], ["arrowright", null]]
};
const NOMES_SET = { solo: "Solo", p1: "Jogador 1 (multi)", p2: "Jogador 2 (multi)" };
const W = 1280, H = 720, MARGEM = 70;
const TEMPO_QUEDA = 1.6, CONTAGEM = 3;
const JANELAS = { sick: 0.045, good: 0.09, bad: 0.13 };
const BARRA_W = 600, ICONE_W = 120;

/* ---------- ATALHOS ---------- */
const $ = (id) => document.getElementById(id);
const palco = $("palco");
const telas = ["menu", "semanas", "options", "jogo", "resultado"];
const canvas = $("campo"), ctx = canvas.getContext("2d");
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- SALVAR / CARREGAR ---------- */
function carregar(chave, padrao) { try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } }
function salvar(chave, v) { try { localStorage.setItem(chave, JSON.stringify(v)); } catch (e) {} }
let teclas = Object.assign(JSON.parse(JSON.stringify(TECLAS_PADRAO)), carregar("ritmo-teclas2", {}));
let opcoes = carregar("ritmo-opcoes", { downscroll: false });
let recordes = carregar("ritmo-recordes", {});
let dificuldade = carregar("ritmo-dif", 1);
if (!DIFICULDADES[dificuldade]) dificuldade = 1;

/* ---------- ESCALA: o palco SEMPRE ocupa a janela inteira (sem bordas) ---------- */
function ajustarEscala() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  palco.style.width = innerWidth / s + "px"; palco.style.height = innerHeight / s + "px";
  palco.style.setProperty("--escala", s);
  if (typeof FundoAnim !== "undefined") FundoAnim.redimensionar();
}
addEventListener("resize", ajustarEscala); ajustarEscala();
function telaCheia() {
  if (document.fullscreenElement) document.exitFullscreen();
  else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
}

/* ---------- MENUS GENÉRICOS ---------- */
let menuAtivo = null, aoVoltar = null, aoLateral = null, tela = "menu", ouvindo = null, modoAtual = "solo";

function criarMenu(el, itens, aoMudar) {
  el.innerHTML = "";
  const m = { itens, i: 0, els: [], aoMudar };
  itens.forEach((it, k) => {
    const d = document.createElement("div"); d.className = "item"; d.textContent = it.txt;
    d.onmouseenter = () => selecionar(m, k);
    d.onclick = () => { selecionar(m, k); it.fn(); };
    el.appendChild(d); m.els.push(d);
  });
  selecionar(m, 0); return m;
}
function selecionar(m, k) { m.i = k; m.els.forEach((d, j) => d.classList.toggle("sel", j === k)); if (m.aoMudar) m.aoMudar(k); }
function irPara(nome, menu, voltar, lateral) {
  tela = nome; menuAtivo = menu || null; aoVoltar = voltar || null; aoLateral = lateral || null;
  telas.forEach((t) => $("tela-" + t).classList.toggle("escondido", t !== nome));
}

/* ---------- MENU PRINCIPAL ---------- */
function abrirMenu() {
  const m = criarMenu($("menu-principal"), [
    { txt: "Jogar", fn: () => abrirSemanas("solo") },
    { txt: "Multiplayer", fn: () => abrirSemanas("multi") },
    { txt: "Options", fn: abrirOptions },
    { txt: "Tela cheia", fn: telaCheia }
  ]);
  irPara("menu", m, null);
}

/* ---------- SEMANAS (estilo FNF) ---------- */
function abrirSemanas(modo) {
  modoAtual = modo || modoAtual;
  const itens = SEMANAS.map((s, i) => ({ txt: "SEMANA " + (i + 1), fn: () => iniciarSemana(i, 0) }));
  const m = criarMenu($("lista-semanas"), itens, atualizarSemana);
  irPara("semanas", m, abrirMenu, mudarDificuldade);
  $("dif-esq").onclick = () => mudarDificuldade(-1);
  $("dif-dir").onclick = () => mudarDificuldade(1);
  atualizarSemana(m.i);
}
function mudarDificuldade(d) {
  dificuldade = (dificuldade + d + DIFICULDADES.length) % DIFICULDADES.length;
  salvar("ritmo-dif", dificuldade); atualizarDif();
}
function atualizarDif() {
  const d = DIFICULDADES[dificuldade];
  $("dif-nome").textContent = d.nome; $("dif-nome").style.color = d.cor;
}
function atualizarSemana(i) {
  const s = SEMANAS[i];
  $("sem-faixa-cor").style.setProperty("--cor", s.cor);
  $("sem-faixa-cor").style.background = s.cor;
  $("sem-score").textContent = modoAtual === "multi" ? "MULTIPLAYER" : "PONTUAÇÃO DA SEMANA: " + (recordes[s.id] || 0);
  $("sem-titulo-topo").textContent = s.nome.toUpperCase();
  $("sem-faixas").innerHTML = "<b>FAIXAS</b>" + s.faixas.map((f) => f.nome.toUpperCase()).join("<br>");
  definirPose($("sc-opp"), s.id, "Idle", s.nome, s.cor);
  definirPose($("sc-jog"), JOGADOR, "Idle", "Você", "#2ecc71");
  if (s.extra) definirPose($("sc-extra"), s.extra, "Idle", "", "#888"); else $("sc-extra").style.display = "none";
  atualizarDif();
}

/* ---------- OPTIONS ---------- */
let setEdit = "solo";
function nomeTecla(t) {
  if (!t) return "—";
  const mapa = { arrowleft: "←", arrowright: "→", arrowup: "↑", arrowdown: "↓", " ": "Espaço" };
  return mapa[t] || t.toUpperCase();
}
function abrirOptions() {
  const box = $("opt-teclas"); box.innerHTML = "";
  LANES.forEach((l, i) => {
    const linha = document.createElement("div"); linha.className = "opt-linha";
    linha.innerHTML = `<span class="rot">${l.glifo} ${cap(l.nome)}</span>`;
    [0, 1].forEach((slot) => {
      const b = document.createElement("button"); b.textContent = nomeTecla(teclas[setEdit][i][slot]);
      b.onclick = () => { ouvindo = { i, slot }; b.textContent = "Pressione..."; b.classList.add("ouvindo"); };
      linha.appendChild(b);
    });
    box.appendChild(linha);
  });
  const ex = $("opt-extras"); ex.innerHTML = "";
  const mk = (txt, fn) => { const b = document.createElement("button"); b.className = "opt-btn"; b.textContent = txt; b.onclick = fn; ex.appendChild(b); return b; };
  mk("Editando: " + NOMES_SET[setEdit], () => { const ks = Object.keys(NOMES_SET); setEdit = ks[(ks.indexOf(setEdit) + 1) % ks.length]; abrirOptions(); });
  const rotDown = () => "Downscroll: " + (opcoes.downscroll ? "ligado" : "desligado");
  const bd = mk(rotDown(), () => { opcoes.downscroll = !opcoes.downscroll; salvar("ritmo-opcoes", opcoes); bd.textContent = rotDown(); });
  mk("Restaurar teclas", () => { teclas = JSON.parse(JSON.stringify(TECLAS_PADRAO)); salvar("ritmo-teclas2", teclas); abrirOptions(); });
  mk("Voltar", abrirMenu);
  irPara("options", null, abrirMenu);
}
function definirTecla(key) {
  const { i, slot } = ouvindo, set = teclas[setEdit];
  set.forEach((par, li) => par.forEach((t, s) => { if (t === key) set[li][s] = null; }));   // tira de onde já estava (no mesmo conjunto)
  set[i][slot] = key; salvar("ritmo-teclas2", teclas);
  ouvindo = null; abrirOptions();
}

/* ---------- SPRITES (recorte automático + placeholders) ----------
   Os PNGs têm muito espaço vazio em volta do personagem. O jogo mede a área realmente
   desenhada (união das 5 poses) e escala só essa área, então o personagem fica grande
   e proporcional à tela. Se o navegador bloquear a leitura dos pixels (abrindo o arquivo
   direto, sem servidor), usa os recortes manuais abaixo (em pixels do PNG). */
const RECORTES_MANUAIS = { makoto: { x: 270, y: 29, w: 166, h: 319 } };
const RECORTE = {}, PREP = {};
function prepararPersonagem(id) {
  if (PREP[id]) return PREP[id];
  const poses = ["Idle", "Left", "Down", "Up", "Right"];
  PREP[id] = Promise.all(poses.map((p) => new Promise((ok) => {
    const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = `characters/${p}_${id}.png`;
  }))).then((ims) => {
    const ok = ims.filter(Boolean);
    if (!ok.length) return null;
    try {
      let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
      ok.forEach((im) => {
        const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const cx = c.getContext("2d"); cx.drawImage(im, 0, 0);
        const d = cx.getImageData(0, 0, c.width, c.height).data;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
          if (d[(y * c.width + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
      });
      if (x1 <= x0 || y1 <= y0) throw new Error("vazio");
      RECORTE[id] = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    } catch (e) { RECORTE[id] = RECORTES_MANUAIS[id] || null; }
    return RECORTE[id];
  });
  return PREP[id];
}
function layoutSprite(el, id) {
  const img = el.querySelector("img"), altura = +el.dataset.altura || 400;
  el.style.height = altura + "px";
  if (el.classList.contains("sem-sprite")) { el.style.width = altura * 0.5 + "px"; el.style.height = altura * 0.7 + "px"; return; }
  const nw = img.naturalWidth || 704, nh = img.naturalHeight || 384;
  const c = RECORTE[id] || { x: 0, y: 0, w: nw, h: nh }, s = altura / c.h;
  el.style.width = c.w * s + "px";
  img.style.width = nw * s + "px"; img.style.height = nh * s + "px";
  img.style.left = -c.x * s + "px"; img.style.top = -c.y * s + "px";
}
function definirPose(el, id, pose, nome, cor) {
  const img = el.querySelector("img");
  el.dataset.id = id; el.style.display = ""; el.style.setProperty("--cor", cor || "#888");
  el.querySelector("span").textContent = nome;
  img.onerror = () => { el.classList.add("sem-sprite"); layoutSprite(el, id); };
  img.onload = () => { el.classList.remove("sem-sprite"); layoutSprite(el, id); };
  img.src = `characters/${pose}_${id}.png`;
  prepararPersonagem(id).then(() => layoutSprite(el, el.dataset.id));
  layoutSprite(el, id);
}

function definirIcone(el, id, estado, emoji) {
  const chave = id + "_" + estado;
  if (el.dataset.chave === chave) return;
  el.dataset.chave = chave; el.dataset.fb = "";
  const img = el.querySelector("img");
  el.querySelector("span").textContent = emoji;
  img.onerror = () => {
    if (estado !== "normal" && !el.dataset.fb) { el.dataset.fb = "1"; img.src = `icons/${id}_normal.png`; }
    else el.classList.add("sem-icone");
  };
  img.onload = () => el.classList.remove("sem-icone");
  img.src = `icons/${id}_${estado}.png`;
}

/* ---------- SOM DE TESTE (quando ainda não há mp3) ---------- */
let audioCtx = null;
function bip(freq, dur = 0.1, vol = 0.08, tipo = "triangle") {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = tipo; o.frequency.value = freq; g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}

/* ---------- IMAGENS DAS SETAS ---------- */
const imgAlvo = {}, imgNota = {};
LANES.forEach((l) => {
  imgAlvo[l.nome] = new Image(); imgAlvo[l.nome].src = `Arrows_fnf/Arrow${cap(l.nome)}.png`;
  imgNota[l.nome] = new Image(); imgNota[l.nome].src = `Arrows_fnf/Arrow${cap(l.nome)}C.png`;
});

/* ---------- CHART (a dificuldade acelera/desacelera tudo) ---------- */
function montarChart(f, mult, njog) {
  const passo = 60 / (f.bpm * mult) / 2, notas = [];
  [...f.padroes, ...f.padroes, ...f.padroes].forEach((txt, c) => {
    const quem = c % 2 === 0 ? "opp" : "jog";
    [...txt].forEach((ch, i) => {
      const lane = "dfjk".indexOf(ch);
      if (lane >= 0) notas.push({ t: f.offset / mult + (c * 8 + i) * passo, lane, quem, tocada: false,
        f: new Array(njog).fill(false), p: new Array(njog).fill(false) });
    });
  });
  return notas;
}

/* ---------- PARTIDA ---------- */
let P = null;
const tamNota = () => (modoAtual === "multi" ? 130 : 170);
const larguraLane = () => (modoAtual === "multi" ? 135 : 172);
const yAlvo = () => (opcoes.downscroll ? H - tamNota() - MARGEM : MARGEM);
const podeJogar = (n, pi) => modoAtual === "multi" || n.quem === "jog";

function novoJogador(x0, set, spriteEl, spriteId, nome, cor, base) {
  return { x0, teclas: set, spriteEl, spriteId, nome, cor, pressionada: [false, false, false, false], pontos: base || 0,
    combo: 0, maxCombo: 0, acertos: 0, total: 0, sick: 0, good: 0, bad: 0, erros: 0, poseT: 0 };
}

function iniciarSemana(si, fi, base) {
  if (P && P.raf) cancelAnimationFrame(P.raf);
  const s = SEMANAS[si], f = s.faixas[fi], mult = DIFICULDADES[dificuldade].mult, multi = modoAtual === "multi";
  base = base || [0, 0];
  const lw = larguraLane();
  const jogs = multi
    ? [novoJogador(30, teclas.p1, $("sprite-opp"), s.id, s.nome, s.cor, base[0]), novoJogador(W - 30 - 4 * lw, teclas.p2, $("sprite-jog"), JOGADOR, "Você", "#2ecc71", base[1])]
    : [novoJogador((W - 4 * lw) / 2, teclas.solo, $("sprite-jog"), JOGADOR, "Você", "#2ecc71", base[0])];
  P = { si, fi, s, f, mult, multi, jogs, base, notas: montarChart(f, mult, jogs.length), vida: 0.5,
    textos: [], efeitos: [], inicio: performance.now(), audio: null, audioRodando: false, ultimoBeat: -1,
    poseOpp: 0, fim: false, pausado: false, pausaT: 0 };
  jogs.forEach((j, pi) => { j.total = P.notas.filter((n) => podeJogar(n, pi)).length; });
  if (f.audio) { P.audio = new Audio(f.audio); P.audio.playbackRate = mult; P.audio.onerror = () => { P.audio = null; }; }
  palco.classList.toggle("down", opcoes.downscroll);
  $("area-jogo").classList.toggle("multi", multi);
  $("vida-wrap").style.setProperty("--cor-opp", s.cor);
  $("vida-wrap").style.setProperty("--cor-jog", "#2ecc71");
  $("nome-faixa").textContent = `Semana ${si + 1} · ${f.nome} (${fi + 1}/${s.faixas.length}) · ${DIFICULDADES[dificuldade].nome}`;
  $("sprite-opp").dataset.altura = $("sprite-jog").dataset.altura = multi ? 400 : 480;
  definirPose($("sprite-jog"), JOGADOR, "Idle", "Você", "#2ecc71");
  definirPose($("sprite-opp"), s.id, "Idle", s.nome, s.cor);
  delete $("icone-jog").dataset.chave; delete $("icone-opp").dataset.chave;
  atualizarHUD();
  irPara("jogo", null, pausar);
  FundoAnim.iniciar(s.fundo);
  P.raf = requestAnimationFrame(loop);
}

function tempoMusica() {
  if (P.audio && P.audioRodando) return P.audio.currentTime;
  return (performance.now() - P.inicio) / 1000 - CONTAGEM;
}

function loop() {
  if (!P || P.fim || P.pausado) return;
  const t = tempoMusica();
  const falta = Math.ceil(-t);
  $("aviso").textContent = t < 0 ? (falta > 0 ? falta : "") : (t < 0.6 ? "Vai!" : "");
  if (P.audio && !P.audioRodando && t >= 0) P.audio.play().then(() => { P.audioRodando = true; }).catch(() => { P.audio = null; });

  const beat = Math.floor(t / (60 / (P.f.bpm * P.mult)));
  if (t >= 0 && beat !== P.ultimoBeat) {
    P.ultimoBeat = beat;
    if (!P.audio) bip(beat % 4 === 0 ? 880 : 660, 0.04, 0.03, "square");
    ["icone-jog", "icone-opp"].forEach((id) => { const e = $(id); e.classList.add("bump"); setTimeout(() => e.classList.remove("bump"), 110); });
  }

  P.notas.forEach((n) => {
    // solo: o oponente "canta" sozinho
    if (!P.multi && n.quem === "opp" && !n.tocada && t >= n.t) {
      n.tocada = true; if (!P.audio) bip(LANES[n.lane].freq, 0.15, 0.06, "sawtooth");
      definirPose($("sprite-opp"), P.s.id, cap(LANES[n.lane].nome), P.s.nome, P.s.cor);
      $("sprite-opp").classList.add("cantando"); P.poseOpp = performance.now() + 250;
    }
    P.jogs.forEach((j, pi) => {
      if (podeJogar(n, pi) && !n.f[pi] && !n.p[pi] && t - n.t > JANELAS.bad) { n.p[pi] = true; errar(pi); }
    });
  });
  if (P.fim) return;

  const agora = performance.now();
  if (!P.multi && P.poseOpp && agora > P.poseOpp) { P.poseOpp = 0; $("sprite-opp").classList.remove("cantando"); definirPose($("sprite-opp"), P.s.id, "Idle", P.s.nome, P.s.cor); }
  P.jogs.forEach((j) => { if (j.poseT && agora > j.poseT && !j.pressionada.some(Boolean)) { j.poseT = 0; definirPose(j.spriteEl, j.spriteId, "Idle", j.nome, j.cor); } });

  FundoAnim.quadro();
  desenhar(t);
  if (t > P.notas[P.notas.length - 1].t + 1.5) return terminar(true);
  P.raf = requestAnimationFrame(loop);
}

/* ---------- DESENHO ---------- */
function desenhar(t) {
  ctx.clearRect(0, 0, W, H);
  const tam = tamNota(), lw = larguraLane(), ya = yAlvo(), dir = opcoes.downscroll ? -1 : 1, vel = (H / TEMPO_QUEDA) * P.mult;
  const agora = performance.now();
  P.jogs.forEach((j, pi) => {
    // alvos (brilham quando pressionados)
    LANES.forEach((l, i) => {
      const press = j.pressionada[i], tm = tam * (press ? 1.12 : 1);
      ctx.globalAlpha = press ? 1 : 0.6;
      if (press) { ctx.shadowColor = l.cor; ctx.shadowBlur = 35; }
      ctx.drawImage(imgAlvo[l.nome], j.x0 + i * lw + (lw - tm) / 2, ya + (tam - tm) / 2, tm, tm);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
    // notas
    P.notas.forEach((n) => {
      if (!podeJogar(n, pi) || n.f[pi] || n.p[pi]) return;
      const y = ya + dir * (n.t - t) * vel;
      if (y < -tam || y > H) return;
      ctx.shadowColor = LANES[n.lane].cor; ctx.shadowBlur = 14;
      ctx.drawImage(imgNota[LANES[n.lane].nome], j.x0 + n.lane * lw + (lw - tam) / 2, y, tam, tam);
      ctx.shadowBlur = 0;
    });
  });
  // anéis de acerto
  P.efeitos = P.efeitos.filter((e) => agora - e.t0 < 320);
  P.efeitos.forEach((e) => {
    const k = (agora - e.t0) / 320, j = P.jogs[e.pi];
    ctx.globalAlpha = 1 - k; ctx.strokeStyle = LANES[e.lane].cor; ctx.lineWidth = 8 * (1 - k) + 2;
    ctx.beginPath(); ctx.arc(j.x0 + e.lane * lw + lw / 2, ya + tam / 2, tam * (0.45 + 0.5 * k), 0, Math.PI * 2); ctx.stroke();
  });
  // textos de feedback (Sick!!, Good...)
  P.textos = P.textos.filter((x) => agora - x.t0 < 600);
  P.textos.forEach((x) => {
    const k = (agora - x.t0) / 600, j = P.jogs[x.pi], base = opcoes.downscroll ? 250 : 470;
    ctx.globalAlpha = 1 - k; ctx.fillStyle = x.cor; ctx.strokeStyle = "#000"; ctx.lineWidth = 7; ctx.lineJoin = "round";
    ctx.font = "900 52px 'VCR OSD Mono', 'Arial Black', Impact, sans-serif"; ctx.textAlign = "center";
    const cx = j.x0 + 2 * lw, cy = base - k * 40;
    ctx.strokeText(x.txt, cx, cy); ctx.fillText(x.txt, cx, cy);
  });
  ctx.globalAlpha = 1;
}

/* ---------- ENTRADA ---------- */
function apertar(pi, i) {
  const j = P && P.jogs[pi];
  if (!j || P.fim || P.pausado || j.pressionada[i]) return;
  j.pressionada[i] = true;
  definirPose(j.spriteEl, j.spriteId, cap(LANES[i].nome), j.nome, j.cor); j.poseT = performance.now() + 250;
  const t = tempoMusica();
  let alvo = null, menor = Infinity;
  P.notas.forEach((n) => {
    if (!podeJogar(n, pi) || n.lane !== i || n.f[pi] || n.p[pi]) return;
    const d = Math.abs(t - n.t); if (d < menor) { menor = d; alvo = n; }
  });
  if (alvo && menor <= JANELAS.bad) {
    alvo.f[pi] = true;
    if (menor <= JANELAS.sick) acertar(pi, i, "Sick!!", "#00e5ff", 350, 0.04, "sick");
    else if (menor <= JANELAS.good) acertar(pi, i, "Good", "#7dff7d", 200, 0.02, "good");
    else acertar(pi, i, "Bad", "#ffb347", 50, -0.01, "bad");
    if (!P.audio && !P.multi) bip(LANES[i].freq, 0.12, 0.08);
  }
}
const soltar = (pi, i) => { if (P && P.jogs[pi]) P.jogs[pi].pressionada[i] = false; };
function acharTecla(k) {
  if (!P) return null;
  for (let pi = 0; pi < P.jogs.length; pi++) { const l = P.jogs[pi].teclas.findIndex((par) => par.includes(k)); if (l >= 0) return { pi, l }; }
  return null;
}

addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (ouvindo) {
    e.preventDefault();
    if (k === "escape") { ouvindo = null; abrirOptions(); } else definirTecla(k);
    return;
  }
  if (tela === "jogo") {
    if (k === "escape") { e.preventDefault(); return pausar(); }
    if (e.repeat) return;
    const a = acharTecla(k); if (a) { e.preventDefault(); apertar(a.pi, a.l); }
    return;
  }
  if (menuAtivo) {
    const m = menuAtivo;
    if (k === "arrowdown") { e.preventDefault(); selecionar(m, (m.i + 1) % m.itens.length); }
    else if (k === "arrowup") { e.preventDefault(); selecionar(m, (m.i - 1 + m.itens.length) % m.itens.length); }
    else if (k === "enter") { e.preventDefault(); m.itens[m.i].fn(); }
  }
  if (aoLateral && k === "arrowleft") aoLateral(-1);
  if (aoLateral && k === "arrowright") aoLateral(1);
  if (k === "escape" && aoVoltar) aoVoltar();
});
addEventListener("keyup", (e) => { const a = acharTecla(e.key.toLowerCase()); if (a) soltar(a.pi, a.l); });

canvas.addEventListener("pointerdown", (e) => {            // toque / mouse
  if (!P || tela !== "jogo") return;
  const r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, lw = larguraLane();
  P.jogs.forEach((j, pi) => { const i = Math.floor((x - j.x0) / lw); if (i >= 0 && i < 4) apertar(pi, i); });
});
addEventListener("pointerup", () => { if (P) P.jogs.forEach((j) => j.pressionada.fill(false)); });

/* ---------- PAUSA ---------- */
function pausar() {
  if (!P || P.fim || P.pausado) return;
  P.pausado = true; P.pausaT = performance.now(); cancelAnimationFrame(P.raf);
  if (P.audio) P.audio.pause();
  $("pausa").classList.remove("escondido");
  const m = criarMenu($("menu-pausa"), [
    { txt: "Continuar", fn: retomar },
    { txt: "Reiniciar faixa", fn: () => { $("pausa").classList.add("escondido"); iniciarSemana(P.si, P.fi, P.base); } },
    { txt: "Sair", fn: () => { P.fim = true; FundoAnim.parar(); if (P.audio) P.audio.pause(); $("pausa").classList.add("escondido"); abrirSemanas(); } }
  ]);
  menuAtivo = m; tela = "pausa"; aoVoltar = retomar;
}
function retomar() {
  $("pausa").classList.add("escondido");
  P.inicio += performance.now() - P.pausaT; P.pausado = false; FundoAnim.retomar();
  if (P.audio && P.audioRodando) P.audio.play();
  tela = "jogo"; menuAtivo = null; aoVoltar = pausar;
  P.raf = requestAnimationFrame(loop);
}

/* ---------- PONTUAÇÃO E BARRA DE VIDA ---------- */
function recalcularVida() {
  if (P.multi) P.vida = clamp(0.5 + (P.jogs[1].pontos - P.jogs[0].pontos) / 3000, 0.02, 0.98);   // cabo de guerra pela pontuação
}
function acertar(pi, lane, txt, cor, pts, vida, tipo) {
  const j = P.jogs[pi];
  j[tipo]++; j.acertos += tipo === "bad" ? 0.5 : 1; j.combo++; j.maxCombo = Math.max(j.maxCombo, j.combo);
  j.pontos += pts + j.combo * 2;
  if (!P.multi) P.vida = Math.min(1, P.vida + vida); else recalcularVida();
  P.textos.push({ pi, txt, cor, t0: performance.now() }); P.efeitos.push({ pi, lane, t0: performance.now() });
  atualizarHUD();
}
function errar(pi) {
  const j = P.jogs[pi]; j.erros++; j.combo = 0;
  P.textos.push({ pi, txt: "Errou!", cor: "#ff5555", t0: performance.now() });
  if (!P.multi) { P.vida = Math.max(0, P.vida - 0.06); atualizarHUD(); if (P.vida <= 0) terminar(false); }
  else atualizarHUD();
}
const precisao = (j) => { const n = j.sick + j.good + j.bad + j.erros; return n ? Math.round(j.acertos / n * 100) : 100; };
function atualizarHUD() {
  // acertar → divisória vai para a ESQUERDA (lado do oponente), errar → para a direita
  const div = (1 - P.vida) * BARRA_W;
  $("vida-jog").style.width = P.vida * 100 + "%";
  $("icone-jog").style.left = div - 20 + "px";
  $("icone-opp").style.left = div - ICONE_W + 20 + "px";
  const baixa = P.vida < 0.2, alta = P.vida > 0.8;
  definirIcone($("icone-jog"), "jogador", baixa ? "derrota" : alta ? "vitoria" : "normal", baixa ? "😵" : alta ? "😄" : "🙂");
  definirIcone($("icone-opp"), P.s.id, baixa ? "vitoria" : alta ? "derrota" : "normal", baixa ? "😎" : alta ? "😫" : "🙂");
  if (P.multi) {
    const [a, b] = P.jogs;
    $("placar").textContent = `J1: ${a.pontos} (combo ${a.combo})   ✦   J2: ${b.pontos} (combo ${b.combo})`;
  } else {
    const j = P.jogs[0];
    $("placar").textContent = `Score: ${j.pontos} | Erros: ${j.erros} | Combo: ${j.combo} | Precisão: ${precisao(j)}%`;
  }
}

/* ---------- FIM DA FAIXA / SEMANA ---------- */
function terminar(venceu) {
  if (P.fim) return;
  P.fim = true; cancelAnimationFrame(P.raf); if (P.audio) P.audio.pause();
  $("aviso").textContent = ""; FundoAnim.parar();
  const s = P.s, b = s.bio, cartao = $("cartao"), j = P.jogs[0];
  cartao.style.setProperty("--cor", s.cor);

  if (venceu && P.fi < s.faixas.length - 1) return iniciarSemana(P.si, P.fi + 1, P.jogs.map((x) => x.pontos));   // próxima faixa

  const bio = `${b.texto.map((p) => `<p>${p}</p>`).join("")}<p class="curio">${b.curiosidade}</p>`;
  const si = P.si, fi = P.fi, base = P.base;
  if (venceu && P.multi) {
    const [a, c] = P.jogs, vencedor = a.pontos === c.pontos ? "Empate!" : a.pontos > c.pontos ? "Jogador 1 venceu!" : "Jogador 2 venceu!";
    const caixa = (x, nome, ganhou) => `<div class="${ganhou ? "vencedor" : ""}">${nome}<b>${x.pontos}</b>Precisão ${precisao(x)}% · Maior combo ${x.maxCombo}<br>Sick ${x.sick} · Good ${x.good} · Bad ${x.bad} · Erros ${x.erros}</div>`;
    cartao.innerHTML = `<h2>${vencedor}</h2>
      <div class="placar-multi">${caixa(a, "JOGADOR 1", a.pontos > c.pontos)}${caixa(c, "JOGADOR 2", c.pontos > a.pontos)}</div>
      <h2 style="font-size:28px">${b.titulo}</h2>${bio}
      <div class="botoes"><button id="b-rep">Revanche</button><button class="sec" id="b-menu">Semanas</button></div>`;
    $("b-rep").onclick = () => iniciarSemana(si, 0);
  } else if (venceu) {
    if (j.pontos > (recordes[s.id] || 0)) { recordes[s.id] = j.pontos; salvar("ritmo-recordes", recordes); }
    cartao.innerHTML = `<h2>${b.titulo}</h2>
      <div class="stats">Semana ${si + 1} concluída · Pontos: ${j.pontos} · Maior combo na última faixa: ${j.maxCombo} · Precisão na última faixa: ${precisao(j)}%</div>
      ${bio}
      <div class="botoes"><button id="b-prox">Próxima semana</button><button class="sec" id="b-rep">Jogar de novo</button><button class="sec" id="b-menu">Semanas</button></div>`;
    $("b-prox").onclick = () => iniciarSemana((si + 1) % SEMANAS.length, 0);
    $("b-rep").onclick = () => iniciarSemana(si, 0);
  } else {
    cartao.innerHTML = `<h2>Você perdeu!</h2><div class="stats">Pontos: ${j.pontos} · Maior combo: ${j.maxCombo}</div>
      <p>Respire e tente de novo. Dica: o compasso do oponente mostra o ritmo antes da sua vez. Se estiver difícil, escolha a dificuldade FÁCIL nas semanas.</p>
      <div class="botoes"><button id="b-rep">Tentar de novo</button><button class="sec" id="b-menu">Semanas</button></div>`;
    $("b-rep").onclick = () => iniciarSemana(si, fi, base);
  }
  $("b-menu").onclick = () => abrirSemanas();
  irPara("resultado", null, () => abrirSemanas());
}

try { document.fonts.load('20px "VCR OSD Mono"').catch(() => {}); } catch (e) {}
[JOGADOR, ...SEMANAS.map((s) => s.id)].forEach(prepararPersonagem);
abrirMenu();
