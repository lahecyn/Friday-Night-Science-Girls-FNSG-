/* =====================================================================
   FUNDOS ANIMADOS DAS BATALHAS
   Cada batalha tem uma imagem em /backgrounds/ (PNG 1920x1080) e uma animação
   desenhada por cima (aviões, faíscas, TV com River Raid). Para trocar a arte,
   substitua o PNG; se mudar de lugar a cratera, a TV etc., ajuste as posições
   (em pixels do PNG) nas constantes de cada estágio.
   ===================================================================== */
const FundoAnim = (() => {
  const cv = document.getElementById("fundo-anim"), cx = cv.getContext("2d"), fundoEl = document.getElementById("fundo-jogo");
  const TAU = Math.PI * 2, OUTL = "#1d2a44";
  let PW = 1280, PH = 720, S = 1, nome = null, est = null, ultimo = 0, tempo = 0;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = (a) => a[Math.floor(Math.random() * a.length)];
  const geo = () => { const sc = Math.max(PW / 1920, PH / 1080); return { sc, ox: (PW - 1920 * sc) / 2, oy: (PH - 1080 * sc) / 2 }; };
  const P = (x, y) => { const g = geo(); return [g.ox + x * g.sc, g.oy + y * g.sc]; };      // ponto do PNG → tela

  function redimensionar() {
    S = Math.min(innerWidth / 1280, innerHeight / 720); PW = innerWidth / S; PH = innerHeight / S;
    cv.width = Math.round(innerWidth); cv.height = Math.round(innerHeight);
    cv.style.width = PW + "px"; cv.style.height = PH + "px"; cx.setTransform(S, 0, 0, S, 0, 0);
  }

  /* ---------- formas orgânicas (sem círculos nem quadrados duros) ---------- */
  function nuvemD(w, h) {       // nuvem de uma peça só, feita de arcos irregulares
    const m = 5 + Math.floor(Math.random() * 3), x0 = -w / 2, base = h * .3;
    const wts = Array.from({ length: m }, (_, i) => rnd(.8, 1.3) * (i > 0 && i < m - 1 ? 1.25 : .8)), tot = wts.reduce((a, b) => a + b);
    const xs = [x0]; wts.forEach((q) => xs.push(xs[xs.length - 1] + q / tot * w));
    const ys = [base - h * .18 * rnd(.6, 1)]; for (let k = 1; k < m; k++) ys.push(base - h * .62 * Math.sin(Math.PI * k / m) * rnd(.7, 1.05) - h * .1); ys.push(base - h * .12);
    let d = `M${xs[0]},${ys[0]}`;
    for (let i = 0; i < m; i++) { const r = Math.hypot(xs[i + 1] - xs[i], ys[i + 1] - ys[i]) / 2 * rnd(1, 1.18); d += ` A${r},${r} 0 0 1 ${xs[i + 1]},${ys[i + 1]}`; }
    return d + ` C${x0 + w * .8},${base + h * .28} ${x0 + w * .25},${base + h * .3} ${xs[0]},${ys[0]}Z`;
  }
  function suave(rgb) {         // bolinha de luz/fumaça com borda esfumada (não parece círculo)
    const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, `rgba(${rgb},1)`); g.addColorStop(.5, `rgba(${rgb},.55)`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c;
  }
  const SOFT = { branco: suave("255,255,255"), fumaca: suave("74,52,105"), cinza: suave("120,110,140"), quente: suave("255,190,90") };
  const mancha = (spr, x, y, r, a) => { cx.globalAlpha = a; cx.drawImage(spr, x - r, y - r, r * 2, r * 2); cx.globalAlpha = 1; };
  function poli(pts, fill, w = 5) {
    cx.beginPath(); pts.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.closePath();
    cx.fillStyle = fill; cx.fill(); cx.strokeStyle = OUTL; cx.lineWidth = w; cx.lineJoin = "round"; cx.stroke();
  }
  function elipse(x, y, rx, ry, fill, w = 4) { cx.beginPath(); cx.ellipse(x, y, rx, ry, 0, 0, TAU); cx.fillStyle = fill; cx.fill(); cx.strokeStyle = OUTL; cx.lineWidth = w; cx.stroke(); }
  function nuvem(p, x, y, s) {
    cx.save(); cx.translate(x, y); cx.scale(s, s);
    cx.fillStyle = "#fff"; cx.fill(p);
    cx.save(); cx.clip(p); const g = cx.createLinearGradient(0, -40, 0, 50); g.addColorStop(.35, "rgba(188,216,245,0)"); g.addColorStop(1, "rgba(150,190,235,.95)"); cx.fillStyle = g; cx.fillRect(-300, -200, 600, 400); cx.restore();
    cx.strokeStyle = OUTL; cx.lineWidth = 6 / s; cx.lineJoin = "round"; cx.stroke(p); cx.restore();
  }

  /* ---------- ESTÁGIO 1: ITA (nuvens e aviões) ---------- */
  function jato() {
    poli([[-80, -6], [-92, -44], [-58, -44], [-30, -8]], "#e8505b");
    poli([[-60, 4], [-96, 40], [-62, 40], [-8, 6]], "#c93d48");
    cx.beginPath(); cx.moveTo(-96, -10); cx.bezierCurveTo(-30, -18, 50, -18, 100, -6); cx.bezierCurveTo(116, -2, 112, 8, 96, 10); cx.bezierCurveTo(40, 16, -30, 16, -96, 12); cx.closePath();
    cx.fillStyle = "#f6f6fb"; cx.fill(); cx.strokeStyle = OUTL; cx.lineWidth = 5; cx.stroke();
    cx.save(); cx.clip(); const g = cx.createLinearGradient(0, -8, 0, 16); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(60,80,140,.4)"); cx.fillStyle = g; cx.fillRect(-120, -30, 260, 60); cx.restore();
    cx.beginPath(); cx.moveTo(14, -14); cx.bezierCurveTo(30, -28, 56, -22, 62, -8); cx.lineTo(14, -8); cx.closePath(); cx.fillStyle = "#5ec8ff"; cx.fill(); cx.stroke();
  }
  function airliner() {
    poli([[-120, -14], [-150, -64], [-108, -64], [-70, -16]], "#3a7bd5");
    poli([[-30, 6], [-86, 58], [-48, 58], [34, 8]], "#9db4d6");
    cx.beginPath(); cx.moveTo(-126, -18); cx.lineTo(92, -18); cx.bezierCurveTo(140, -16, 152, -4, 148, 4); cx.bezierCurveTo(130, 22, 100, 20, 80, 20); cx.lineTo(-126, 14); cx.closePath();
    cx.fillStyle = "#fff"; cx.fill(); cx.strokeStyle = OUTL; cx.lineWidth = 5; cx.stroke();
    cx.fillStyle = "#5ec8ff"; for (let i = 0; i < 9; i++) { cx.beginPath(); cx.ellipse(-90 + i * 20, -3, 4.5, 5.5, 0, 0, TAU); cx.fill(); }
    elipse(112, -6, 15, 6, "#5ec8ff", 3); elipse(-6, 40, 21, 9, "#6b7a99", 4);
  }
  function helice(t) {
    poli([[-52, -6], [-66, -30], [-40, -30], [-24, -8]], "#ffd23f", 4);
    elipse(0, 0, 58, 17, "#ff5a5f", 5);
    poli([[-26, 8], [-46, 30], [-8, 30], [20, 8]], "#ffd23f", 4); elipse(16, -10, 12, 7, "#5ec8ff", 3);
    cx.save(); cx.translate(58, 0); cx.rotate(t * 30); cx.strokeStyle = OUTL; cx.lineWidth = 6; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(0, -24); cx.lineTo(0, 24); cx.stroke(); cx.restore();
  }
  const ITA = {
    reset() {
      est = { paths: Array.from({ length: 6 }, () => new Path2D(nuvemD(200, 80))), nuvens: [], avioes: [], rastro: [], prox: 1.2 };
      for (let i = 0; i < 7; i++) est.nuvens.push({ p: pick(est.paths), x: rnd(0, PW), y: rnd(30, 260), s: rnd(.8, 1.5), v: rnd(6, 18) });
    },
    step(dt) {
      const g = geo();
      est.nuvens.forEach((n) => { n.x += n.v * dt; if (n.x > PW + 220) { n.x = -240; n.y = rnd(30, 260); n.p = pick(est.paths); } nuvem(n.p, n.x, g.oy + n.y * g.sc * .8, n.s * g.sc * 1.15); });
      est.prox -= dt;
      if (est.prox <= 0) {
        est.prox = rnd(5, 9);
        const tipo = pick(["jato", "jato", "airliner", "banner"]), dir = Math.random() < .5 ? 1 : -1;
        est.avioes.push({ tipo, dir, x: dir > 0 ? -400 : PW + 400, y: g.oy + rnd(70, 300) * g.sc * .9, v: { jato: 640, airliner: 300, banner: 170 }[tipo] * g.sc, e: (tipo === "airliner" ? .85 : tipo === "banner" ? .8 : 1) * g.sc * 1.1, t: 0 });
      }
      est.rastro.forEach((r) => { r.l -= dt; r.r += 22 * dt; });
      est.rastro = est.rastro.filter((r) => r.l > 0);
      est.rastro.forEach((r) => mancha(SOFT.branco, r.x, r.y, r.r * 2.4, Math.max(0, r.l / 2.2) * .75));
      est.avioes.forEach((a) => {
        a.t += dt; a.x += a.dir * a.v * dt;
        const yy = a.y + Math.sin(a.t * 1.6) * 6 * g.sc;
        if (a.tipo !== "banner") est.rastro.push({ x: a.x - a.dir * 95 * a.e, y: yy, r: 7 * a.e, l: 2.2 });
        if (a.tipo === "banner") {
          const bw = 440 * g.sc * 1.1, bh = 64 * g.sc * 1.1, bx = a.dir > 0 ? a.x - 70 * a.e - bw : a.x + 70 * a.e, by = yy - 2 + Math.sin(a.t * 5) * 3;
          cx.beginPath(); cx.moveTo(a.x - a.dir * 58 * a.e, yy); cx.lineTo(a.dir > 0 ? bx + bw : bx, by + bh / 2); cx.strokeStyle = OUTL; cx.lineWidth = 3; cx.stroke();
          cx.beginPath(); cx.moveTo(bx, by); cx.bezierCurveTo(bx + bw * .3, by - 8, bx + bw * .7, by + 8, bx + bw, by); cx.lineTo(bx + bw, by + bh); cx.bezierCurveTo(bx + bw * .7, by + bh + 8, bx + bw * .3, by + bh - 8, bx, by + bh); cx.closePath();
          cx.fillStyle = "#fff8d6"; cx.fill(); cx.strokeStyle = OUTL; cx.lineWidth = 5; cx.lineJoin = "round"; cx.stroke();
          cx.fillStyle = "#d8344a"; cx.font = `900 ${bh * .5}px 'VCR OSD Mono','Arial Black',sans-serif`; cx.textAlign = "center"; cx.textBaseline = "middle";
          cx.fillText("SNCT · MULHERES NA CIÊNCIA", bx + bw / 2, by + bh / 2);
        }
        cx.save(); cx.translate(a.x, yy); cx.scale(a.dir * a.e, a.e);
        if (a.tipo === "jato") jato(); else if (a.tipo === "airliner") airliner(); else helice(a.t);
        cx.restore();
      });
      est.avioes = est.avioes.filter((a) => (a.dir > 0 ? a.x < PW + 700 : a.x > -700));
    }
  };

  /* ---------- ESTÁGIO 2: VULCÃO (fumaça, brasas e faíscas) ---------- */
  const CRATERA = [1222, 214];
  function brasa(x, y, r, a) {
    cx.globalAlpha = a; cx.fillStyle = "#ff6a1f"; cx.beginPath(); cx.ellipse(x, y, r, r * 1.25, .4, 0, TAU); cx.fill();
    cx.fillStyle = "#ffd35a"; cx.beginPath(); cx.ellipse(x, y, r * .5, r * .65, .4, 0, TAU); cx.fill(); cx.globalAlpha = 1;
  }
  const VULCAO = {
    reset() { est = { brasas: [], fumaca: [], bombas: [], cair: [], eBr: 0, eFu: 0, eBo: 2, eCa: 0 }; },
    step(dt, t) {
      const g = geo(), [px, py] = P(CRATERA[0], CRATERA[1]), u = g.sc;
      est.eFu -= dt; if (est.eFu <= 0) { est.eFu = .16; est.fumaca.push({ x: px + rnd(-60, 60) * u, y: py - 10 * u, r: rnd(50, 80) * u, vy: -rnd(40, 80) * u, vx: rnd(-22, 4) * u, l: 7, q: Math.random() < .5 }); }
      est.fumaca.forEach((f) => { f.l -= dt; f.y += f.vy * dt; f.x += f.vx * dt; f.r += 30 * u * dt; });
      est.fumaca = est.fumaca.filter((f) => f.l > 0);
      est.fumaca.forEach((f) => { mancha(f.q ? SOFT.fumaca : SOFT.cinza, f.x, f.y, f.r * 1.4, Math.min(.5, f.l / 7 * .7)); });
      // brilho pulsante (luz que vem de baixo)
      cx.globalCompositeOperation = "lighter"; mancha(SOFT.quente, px, py, 330 * u, .38 + .16 * Math.sin(t * 3.2)); cx.globalCompositeOperation = "source-over";
      est.eBr -= dt; while (est.eBr <= 0) { est.eBr += .03; const a = -Math.PI / 2 + rnd(-.7, .7), v = rnd(260, 560) * u; est.brasas.push({ x: px + rnd(-70, 70) * u, y: py, vx: Math.cos(a) * v - 30 * u, vy: Math.sin(a) * v, r: rnd(2.5, 6) * u, l: rnd(1.4, 2.6) }); }
      est.eBo -= dt; if (est.eBo <= 0) { est.eBo = rnd(2.5, 5); const a = -Math.PI / 2 + rnd(-.9, .9), v = rnd(520, 700) * u; est.bombas.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(11, 16) * u, l: 3.2, rot: rnd(0, TAU) }); }
      est.bombas.forEach((b) => { b.l -= dt; b.vy += 430 * u * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += 3 * dt; if (Math.random() < .7) est.brasas.push({ x: b.x, y: b.y, vx: rnd(-30, 30) * u, vy: rnd(-20, 40) * u, r: b.r * .35, l: .7 }); });
      est.bombas = est.bombas.filter((b) => b.l > 0 && b.y < PH + 60);
      est.brasas.forEach((b) => { b.l -= dt; b.vy += 380 * u * dt; b.x += b.vx * dt; b.y += b.vy * dt; });
      est.brasas = est.brasas.filter((b) => b.l > 0 && b.y < PH + 20);
      est.brasas.forEach((b) => brasa(b.x, b.y, b.r, Math.min(1, b.l * 1.5)));
      est.bombas.forEach((b) => {     // pedra de lava irregular
        cx.save(); cx.translate(b.x, b.y); cx.rotate(b.rot); cx.beginPath();
        for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = b.r * (.8 + .35 * Math.sin(i * 2.3 + 1)); i ? cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : cx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        cx.closePath(); cx.fillStyle = "#ff7a22"; cx.fill(); cx.strokeStyle = "#2a0d1c"; cx.lineWidth = 4; cx.lineJoin = "round"; cx.stroke();
        cx.fillStyle = "#ffd35a"; cx.beginPath(); cx.ellipse(-b.r * .2, -b.r * .2, b.r * .4, b.r * .3, .5, 0, TAU); cx.fill(); cx.restore();
      });
      est.eCa -= dt; while (est.eCa <= 0) { est.eCa += .05; est.cair.push({ x: rnd(0, PW + 200), y: -20, vx: -rnd(30, 90) * u, vy: rnd(70, 170) * u, r: rnd(2, 5) * u, f: rnd(0, TAU), cinza: Math.random() < .3 }); }
      est.cair.forEach((c) => { c.x += c.vx * dt + Math.sin(t * 2 + c.f) * 14 * dt; c.y += c.vy * dt; });
      est.cair = est.cair.filter((c) => c.y < PH + 20 && c.x > -30);
      est.cair.forEach((c) => { if (c.cinza) mancha(SOFT.cinza, c.x, c.y, c.r * 2, .5); else brasa(c.x, c.y, c.r, .55 + .45 * Math.sin(t * 9 + c.f)); });
    }
  };

  /* ---------- ESTÁGIO 3: SALA DE JOGOS (River Raid rodando na TV) ---------- */
  const TV = { x: 655, y: 345, w: 450, h: 300, r: 54 };            // tela de vidro no PNG
  const NEON = [960, 150], FLIPERES = [[495, 538, "51,214,255"], [1440, 544, "255,210,63"]];
  const VW = 150, VH = 100;                                         // resolução "Atari" da TV
  const SPR = {
    jato: ["....Y....", "...YYY...", "...YYY...", "..YYYYY..", "YYYYYYYYY", "YY.YYY.YY", "...Y.Y..."],
    navio: ["...GG....", "..GGGG...", "GGGGGGGGG", "GGRRRRGGG", ".GGGGGGG."],
    tanque: ["RRWWRRWW", "WWRRWWRR", "RRWWRRWW", "WWRRWWRR"],
    heli: [".....K....", "..OOOOO...", "OOOOOOOOK.", "..OOOOO...", "....K....."]
  };
  const PAL = { Y: "#ffe14d", G: "#9aa3b8", R: "#e23c3c", W: "#f4f4f4", O: "#ff8a3d", K: "#2a2a3a" };
  function sprite(rows, x, y) { rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") { cx.fillStyle = PAL[ch]; cx.fillRect(Math.round(x) + i, Math.round(y) + j, 1, 1); } })); }
  const rcx = (y) => 75 + 20 * Math.sin(y / 16) + 8 * Math.sin(y / 6.5 + 1), rwd = (y) => 48 + 9 * Math.sin(y / 10);
  function caminhoTela(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.lineTo(x + w - r, y); cx.quadraticCurveTo(x + w, y, x + w, y + r); cx.lineTo(x + w, y + h - r); cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); cx.lineTo(x + r, y + h); cx.quadraticCurveTo(x, y + h, x, y + h - r); cx.lineTo(x, y + r); cx.quadraticCurveTo(x, y, x + r, y); cx.closePath(); }
  const TVJOGO = {
    reset() { est = { scroll: 0, ents: [], balas: [], expl: [], pops: [], prox: 1.0, jx: 75, alvo: null, pontos: 0, fuel: 1, falha: 0, motas: Array.from({ length: 36 }, () => ({ x: rnd(500, 1420), y: rnd(300, 1000), v: rnd(6, 18), f: rnd(0, TAU), r: rnd(1.5, 3.5) })) }; },
    step(dt, t) {
      const g = geo(), u = g.sc;
      const [sx, sy] = P(TV.x, TV.y), sw = TV.w * u, sh = TV.h * u, k = sw / VW;
      est.falha -= dt; if (est.falha <= 0 && Math.random() < dt * .25) est.falha = .18;            // neon falhando de vez em quando
      const neonA = est.falha > 0 ? .04 : .30 + .06 * Math.sin(t * 6);
      cx.globalCompositeOperation = "lighter";
      const [nx, ny] = P(NEON[0], NEON[1]); cx.save(); cx.translate(nx, ny); cx.scale(2.6, .6); mancha(suaveAzul, 0, 0, 300 * u, neonA); cx.restore();
      FLIPERES.forEach(([fx, fy, rgb], i) => { const [px, py] = P(fx, fy); mancha(suaveCor(rgb), px, py, 150 * u, .22 + .12 * Math.sin(t * 5 + i * 2)); });
      mancha(suaveAzul, sx + sw / 2, sy + sh / 2, sw * 1.05, .20 + .05 * Math.sin(t * 17));
      const [lx, ly] = P(900, 940); cx.save(); cx.translate(lx, ly); cx.scale(2.4, .5); mancha(suaveAzul, 0, 0, 330 * u, .22 + .05 * Math.sin(t * 17)); cx.restore();
      cx.globalCompositeOperation = "source-over";
      // ----- jogo dentro do tubo
      cx.save(); caminhoTela(sx, sy, sw, sh, TV.r * u); cx.clip(); cx.translate(sx, sy); cx.scale(k, k);
      est.scroll += 18 * dt; const sc = est.scroll;
      cx.fillStyle = "#3fa83a"; cx.fillRect(0, 0, VW, VH);
      for (let y = 0; y < VH - 10; y += 2) {
        const wy = y - sc, c = rcx(wy), w = rwd(wy), xl = Math.round((c - w / 2) / 2) * 2, xr = Math.round((c + w / 2) / 2) * 2;
        cx.fillStyle = "#2f8a2c"; cx.fillRect(xl - 3, y, 3, 2); cx.fillRect(xr, y, 3, 2);
        cx.fillStyle = "#2e6ee0"; cx.fillRect(xl, y, xr - xl, 2);
        if (Math.floor(wy / 6) % 7 === 0) { cx.fillStyle = "#58a0ff"; cx.fillRect(xl + 6 + (Math.floor(wy) % 9) * 3, y, 3, 1); }
        if (Math.floor(wy / 4) % 9 === 0) { cx.fillStyle = "#2a7a26"; cx.fillRect(xl - 14 - (Math.floor(wy) % 5) * 3, y, 4, 2); cx.fillRect(xr + 10 + (Math.floor(wy) % 7) * 3, y, 4, 2); }
      }
      const ponte = ((sc % 130) + 130) % 130 - 6;                                     // ponte passando
      cx.fillStyle = "#8e93a8"; cx.fillRect(0, ponte, VW, 6); cx.fillStyle = "#ffe14d"; cx.fillRect(0, ponte + 2, VW, 1);
      // novo alvo
      est.prox -= dt;
      if (est.prox <= 0 && !est.alvo) {
        est.prox = rnd(1.4, 2.4);
        const tipo = pick(["heli", "heli", "navio", "tanque"]), c = rcx(-8 - sc);
        est.alvo = { tipo, x: c + rnd(-8, 8), y: -8, pts: { heli: 60, navio: 30, tanque: 80 }[tipo], viva: true }; est.ents.push(est.alvo);
      }
      est.ents.forEach((e) => { e.y += 18 * dt * (e.tipo === "heli" ? 1.2 : 1); if (e.tipo === "heli") e.x += Math.sin(t * 2 + e.y) * 6 * dt; });
      est.ents = est.ents.filter((e) => e.y < VH && e.viva); if (est.alvo && !est.ents.includes(est.alvo)) est.alvo = null;
      est.ents.forEach((e) => { const rows = SPR[e.tipo]; sprite(rows, e.x - rows[0].length / 2, e.y); if (e.tipo === "heli") { cx.fillStyle = "#2a2a3a"; const a = Math.floor(t * 20) % 2; cx.fillRect(Math.round(e.x) - 5 + a, Math.round(e.y), 10 - a * 2, 1); } });
      // jato do "jogador" (pilotado pela TV)
      const al = est.alvo; if (al) est.jx += (al.x - est.jx) * Math.min(1, 3 * dt); else est.jx += Math.sin(t) * 10 * dt;
      est.cd = (est.cd || 0) - dt;
      if (al && Math.abs(al.x - est.jx) < 3 && est.cd <= 0 && al.y > 8) { est.cd = .35; est.balas.push({ x: est.jx, y: 76 }); }
      est.balas.forEach((b) => { b.y -= 90 * dt; const a = est.alvo; if (a && a.viva && Math.abs(b.x - a.x) < 5 && Math.abs(b.y - (a.y + 2)) < 4) { a.viva = false; b.y = -99; est.pontos += a.pts; if (a.tipo === "tanque") est.fuel = Math.min(1, est.fuel + .4); est.expl.push({ x: a.x, y: a.y + 2, t: 0 }); est.pops.push({ x: a.x, y: a.y, t: 0, txt: "+" + a.pts }); } });
      est.balas = est.balas.filter((b) => b.y > -5);
      est.balas.forEach((b) => { cx.fillStyle = "#fff"; cx.fillRect(Math.round(b.x), Math.round(b.y), 1, 3); });
      sprite(SPR.jato, est.jx - 4.5, 80);
      est.expl.forEach((e) => { e.t += dt; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, d = e.t * 36; cx.fillStyle = ["#fff", "#ffe14d", "#ff8a3d", "#e23c3c"][(i + Math.floor(e.t * 12)) % 4]; cx.fillRect(Math.round(e.x + Math.cos(a) * d), Math.round(e.y + Math.sin(a) * d), 2, 2); } }); est.expl = est.expl.filter((e) => e.t < .5);
      est.pops.forEach((p) => { p.t += dt; p.y += 8 * dt; cx.fillStyle = "#ffe14d"; cx.font = "7px monospace"; cx.textAlign = "center"; cx.fillText(p.txt, p.x, p.y - 4); }); est.pops = est.pops.filter((p) => p.t < 1);
      // barra de status
      est.fuel -= .02 * dt; if (est.fuel < .1) est.fuel = .6;
      cx.fillStyle = "#4a4a58"; cx.fillRect(0, 90, VW, 10);
      cx.fillStyle = "#ffe14d"; cx.font = "8px 'VCR OSD Mono', monospace"; cx.textAlign = "left"; cx.textBaseline = "alphabetic"; cx.fillText(String(est.pontos).padStart(6, "0"), 6, 98);
      cx.fillStyle = "#222"; cx.fillRect(90, 93, 52, 4); cx.fillStyle = est.fuel > .3 ? "#7cff8a" : "#ff5a5a"; cx.fillRect(90, 93, 52 * est.fuel, 4);
      cx.restore();
      // efeitos de tubo: linhas de varredura, bordas escuras, brilho
      cx.save(); caminhoTela(sx, sy, sw, sh, TV.r * u); cx.clip();
      cx.fillStyle = "rgba(0,0,0,.20)"; for (let y = sy; y < sy + sh; y += 3.2) cx.fillRect(sx, y, sw, 1.4);
      const vg = cx.createRadialGradient(sx + sw / 2, sy + sh / 2, sh * .25, sx + sw / 2, sy + sh / 2, sw * .62); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,10,20,.55)"); cx.fillStyle = vg; cx.fillRect(sx, sy, sw, sh);
      cx.fillStyle = `rgba(255,255,255,${.04 + .03 * Math.random()})`; cx.fillRect(sx, sy, sw, sh);
      cx.restore();
      // poeira flutuando na luz da TV
      est.motas.forEach((m) => { m.y -= m.v * dt; m.x += Math.sin(t + m.f) * 8 * dt; if (m.y < 280) { m.y = 1000; m.x = rnd(500, 1420); } const [mx, my] = P(m.x, m.y); mancha(SOFT.quente, mx, my, m.r * u * 3, .35 + .25 * Math.sin(t * 2 + m.f)); });
    }
  };
  const suaveAzul = suave("80,170,255"), suaveCor = (() => { const c = {}; return (rgb) => c[rgb] || (c[rgb] = suave(rgb)); })();

  const ESTAGIOS = { ita: ITA, vulcao: VULCAO, tv: TVJOGO };

  function iniciar(cfg) {
    nome = cfg && cfg.animacao;
    fundoEl.style.backgroundImage = cfg && cfg.imagem ? `url("${cfg.imagem}")` : "none";
    fundoEl.style.backgroundPosition = "center"; fundoEl.style.backgroundRepeat = "no-repeat"; fundoEl.style.backgroundSize = "cover";
    fundoEl.classList.toggle("sem-fundo", !(cfg && cfg.imagem));
    redimensionar(); tempo = 0; ultimo = performance.now();
    est = null; if (ESTAGIOS[nome]) ESTAGIOS[nome].reset();
  }
  function quadro() {
    if (!est || !ESTAGIOS[nome]) return;
    const agora = performance.now(), dt = Math.min(.05, (agora - ultimo) / 1000); ultimo = agora; tempo += dt;
    cx.clearRect(0, 0, PW, PH); ESTAGIOS[nome].step(dt, tempo);
  }
  function retomar() { ultimo = performance.now(); }
  function parar() { est = null; nome = null; cx.clearRect(0, 0, PW, PH); }
  return { iniciar, quadro, retomar, parar, redimensionar };
})();
