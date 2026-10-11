// AXIS Painel: widget para a app Scriptable (iOS).
// Lê widget/painel.json deste repositório (atualizado pelo Claude 3 vezes por dia).
// Toque no widget abre o painel completo.

const DADOS = "https://raw.githubusercontent.com/CarlosPereiraAXIS/AXIS2/refs/heads/claude/project-thread-pgupba/widget/painel.json";
const PAINEL = "https://claude.ai/artifact/BnMNsrBah8Y4eiktw9mBFB";

const AZUL1 = new Color("#1f5fd1");
const AZUL2 = new Color("#5cc0ff");
const FUNDO = new Color("#0a0a0f");
const BRANCO = Color.white();
const CINZA = new Color("#8a93a6");

function num(n) {
  if (n == null) return "–";
  if (n >= 10000) return (n / 1000).toFixed(0) + "k";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".", ",") + "k";
  return String(n);
}

function quando(iso) {
  const d = new Date(iso);
  const df = new DateFormatter();
  df.dateFormat = "d/M HH:mm";
  return df.string(d);
}

async function carregar() {
  const fm = FileManager.local();
  const cache = fm.joinPath(fm.documentsDirectory(), "axis-painel.json");
  try {
    const req = new Request(DADOS + "?t=" + Date.now());
    req.timeoutInterval = 10;
    const dados = await req.loadJSON();
    fm.writeString(cache, JSON.stringify(dados));
    return dados;
  } catch (e) {
    if (fm.fileExists(cache)) return JSON.parse(fm.readString(cache));
    return null;
  }
}

function texto(stack, t, tamanho, cor, peso) {
  const el = stack.addText(t);
  el.font = peso === "bold" ? Font.boldSystemFont(tamanho) : Font.mediumSystemFont(tamanho);
  el.textColor = cor;
  el.lineLimit = 1;
  el.minimumScaleFactor = 0.6;
  return el;
}

function coluna(pai, nome, rede) {
  const c = pai.addStack();
  c.layoutVertically();
  texto(c, nome.toUpperCase(), 10, AZUL2, "bold");
  c.addSpacer(2);
  texto(c, num(rede.visualizacoes), 26, BRANCO, "bold");
  texto(c, "visualizações", 10, CINZA);
  c.addSpacer(4);
  texto(c, num(rede.seguidores) + " seguidores", 11, BRANCO);
  return c;
}

const dados = await carregar();
const w = new ListWidget();
const g = new LinearGradient();
g.colors = [FUNDO, FUNDO, new Color("#0f2550")];
g.locations = [0, 0.55, 1];
g.startPoint = new Point(0, 0);
g.endPoint = new Point(1, 1);
w.backgroundGradient = g;
w.setPadding(14, 16, 12, 16);
w.url = PAINEL;
w.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

const topo = w.addStack();
topo.centerAlignContent();
texto(topo, "AXIS", 14, BRANCO, "bold");
texto(topo, " · Painel", 12, CINZA);
topo.addSpacer();
if (dados) texto(topo, dados.periodo, 10, CINZA);

// linha azul com o gradiente da marca
const linha = w.addStack();
linha.size = new Size(0, 2);
const lg = new LinearGradient();
lg.colors = [AZUL1, AZUL2];
lg.locations = [0, 1];
lg.startPoint = new Point(0, 0);
lg.endPoint = new Point(1, 0);
linha.backgroundGradient = lg;
linha.cornerRadius = 1;
linha.addSpacer();
w.addSpacer(8);

if (!dados) {
  texto(w, "Sem dados. Toca para abrir o painel.", 12, CINZA);
} else if (config.widgetFamily === "small") {
  const ig = dados.instagram, tt = dados.tiktok;
  texto(w, "INSTAGRAM", 9, AZUL2, "bold");
  texto(w, num(ig.visualizacoes) + " · " + num(ig.seguidores) + " seg.", 15, BRANCO, "bold");
  w.addSpacer(6);
  texto(w, "TIKTOK", 9, AZUL2, "bold");
  texto(w, num(tt.visualizacoes) + " · " + num(tt.seguidores) + " seg.", 15, BRANCO, "bold");
  w.addSpacer();
  texto(w, "atualizado " + quando(dados.atualizado), 9, CINZA);
} else {
  const linhaNums = w.addStack();
  coluna(linhaNums, "Instagram", dados.instagram);
  linhaNums.addSpacer();
  coluna(linhaNums, "TikTok", dados.tiktok);
  linhaNums.addSpacer();
  w.addSpacer();
  const rod = w.addStack();
  rod.centerAlignContent();
  if (dados.melhor) {
    texto(rod, "★ " + dados.melhor.titulo + " · " + num(dados.melhor.visualizacoes), 11, BRANCO);
  }
  rod.addSpacer();
  texto(rod, quando(dados.atualizado), 9, CINZA);
}

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  await w.presentMedium();
}
Script.complete();
