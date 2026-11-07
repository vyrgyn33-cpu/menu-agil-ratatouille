/* app.js — Menú Ágil Ratatouille
 * Aplicación responsive (celular y computadora) que reutiliza el diseño y la paleta del prototipo de Figma.
 * Sin servidor ni base de datos: los pedidos se guardan en el navegador (localStorage) y los pagos son simulados.
 */
'use strict';

/* ---------- Estado ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
};

const mqWeb = window.matchMedia('(min-width: 700px)');

const validCur = (c) => (CURRENCIES.indexOf(c) >= 0 ? c : 'ARS');
const S = {
  lang: (LANGS.indexOf(store.get('rata_lang', null)) >= 0 ? store.get('rata_lang', null) : null) || guessLang(),
  cur: validCur(store.get('rata_cur', 'ARS')),
  web: mqWeb.matches,
  screen: 'welcome',     // welcome | menu | cart | book | events | place | pay | confirmed | kitchen
  prevScreen: 'welcome',
  cat: 'ent',
  fv: false,             // filtro Veggie
  fg: false,             // filtro Sin TACC (se combina con Veggie)
  cart: [],
  drawer: false,
  prefs: false,
  sheet: null,
  flow: false,           // modal de pago/confirmación en la versión web
  form: { name: '', type: 'mesa', notes: '', method: null, cash: '', showAll: false },
  pay: null,
  lastOrder: null,
  kFilter: 'all',
  res: { date: null, franja: null, time: null, service: 'pri', people: 2, name: '', done: null, err: false },
  suggest: null,         // moneda sugerida al cambiar de idioma
  err: null
};

function guessLang() {
  const n = (navigator.language || 'en').toLowerCase();
  if (n.indexOf('es') === 0) return 'es';
  if (n.indexOf('zh') === 0) return 'zh';
  if (n.indexOf('de') === 0) return 'de';
  if (n.indexOf('pt') === 0) return 'pt';
  return 'en';          // si el idioma del navegador no es uno de los 5, se usa inglés
}

/* ---------- Utilidades ---------- */
const li = () => LANGS.indexOf(S.lang);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function t(key, vars) {
  const e = UI[key];
  let s = e ? (e[S.lang] != null ? e[S.lang] : e.es) : key;
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}
const dishName = (d) => d.n[li()];
const dishDesc = (d) => d.ds[li()];
const optLabel = (o) => o[li()];
const flavorName = (i) => FLAVORS[i][S.lang];
const getDish = (id) => DISHES.find((d) => d.id === id);

// Todos los precios se guardan en ARS. Se convierten con cotizaciones fijas y se redondean hacia arriba:
// ARS y CNY sin decimales; USD, BRL y EUR a múltiplos de 0,50.
function conv(arsAmount, cur) {
  if (cur === 'ARS') return Math.ceil(arsAmount - 1e-9);
  const v = arsAmount / RATES[cur];
  if (cur === 'CNY') return Math.ceil(v - 1e-9);
  return Math.ceil(v * 2 - 1e-9) / 2;
}
function fmtMoney(n, cur, lang) {
  lang = lang || S.lang;
  const dec = (cur === 'ARS' || cur === 'CNY') ? 0 : 2;
  const num = new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
  const nb = ' ';
  const sym = (cur === 'ARS' && lang !== 'es') ? 'ARS' : SYMBOL[cur];
  if (lang === 'es' || lang === 'pt') return sym + nb + num;          // $ 15.800 · US$ 11,50 · R$ 61,00
  if (lang === 'de') return num + nb + sym;                             // 10,00 € · 11,50 US$
  if (lang === 'zh') return sym + (sym === 'ARS' ? nb : '') + num;     // CN¥82
  return sym + (sym === 'ARS' ? nb : '') + num;                         // ARS 15,800 · US$11.50 · €10.00
}
function money(arsAmount, cur, lang) { cur = cur || S.cur; return fmtMoney(conv(arsAmount, cur), cur, lang); }
const ars = (n) => money(n, 'ARS');
const curWord = (c) => CUR_WORD[c][S.lang];

const ICON = {
  menu: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M9 8h6M9 12h6"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  note: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
  pin: '<path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  phone: '<path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ig: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r=".8"/>'
};
const icon = (n) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>';
const WHEAT = '<svg class="wheat-off-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9M12 9c-2-1-3-3-3-5 2 1 3 3 3 5zM12 9c2-1 3-3 3-5-2 1-3 3-3 5zM12 15c-2-1-3-3-3-5M12 15c2-1 3-3 3-5M3 3l18 18"/></svg>';
const IMG_FALLBACK = ' onerror="this.onerror=null;this.src=\'img/plato.png\'"';

function badges(d, mini) {
  if (!d.tags.length) return '';
  let h = '<div class="dietary-badges' + (mini ? ' mini' : '') + '">';
  if (d.tags.indexOf('veggie') >= 0) h += '<span class="dietary-badge veggie' + (mini ? ' mini' : '') + '">🌿 ' + t('bVeggie') + '</span>';
  if (d.tags.indexOf('gf') >= 0) h += '<span class="dietary-badge glutenFree' + (mini ? ' mini' : '') + '">' + WHEAT + t('bGF') + '</span>';
  return h + '</div>';
}

/* ---------- Carrito ---------- */
let uid = 1;
const mcPrice = (q) => Math.floor(q / 5) * 8000 + (q % 5) * 1800;   // cada grupo de 5 = $8.000, el resto $1.800 c/u
const mcSaving = (q) => Math.floor(q / 5) * 1000;
function cartCount() { return S.cart.reduce((a, i) => a + i.qty, 0); }
function cartTotal() { return S.cart.reduce((a, i) => a + i.unit * i.qty, 0); }
function flavorList(counts, L) {
  const out = [];
  counts.forEach((n, i) => { if (n) out.push(n + ' ' + FLAVORS[i][LANGS[L]]); });
  return out;
}
function itemOptText(it, lang) {
  const L = lang === undefined ? li() : lang;
  const parts = [];
  if (it.opt != null) parts.push(getDish(it.id).opts[it.opt][L]);
  if (it.kind === 'macaron') parts.push(flavorList(it.flavors, L).join(', '));
  if (it.kind === 'merienda') {
    const cof = getDish(it.mer.coffee);
    parts.push(cof.n[L] + ' · ' + MERIENDA_CROISSANT[it.mer.cro][L] + ' · ' + it.mer.flavors.map((f) => FLAVORS[f][LANGS[L]]).join(' + '));
  }
  return parts.join(' · ');
}
const dot = (i) => '<i class="flavor-color flavor-' + i + ' mini-dot"></i>';
function itemOptHtml(it) {
  if (it.kind === 'macaron') return it.flavors.map((n, i) => n ? dot(i) + n + ' ' + esc(flavorName(i)) : '').filter(Boolean).join(' · ');
  if (it.kind === 'merienda') {
    return esc(dishName(getDish(it.mer.coffee))) + ' · ' + esc(optLabel(MERIENDA_CROISSANT[it.mer.cro])) + '<br>' + esc(t('step3')) + ': ' + it.mer.flavors.map((f) => dot(f) + esc(flavorName(f))).join(' · ');
  }
  return esc(itemOptText(it));
}
function addToCart(entry) {
  // Junta ítems idénticos (mismo plato y misma opción)
  const same = S.cart.find((i) => i.id === entry.id && i.opt === entry.opt && !i.kind && !entry.kind);
  if (same) same.qty += entry.qty; else S.cart.push(Object.assign({ key: uid++ }, entry));
  toast(t('addedToast'));
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = (S.web ? 'toast web-toast' : 'toast');
  el.setAttribute('role', 'status');
  el.innerHTML = '<span>✓</span>' + esc(msg) + '<b>' + esc(money(cartTotal())) + '</b>';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

/* ---------- Formas de pago (todas simuladas) ---------- */
const PM_ICON = { cash: '💵', transfer: '🏦', mercadopago: '👛', paypal: '👛', pix: '👛', wero: '👛', alipay: '👛', wechat: '👛' };
const chargeCur = (m) => METHOD_CUR[m] || S.cur;
const chargeText = (m) => money(cartTotal(), chargeCur(m));
const isDelivery = () => S.form.type === 'delivery';
function recommended() {
  const r = METHODS_BY_CUR[S.cur].slice();
  if (S.cur === 'CNY') return ['alipay', 'wechat', 'cash'];   // con yuanes, las billeteras chinas van primero
  return r;
}
function pmCard(m) {
  const sel = S.form.method === m;
  const badge = (m === 'alipay' || m === 'wechat') && (S.lang === 'zh' || S.cur === 'CNY') ? '<em class="rec-badge">' + (S.lang === 'zh' ? '推荐' : t('recBadge')) + '</em>' : '';
  return '<button type="button" class="payment-card' + (sel ? ' selected' : '') + '" data-act="method" data-m="' + m + '" aria-pressed="' + sel + '">' +
    '<span class="payment-icon" aria-hidden="true">' + PM_ICON[m] + '</span><strong>' + t('pm_' + m) + '</strong><small>' + t('chargesIn', { cur: chargeCur(m) }) + '</small>' + badge +
    (sel ? '<span class="payment-check">✓</span>' : '') + '</button>';
}
function paymentGrid() {
  const rec = recommended(), others = ALL_METHODS.filter((m) => rec.indexOf(m) < 0);
  const open = S.form.showAll || (S.form.method && others.indexOf(S.form.method) >= 0);
  let h = '<p class="pay-sub">' + t('payRecommended', { cur: S.cur }) + '</p><div class="payment-grid">' + rec.map(pmCard).join('') + '</div>';
  h += '<button type="button" class="link-btn" data-act="payMore" aria-expanded="' + !!open + '">' + t(open ? 'payFewer' : 'payOthers') + '</button>';
  if (open) h += '<div class="payment-grid">' + others.map(pmCard).join('') + '</div>';
  return h;
}
function cashChangeText() {
  const paid = parseFloat(S.form.cash), tot = conv(cartTotal(), S.cur);
  if (isNaN(paid)) return '';
  if (paid < tot) return t('cashLess');
  return t('cashChange', { amt: fmtMoney(Math.round((paid - tot) * RATES[S.cur]), 'ARS') });
}
function paymentBlock(compact) {
  if (isDelivery()) return '<div class="payment-methods' + (compact ? ' compact' : '') + '"><p class="delivery-payment-note">' + t('deliveryPay') + '</p></div>';
  const m = S.form.method;
  let h = '<div class="payment-methods' + (compact ? ' compact' : '') + '"><h3>' + t('payTitle') + '</h3>' + paymentGrid();
  if (m === 'cash') {
    if (S.cur !== 'ARS') h += '<p class="currency-charge-note">' + t('cashOther', { word: curWord(S.cur) }) + '</p>';
    if (S.form.type === 'mesa') h += '<p class="currency-charge-note">' + t('cashTable') + '</p>';
    else h += '<label class="field cash-field"><span>' + t('cashWith') + ' (' + S.cur + ')</span><input type="number" inputmode="decimal" min="0" id="cashIn" value="' + esc(S.form.cash) + '"><b class="change-value" id="chg">' + esc(cashChangeText()) + '</b></label>';
  } else if (m && chargeCur(m) !== S.cur) {
    h += '<p class="currency-charge-note">' + (chargeCur(m) === 'ARS' ? t('chargeNotePesos', { amt: chargeText(m) }) : t('chargeNote', { pm: t('pm_' + m), word: curWord(chargeCur(m)), amt: chargeText(m) })) + '</p>';
  }
  return h + '<p class="payment-note">' + t('paySim') + '</p></div>';
}
function confirmLabel() {
  const m = S.form.method;
  if (isDelivery() || !m || m === 'cash') return t('confirmOrder');
  return t('payBtn', { amt: chargeText(m) });
}
function totalBlock(cls) {
  let rate = '';
  if (S.cur !== 'ARS') {
    const one = fmtMoney(1, S.cur).replace(/[.,]00/, '');
    rate = '<small class="reference-rate">' + t('rate', { one: one, amt: ars(RATES[S.cur]) }) + '</small>';
  }
  return '<div class="' + cls + '"><span>' + t('total') + '</span><div class="total-value"><strong>' + esc(money(cartTotal())) + '</strong>' + rate + '</div></div>';
}


/* ---------- Pedidos (comandas del panel de despacho) ---------- */
// Cada comanda guarda el total en ARS junto con la moneda elegida, así la conversión no cambia si cambia la cotización.
function getOrders() { return store.get('rata_orders2', null); }
function saveOrders(o) { store.set('rata_orders2', o); }
function seedOrders() {
  if (getOrders() !== null) return;
  const now = Date.now();
  saveOrders([
    { id: 'o1', num: 4819, table: 4, name: 'Carla', type: 'mesa', notes: 'Sin cebolla en la sopa.', items: [{ n: 'Sopa de cebolla', q: 1, o: '' }, { n: 'Steak frites', q: 1, o: '' }], totalARS: 33200, cur: 'ARS', method: 'mercadopago', payStatus: 'paid', status: 'prep', ts: now - 14 * 60000 },
    { id: 'o2', num: 4820, table: 0, name: 'Pedro (PedidosYa)', type: 'delivery', notes: '', items: [{ n: 'Ratatouille de la casa', q: 2, o: '' }, { n: 'Mousse au chocolat', q: 1, o: '' }], totalARS: 39400, cur: 'ARS', method: 'app', payStatus: 'paid', status: 'prep', ts: now - 9 * 60000 },
    { id: 'o3', num: 4821, table: 0, name: 'Lucía', type: 'retiro', notes: 'Alergia a los frutos secos.', items: [{ n: 'Merienda Ratatouille', q: 1, o: 'Espresso + Simple + Frambuesa + Pistacho' }], totalARS: 12500, cur: 'EUR', method: 'cash', payStatus: 'collect', status: 'prep', ts: now - 4 * 60000 }
  ]);
}
function createOrder(method, payStatus) {
  seedOrders();
  const seq = store.get('rata_seq2', 4822);
  store.set('rata_seq2', seq + 1);
  const order = {
    id: 'o' + Date.now(), num: seq, table: S.form.type === 'mesa' ? (TABLE || 0) : 0,
    name: S.form.name.trim(), type: S.form.type, notes: S.form.notes.trim(),
    items: S.cart.map((i) => ({ n: getDish(i.id).n[0] + (i.kind === 'macaron' ? ' x' + i.mq : ''), q: i.qty, o: itemOptText(i, 0) })),
    totalARS: cartTotal(), cur: S.cur, method: method, payStatus: payStatus, status: 'prep', ts: Date.now()
  };
  const all = getOrders() || [];
  all.push(order); saveOrders(all);
  S.lastOrder = order;
  S.cart = []; S.form.notes = ''; S.form.cash = '';
  return order;
}

function lastOrderLive() {
  if (!S.lastOrder) return null;
  const all = getOrders() || [];
  return all.find((o) => o.id === S.lastOrder.id) || S.lastOrder;
}

/* ---------- Render: piezas compartidas ---------- */
function filtered(cat) {
  return DISHES.filter((d) => d.cat === cat && (!S.fv || d.tags.indexOf('veggie') >= 0) && (!S.fg || d.tags.indexOf('gf') >= 0));
}
const filterActive = () => S.fv || S.fg;
function tabLabel(c) { return t('cat_' + c) + (filterActive() && !filtered(c).length ? ' (0)' : ''); }
function dishCard(d) {
  const feat = d.kind === 'featured';
  const price = d.kind === 'macaron' ? t('mcRule', { box: money(8000), unit: money(1800) }) : money(d.price);
  return '<article class="dish-card' + (feat ? ' featured-dish' : '') + (d.kind === 'macaron' ? ' macaron-dish' : '') + '">' +
    '<button type="button" class="dish-photo-button" data-act="open" data-id="' + d.id + '" aria-label="' + esc(dishName(d)) + '"><img class="dish-photo" src="' + dishPhoto(d.id) + '" alt="" loading="lazy"' + IMG_FALLBACK + '></button>' +
    '<div class="dish-body">' + (feat ? '<div class="featured-kicker">' + t('featured') + '</div>' : '') +
    '<button type="button" class="dish-title" data-act="open" data-id="' + d.id + '">' + esc(dishName(d)) + '</button>' +
    badges(d, false) + '<p>' + esc(dishDesc(d)) + '</p>' +
    '<div class="dish-bottom"><strong>' + esc(price) + '</strong><button type="button" class="btn btn-primary small" data-act="add" data-id="' + d.id + '">' + t('add') + '</button></div>' +
    '</div></article>';
}
function filterChips() {
  const chip = (k, label, pre, on) => '<button type="button" class="filter-chip ' + (k === 'gf' ? 'glutenFree' : k) + (on ? ' active' : '') + '" data-act="filter" data-f="' + k + '" aria-pressed="' + !!on + '">' + (pre ? '<span>' + pre + '</span>' : '') + label + (on ? ' ✓' : '') + '</button>';
  return '<div class="filter-chips" role="group">' + chip('all', t('fAll'), '', !filterActive()) + chip('veggie', t('fVeggie'), '🌿', S.fv) + chip('gf', t('fGF'), '', S.fg) + '</div>';
}
function glutenWarning() {
  return '<div class="gluten-warning">' + WHEAT + '<span><b>' + t('careTitle') + '</b>' + t('careText') + '</span></div>';
}
function emptyFilter() {
  return '<div class="filter-empty"><img src="img/rat.png" alt=""><p>' + t('noResultsIn', { cat: t('cat_' + S.cat) }) + '</p><button type="button" class="btn btn-secondary" data-act="otherCat">' + t('seeOtherCats') + '</button></div>';
}
function cartLine(it, web) {
  const d = getDish(it.id);
  const title = dishName(d) + (it.kind === 'macaron' ? ' x' + it.mq : '');
  const optHtml = itemOptHtml(it);
  const fixed = !!it.kind;
  const qtyCtl = fixed ? '' : '<div class="quantity"><button type="button" data-act="dec" data-k="' + it.key + '" aria-label="−">−</button><b>' + it.qty + '</b><button type="button" data-act="inc" data-k="' + it.key + '" aria-label="+">+</button></div>';
  const edit = it.kind ? '<button type="button" class="edit-link" data-act="editItem" data-k="' + it.key + '">' + t(it.kind === 'macaron' ? 'mcEdit' : 'merEdit') + '</button>' : '';
  const price = money(it.unit * it.qty);
  if (web) {
    return '<article><img src="' + dishPhoto(it.id) + '" alt=""' + IMG_FALLBACK + '><div><h3>' + esc(title) + '</h3>' + (optHtml ? '<small>' + optHtml + '</small>' : '') +
      '<div class="web-cart-item-actions">' + qtyCtl + edit + '<button type="button" data-act="del" data-k="' + it.key + '">' + t('remove') + '</button></div></div><strong>' + esc(price) + '</strong></article>';
  }
  return '<article class="cart-item"><img src="' + dishPhoto(it.id) + '" alt=""' + IMG_FALLBACK + '><div><h3>' + esc(title) + '</h3>' + badges(d, true) +
    (optHtml ? '<span class="cart-option">' + optHtml + '</span>' : '') + '<div class="web-cart-item-actions" style="margin-top:6px">' + qtyCtl + edit + '</div>' +
    '<button type="button" class="remove" data-act="del" data-k="' + it.key + '">' + t('remove') + '</button></div><strong>' + esc(price) + '</strong></article>';
}
function typeChoices(web) {
  const types = [['mesa', 'atTable'], ['retiro', 'takeaway'], ['delivery', web ? 'deliveryShort' : 'delivery']];
  if (web) return '<div class="web-order-types">' + types.map((x) => '<button type="button" class="' + (S.form.type === x[0] ? 'active' : '') + '" data-act="type" data-v="' + x[0] + '">' + t(x[1]) + '</button>').join('') + '</div>';
  return '<div class="choice-list">' + types.map((x) => '<button type="button" class="' + (S.form.type === x[0] ? 'active' : '') + '" data-act="type" data-v="' + x[0] + '"><i></i>' + t(x[1]) + '</button>').join('') + '</div>';
}
function orderFields(web) {
  return '<label class="field"><span>' + t('name') + '</span><input id="fName" type="text" autocomplete="name" placeholder="' + esc(t('yourName')) + '" value="' + esc(S.form.name) + '"></label>' +
    '<fieldset><legend>' + t('orderType') + '</legend>' + typeChoices(web) + '</fieldset>' +
    '<label class="field"><span>' + t('notes') + '</span><textarea id="fNotes" placeholder="' + esc(t('notesPh')) + '">' + esc(S.form.notes) + '</textarea></label>';
}
function errBox() { return S.err ? '<p class="payment-note" style="border-color:var(--danger);color:var(--danger)" role="alert">' + esc(t(S.err)) + '</p>' : ''; }

function webOrderPanel(closeBtn) {
  let h = '<div class="web-order-panel"><div class="web-order-title"><h2>' + t('yourOrder') + '</h2>' + (closeBtn ? '<button type="button" class="drawer-close" data-act="closeDrawer" aria-label="' + t('close') + '">' + icon('x') + '</button>' : '') + '</div>';
  if (!S.cart.length) {
    h += '<div class="web-cart-empty"><img src="img/rat.png" alt=""><p>' + t('emptyText') + '</p></div></div>';
    return h;
  }
  h += '<div class="web-cart-items">' + S.cart.map((i) => cartLine(i, true)).join('') + '</div>' + totalBlock('web-order-total');
  h += '<div class="web-order-form">' + orderFields(true) + paymentBlock(true) + errBox() + '<button type="button" class="btn btn-primary" data-act="confirm">' + confirmLabel() + '</button></div></div>';
  return h;
}

/* ---------- Render: versión móvil ---------- */
function mHeader() {
  return '<header class="app-header"><img class="header-rat" src="img/rat.png" alt=""><div class="header-name"><span>Ratatouille</span><small>BISTRO &amp; COFFEE</small></div>' +
    '<button type="button" class="preferences-button" data-act="prefs" aria-label="' + t('prefs') + '">' + icon('gear') + '</button>' +
    '<button type="button" class="cart-button" data-act="go" data-s="cart" aria-label="' + t('myOrder') + '">' + icon('bag') + (cartCount() ? '<span class="cart-badge">' + cartCount() + '</span>' : '') + '</button></header>';
}
function mNav() {
  const items = [['menu', 'menu', 'navMenu'], ['book', 'cal', 'navBook'], ['events', 'note', 'navLive'], ['cart', 'bag', 'myOrder']];
  return '<nav class="bottom-nav" aria-label="Principal">' + items.map((x) => '<button type="button" class="' + (S.screen === x[0] ? 'active' : '') + '" data-act="go" data-s="' + x[0] + '"><span class="nav-icon">' + icon(x[1]) + (x[0] === 'cart' && cartCount() ? '<b>' + cartCount() + '</b>' : '') + '</span><small>' + t(x[2]) + '</small></button>').join('') + '</nav>';
}
function mWelcome() {
  const tableLine = TABLE ? '<h1>' + t('welcome1') + '<br>' + t('welcome2', { n: TABLE }) + '</h1><p class="question">' + t('whatToday') + '</p>' : '<h1>' + t('intro1') + '<br>' + t('intro2') + '</h1>';
  return '<main class="welcome"><div class="double-frame"><div class="welcome-top"><span class="fleur">⚜</span><span>' + (TABLE ? t('menuAgil') + ' ' + TABLE : 'BUENOS AIRES · DESDE 2018') + '</span><span class="fleur">⚜</span></div>' +
    '<img class="welcome-logo" src="img/logo.png" alt="Ratatouille Bistro &amp; Coffee"><div class="welcome-copy"><p class="eyebrow">' + t('bonjour') + '</p>' +
    tableLine + '<div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div>' +
    '<p class="intro">' + t('heroQR') + '</p></div>' +
    '<div class="welcome-actions"><button type="button" class="btn btn-primary" data-act="go" data-s="menu">' + t('makeOrder') + '</button><button type="button" class="btn btn-secondary" data-act="go" data-s="book">' + t('bookTable') + '</button></div>' +
    '<div style="display:flex;justify-content:space-between;width:100%;gap:8px"><button type="button" class="staff-link" data-act="go" data-s="place">' + icon('pin') + t('navPlace').toUpperCase() + '</button>' +
    '<button type="button" class="staff-link" data-act="prefs">' + icon('gear') + (LANG_LABEL[S.lang] + ' · ' + S.cur) + '</button></div></div></main>';
}
function mMenu() {
  const idx = CATS.indexOf(S.cat);
  const list = filtered(S.cat);
  let h = '<div class="category-tabs" role="tablist">' + CATS.map((c) => '<button type="button" role="tab" class="' + (c === S.cat ? 'active' : '') + (filtered(c).length ? '' : ' no-results') + '" data-act="cat" data-c="' + c + '">' + esc(tabLabel(c)) + '</button>').join('') + '</div>';
  h += '<div class="content"><div class="dietary-filters">' + filterChips() + filterCount() + '</div>';
  h += '<div class="category-heading"><span>0' + (idx + 1) + '</span><div><p>' + t('catKick_' + S.cat) + '</p><h1>' + t('cat_' + S.cat) + '</h1></div></div>';
  if (S.fg) h += glutenWarning();
  h += list.length ? '<div class="dish-list">' + list.map(dishCard).join('') + '</div>' : emptyFilter();
  h += '<div class="dietary-legend"><i>🌿</i> ' + t('legend') + '</div>';
  h += '<div class="qr-banner"><img src="img/rat.png" alt=""><div><b>' + t('heroQR') + '</b><em>Bon appétit</em></div></div></div>';
  return h;
}
function mCart() {
  let h = '<div class="content cart-content"><h1 class="page-title">' + t('yourOrder') + '</h1><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div>';
  if (!S.cart.length) {
    return h + '<div class="empty"><img src="img/rat.png" alt=""><h2>' + t('emptyTitle') + '</h2><p>' + t('emptyText') + '</p><button type="button" class="btn btn-primary" data-act="go" data-s="menu">' + t('seeMenu') + '</button></div></div>';
  }
  h += '<div class="cart-list">' + S.cart.map((i) => cartLine(i, false)).join('') + '</div>' + totalBlock('total-row');
  h += '<div class="order-form"><h2>' + t('confirmOrder') + '</h2>' + orderFields(false) + paymentBlock(false) + errBox() + '<button type="button" class="btn btn-primary" data-act="confirm">' + confirmLabel() + '</button></div></div>';
  return h;
}

/* ---------- Reservas, eventos y ubicación ---------- */
function nextDays(n) {
  const out = [], base = new Date();
  for (let i = 0; i < n; i++) out.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
  return out;
}
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtD = (d, o) => new Intl.DateTimeFormat(LOCALE[S.lang], o).format(d);
// Fecha larga: "Jueves 29/10/2026" · "Thursday, Oct 29, 2026" · "quinta-feira, 29/10/2026" · "Donnerstag, 29.10.2026" · "2026年10月29日星期四"
function dateLong(d) {
  const wd = fmtD(d, { weekday: 'long' }), num = fmtD(d, { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (S.lang === 'es') return cap(wd) + ' ' + num;
  if (S.lang === 'en') return fmtD(d, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  if (S.lang === 'zh') return fmtD(d, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  return wd + ', ' + num;
}
// Fecha corta para la confirmación: "Jueves 29/10"
function dateShort(d) {
  const wd = fmtD(d, { weekday: 'long' }), dm = fmtD(d, { day: '2-digit', month: '2-digit' });
  if (S.lang === 'es') return cap(wd) + ' ' + dm;
  if (S.lang === 'en') return fmtD(d, { weekday: 'long', month: 'short', day: 'numeric' });
  if (S.lang === 'zh') return fmtD(d, { month: 'long', day: 'numeric', weekday: 'long' });
  return wd + ', ' + dm;
}
const parseISO = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
// Turnos cada 30 minutos; el último es 1 hora antes del cierre
function slotsFor(d) {
  const h = hoursFor(d.getDay()), out = [];
  for (let m = h.open; m <= h.close - 60; m += 30) out.push(m);
  return out;
}
function slotState(d, m, list) {
  const now = new Date();
  if (iso(d) === iso(now) && m <= now.getHours() * 60 + now.getMinutes()) return 'past';
  // "Completo": simulación fija según el día y la hora (nunca el primero ni el último turno)
  if (m !== list[0] && m !== list[list.length - 1] && (d.getDate() * 7 + d.getMonth() * 3 + (m / 30) * 13) % 6 === 0) return 'full';
  return 'ok';
}
function franjaSlots(d, fr, list) {
  const f = FRANJAS.find((x) => x[0] === fr);
  return list.filter((m) => m >= f[1] && m <= f[2]);
}
// Mantiene fecha, franja y turno coherentes (si el turno elegido ya no existe, se deselecciona)
function normalizeRes(days) {
  const R = S.res;
  if (!R.date || !days.some((d) => iso(d) === R.date)) R.date = iso(days[0]);
  const d = parseISO(R.date), list = slotsFor(d);
  const frs = FRANJAS.filter((f) => franjaSlots(d, f[0], list).length);
  if (!R.franja || !frs.some((f) => f[0] === R.franja)) {
    const first = frs.find((f) => franjaSlots(d, f[0], list).some((m) => slotState(d, m, list) === 'ok')) || frs[0];
    R.franja = first ? first[0] : null;
  }
  if (R.time != null && (list.indexOf(R.time) < 0 || slotState(d, R.time, list) !== 'ok')) R.time = null;
  return { d: d, list: list, frs: frs };
}
function reservationForm(web) {
  const days = nextDays(8), info = normalizeRes(days), R = S.res, d = info.d;
  const chips = '<div class="chips">' + days.map((x) =>
    '<button type="button" class="' + (iso(x) === R.date ? 'active' : '') + '" data-act="rdate" data-v="' + iso(x) + '">' + fmtD(x, { weekday: 'short' }) + '<br><b>' + x.getDate() + '</b></button>').join('') +
    '</div><small class="localized-date">' + esc(dateLong(d)) + '</small>';
  const seg = '<div class="segmented" role="tablist">' + info.frs.map((f) => '<button type="button" role="tab" class="' + (R.franja === f[0] ? 'active' : '') + '" data-act="rfranja" data-v="' + f[0] + '">' + t(f[0]) + '</button>').join('') + '</div>';
  const slots = R.franja ? franjaSlots(d, R.franja, info.list) : [];
  const btns = slots.map((m) => {
    const st = slotState(d, m, info.list), lab = hhmm(m);
    if (st === 'ok') return '<button type="button" class="' + (R.time === m ? 'active' : '') + '" data-act="rtime" data-v="' + m + '">' + lab + '</button>';
    return '<button type="button" class="unavailable" disabled aria-label="' + lab + ' · ' + esc(t('full')) + '"><s>' + lab + '</s>' + (st === 'full' ? '<small>' + t('full') + '</small>' : '') + '</button>';
  }).join('');
  const times = '<div class="web-time-grid slot-grid">' + btns + '</div>';
  const svs = ['ent', 'snack', 'pri', 'pos', 'caf'].map((s) => '<button type="button" class="' + (R.service === s ? 'active' : '') + '" data-act="rserv" data-v="' + s + '">' + t('sv_' + s) + '</button>').join('');
  const services = '<div class="web-service-grid service-grid">' + svs + '</div>';
  const people = '<div class="people-row"><span><b>' + t('people') + '</b><small>' + t('peopleMax') + '</small></span><div class="quantity"><button type="button" data-act="rpeople" data-v="-1" aria-label="−" ' + (R.people <= 1 ? 'disabled' : '') + '>−</button><b>' + R.people + '</b><button type="button" data-act="rpeople" data-v="1" aria-label="+" ' + (R.people >= 20 ? 'disabled' : '') + '>+</button></div></div>';
  const hrs = hoursFor(d.getDay());
  const note = '<p class="hours-note">' + t('openHours', { days: t(hrs.key), hours: hhmm(hrs.open) + ' – ' + hhmm(hrs.close) }) + '</p>';
  let h = '<div class="field"><span>' + t('date') + '</span>' + chips + '</div><div class="field"><span>' + t('time') + '</span>' + seg + times + note + '</div><div class="field"><span>' + t('service') + '</span>' + services + '</div>' + people;
  h += '<label class="field"><span>' + t('name') + '</span><input id="rName" type="text" autocomplete="name" placeholder="' + esc(t('namePh')) + '" value="' + esc(R.name) + '"></label>';
  h += '<button type="button" class="btn btn-primary" data-act="rconfirm">' + t('confirmBook') + '</button>';
  if (R.err) h += '<div class="payment-note" style="border-color:var(--danger);color:var(--danger);margin-top:12px" role="alert">' + t('bookNeed') + '</div>';
  if (R.done) h += '<div class="success-message" role="status">' + t('bookOk', { when: dateShort(parseISO(R.done.date)), time: hhmm(R.done.time), n: R.done.people, ppl: t(R.done.people === 1 ? 'person1' : 'personN'), svc: t('sv_' + R.done.service) }) + '</div>';
  return h;
}
function mBook() {
  return '<div class="content reservations"><h1>' + t('bookTitle') + '</h1><p class="reservation-intro">' + t('bookIntro') + '</p><div class="reservation-card">' + reservationForm(false) + '</div><p class="reservation-footer">' + t('bookFooter') + '</p></div>';
}
function nextEventDate(dow) {
  const b = new Date(); const diff = (dow - b.getDay() + 7) % 7;
  return new Date(b.getFullYear(), b.getMonth(), b.getDate() + diff);
}
function eventCard(e) {
  const d = nextEventDate(e.day);
  const time = e.time + (UI.hrs[S.lang] ? ' ' + UI.hrs[S.lang] : '');
  return '<article class="event-card"><img src="' + e.img + '" alt=""' + IMG_FALLBACK + '><div class="event-date"><strong>' + d.getDate() + '</strong><span>' + t(e.key) + '</span></div>' +
    '<div class="event-info"><small>' + esc(time) + '</small><h2>' + e.title + '</h2><p>' + e.genre + ' · ' + t('free') + '</p><button type="button" class="btn btn-secondary" data-act="goBook">' + t('reserveSpot') + '</button></div></article>';
}
function mEvents() {
  return '<div class="content events"><h1>' + t('eventsTitle') + '</h1><p class="lead">' + t('eventsLead') + '</p><div class="event-list">' + EVENTS.map(eventCard).join('') + '</div></div>';
}
function hoursRows() {
  return [HOURS.weekday, HOURS.sat, HOURS.sun].map((r) => '<div><span>' + t(r.key) + '</span><i></i><b>' + hhmm(r.open) + ' – ' + hhmm(r.close) + '</b></div>').join('');
}
function academicNote() {
  return '<aside class="acad-note"><h3>' + t('projectTitle') + '</h3><p><b>' + t('acadTitle') + '</b> ' + t('acad') + '</p></aside>';
}
function contactCard(web) {
  const body = '<p>' + icon('pin') + '<span>' + esc(RESTO.address) + '</span></p><p>' + icon('phone') + '<span>' + esc(RESTO.phone) + '</span></p><p>' + icon('mail') + '<span>' + esc(RESTO.email) + '</span></p><p>' + icon('ig') + '<span>' + esc(RESTO.instagram) + '</span></p>';
  const acts = '<div class="' + (web ? 'web-contact-actions' : 'contact-actions') + '"><a class="btn btn-primary" href="' + RESTO.mapsLink + '" target="_blank" rel="noopener">' + t('howTo') + '</a><a class="btn btn-secondary" href="tel:' + RESTO.phone.replace(/[^+\d]/g, '') + '">' + t('call') + '</a></div>';
  return web ? '<div class="web-contact"><h3>' + t('contact') + '</h3>' + body + acts + '</div>' : '<div class="contact-card"><h2>' + t('contact') + '</h2>' + body + acts + '</div>';
}

function mapBlock(web) {
  return '<div class="' + (web ? 'web-map' : 'map') + '"><iframe title="Mapa" src="' + RESTO.map + '" loading="lazy"></iframe><div class="' + (web ? '' : 'map-label') + '">' + icon('pin') + '<span>Ratatouille<small>' + esc(RESTO.address) + '</small></span></div></div>';
}

function mPlace() {
  return '<div class="content location"><h1>' + t('placeTitle') + '</h1><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div>' + mapBlock(false) + contactCard(false) + '<div class="hours"><h2>' + t('hours') + '</h2>' + hoursRows() + '</div>' + academicNote() + '</div>';
}

/* ---------- Pagos: pantallas ---------- */
// Textos propios de cada billetera (en el idioma del servicio, no se traducen)
const NATIVE = {
  pix: { title: 'Pague com Pix', code: 'Pix Copia e Cola', copy: 'Copiar código', ok: 'Já paguei' },
  wero: { title: 'Mit Wero bezahlen', scan: 'Scannen Sie den QR-Code mit Ihrer Banking-App oder der Wero-App', ok: 'Zahlung bestätigen' },
  alipay: { scan: '请使用支付宝扫码支付', ok: '已完成支付' },
  wechat: { scan: '请使用微信扫码支付', ok: '已完成支付' }
};
const TIMER_SECS = { pix: 600, alipay: 300, wechat: 300 };
function payShell(inner, extraCls) {
  return '<div class="payment-screen ' + (extraCls || '') + '"><button type="button" class="payment-back" data-act="payBack">← ' + t('back') + '</button>' + inner + '</div>';
}
function payHead(title) {
  const m = S.pay.m, c = chargeCur(m);
  return '<p class="eyebrow">' + t('pm_' + m) + '</p><h2>' + title + '</h2><p>' + t('payTotal') + '</p><strong class="payment-total">' + esc(chargeText(m)) + '</strong>' +
    (c !== S.cur ? '<p class="reference-rate" style="text-align:center">' + t('chargesIn', { cur: c }) + ' · ≈ ' + esc(money(cartTotal())) + '</p>' : '');
}
function fakeQR(big) { return '<div class="fake-qr' + (big ? ' big' : '') + '" role="img" aria-label="QR"><i></i><i></i><i></i></div>'; }
const fmtTimer = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function timerHtml() {
  const left = Math.max(0, Math.round((S.pay.deadline - Date.now()) / 1000));
  return '<p class="pay-timer">' + t('timeLeft') + ': <b id="payTimer">' + fmtTimer(left) + '</b></p>';
}
function declineBtn() { return '<button type="button" class="simulate-decline" data-act="payGo" data-o="declined">' + t('simDecline') + '</button>'; }
function payDetail() {
  const m = S.pay.m, demo = '<p class="payment-note" style="text-align:left">' + t('paySim') + '</p>';
  const go = (label, o) => '<button type="button" class="btn btn-primary" data-act="payGo" data-o="' + (o || 'ok') + '">' + label + '</button>';
  if (m === 'transfer') {
    const row = (lbl, val, copy) => '<div><span><small>' + lbl + '</small><b>' + esc(val) + '</b></span>' + (copy ? '<button type="button" data-act="copy" data-v="' + esc(val) + '">' + t('copy') + '</button>' : '') + '</div>';
    return payShell('<p class="eyebrow">' + t('pm_transfer') + '</p><h2>' + t('trTitle') + '</h2><strong class="payment-total">' + esc(chargeText('transfer')) + '</strong>' +
      '<div class="bank-details">' + row(t('trBank'), RESTO.bank.name) + row(t('trHolder'), RESTO.bank.holder) + row(t('trAlias'), RESTO.bank.alias, true) + row(t('trCbu'), RESTO.bank.cbu, true) + '</div>' +
      '<label class="receipt-upload">' + t('trUpload') + '<input type="file" accept="image/*,application/pdf"></label>' +
      '<button type="button" class="btn btn-primary" data-act="payGo" data-o="pending">' + t('trDone').toUpperCase() + '</button><p class="payment-note">' + t('trDemo') + '</p>', 'transfer-screen');
  }
  if (m === 'mercadopago') {
    return payShell(payHead('Mercado Pago') + fakeQR() + '<p class="eyebrow">' + t('qrTitle') + '</p>' + go(t('pay')) + demo + declineBtn());
  }
  if (m === 'paypal') {
    return payShell(payHead(t('ppLogin')) + '<div style="text-align:left;margin:14px 0"><label class="field"><span>' + t('ppEmail') + '</span><input type="email" autocomplete="off" placeholder="demo@example.com"></label>' +
      '<label class="field"><span>' + t('ppPass') + '</span><input type="password" autocomplete="off" placeholder="••••••••"></label></div>' + go(t('payBtn', { amt: chargeText('paypal') })) + demo + declineBtn());
  }
  if (m === 'pix') {
    return payShell(payHead(NATIVE.pix.title) + fakeQR() + '<p class="eyebrow">' + NATIVE.pix.code + '</p><div class="bank-details" style="margin-top:0"><div><span><small>PIX</small><b>00020126-RATATOUILLE-DEMO-0000</b></span><button type="button" data-act="copy" data-v="00020126-RATATOUILLE-DEMO-0000">' + NATIVE.pix.copy + '</button></div></div>' +
      timerHtml() + go(NATIVE.pix.ok) + demo + declineBtn());
  }
  if (m === 'wero') {
    return payShell(payHead(NATIVE.wero.title) + fakeQR() + '<p class="pay-scan">' + NATIVE.wero.scan + '</p>' + go(NATIVE.wero.ok) + demo + declineBtn());
  }
  // alipay / wechat
  return payShell(payHead(t('pm_' + m)) + fakeQR(true) + '<p class="pay-scan zh">' + NATIVE[m].scan + '</p>' + timerHtml() + go(NATIVE[m].ok) + demo + declineBtn());
}
function payRedirect() {
  return '<div class="payment-screen"><div class="payment-spinner" role="status"></div><h2>' + t(S.pay.m === 'paypal' ? 'ppRedirect' : 'mpRedirect') + '</h2><p>' + t('paySim') + '</p></div>';
}
function payProcessing() {
  return '<div class="payment-screen"><div class="payment-spinner" role="status" aria-label="' + t('processing') + '"></div><h2>' + t('processing') + '</h2><p>' + t('paySim') + '</p></div>';
}
function payResult() {
  const r = S.pay.result;
  const mark = r === 'declined' ? '<div class="result-mark declined">✕</div>' : r === 'pending' ? '<div class="result-mark pending">⏳</div>' : '<div class="result-mark">✓</div>';
  let k = 'payOk';
  if (r === 'declined') k = 'payDecl'; else if (r === 'pending') k = 'payPend'; else if (r === 'collect') k = 'payCollect'; else if (r === 'plain') k = 'payPlain';
  const body = r === 'declined' && S.pay.expired ? t('expired') : t(k + 'T');
  const actions = r === 'declined'
    ? '<button type="button" class="btn btn-primary" data-act="payRetry">' + t('tryAgain') + '</button><button type="button" class="btn btn-secondary" data-act="payBack">' + t('tryOther') + '</button>'
    : '<button type="button" class="btn btn-primary" data-act="seeStatus">' + t('seeStatus') + '</button>';
  const who = S.pay.m === 'app' ? t('deliveryShort') : t('pm_' + S.pay.m);
  return '<div class="payment-result">' + mark + '<p class="eyebrow">' + esc(who).toUpperCase() + '</p><h2>' + t(k) + '</h2><p>' + body + '</p><div class="result-actions">' + actions + '</div></div>';
}
function payView() {
  if (!S.pay) return '';
  if (S.pay.stage === 'redirect') return payRedirect();
  if (S.pay.stage === 'detail') return payDetail();
  if (S.pay.stage === 'processing') return payProcessing();
  return payResult();
}

function confirmedView() {
  const o = lastOrderLive();
  if (!o) return '';
  const st = o.status === 'ready' || o.status === 'done' ? 3 : 2;
  const step = (n, k) => '<div class="step ' + (n < st ? 'done' : n === st ? 'active' : '') + '"><i>' + (n < st ? '✓' : n) + '</i><div><strong>' + t('st' + n) + '</strong><small>' + t('st' + n + 'd') + '</small></div></div>';
  return '<div class="confirmed"><div class="success-mark">✓</div><h1>' + t('sentKitchen', { n: o.num }) + '</h1><p class="lead">' + t('confLead', { name: esc(o.name) }) + '</p>' +
    '<div class="estimate">' + icon('clock') + '<span>' + t('estimate') + '<strong>' + t('minutes') + '</strong></span></div>' +
    '<div class="stepper">' + step(1) + step(2) + step(3) + '</div>' +
    '<button type="button" class="btn btn-primary" data-act="newOrder">' + t('newOrder') + '</button></div>';
}

/* ---------- Hoja de detalle de plato ---------- */
function sheetView() {
  const sh = S.sheet; if (!sh) return '';
  const d = getDish(sh.id);
  let body = '';
  if (d.kind === 'macaron') body = macaronBody(sh, d);
  else if (d.kind === 'merienda') body = meriendaBody(sh, d);
  else body = simpleBody(sh, d);
  return '<div class="modal-backdrop" data-act="closeSheet" role="dialog" aria-modal="true" aria-label="' + esc(dishName(d)) + '"><div class="bottom-sheet ' + (d.kind === 'macaron' ? 'macaron-sheet' : d.kind === 'merienda' ? 'merienda-sheet' : '') + '">' +
    '<div class="sheet-grabber"></div><button type="button" class="sheet-close" data-act="closeSheet" aria-label="' + t('close') + '">' + icon('x') + '</button>' +
    '<img class="sheet-photo" src="' + dishPhoto(d.id) + '" alt=""' + IMG_FALLBACK + '>' + '<div class="sheet-content"><h2>' + esc(dishName(d)) + '</h2>' + badges(d, false) + '<p class="sheet-description">' + esc(dishDesc(d)) + '</p>' + body + '</div></div></div>';
}
function simpleBody(sh, d) {
  let h = '<span class="sheet-price">' + esc(money(d.price)) + '</span><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div>';
  if (d.opts) {
    h += '<fieldset class="dish-options"><legend>' + t('options') + ' <b>' + t('required') + '</b></legend><div class="option-chips vertical">' +
      d.opts.map((o, i) => '<button type="button" class="' + (sh.opt === i ? 'active' : '') + '" data-act="sopt" data-v="' + i + '"><i></i>' + esc(optLabel(o)) + '</button>').join('') + '</div>' +
      (sh.opt == null ? '<p class="selection-help">' + t('pickOption') + '</p>' : '') + '</fieldset>';
  }
  const dis = d.opts && sh.opt == null;
  h += '<div class="qty-row"><span>' + t('qty') + '</span><div class="quantity"><button type="button" data-act="sqty" data-v="-1" ' + (sh.qty <= 1 ? 'disabled' : '') + ' aria-label="−">−</button><b>' + sh.qty + '</b><button type="button" data-act="sqty" data-v="1" aria-label="+">+</button></div></div>';
  h += '<button type="button" class="btn btn-primary" data-act="sadd" ' + (dis ? 'disabled' : '') + '>' + t('addFor', { amt: money(d.price * sh.qty) }) + '</button>';
  return h;
}
function macaronBody(sh, d) {
  const q = sh.qty, seq = sh.seq, total = seq.length, left = q - total, ok = left === 0;
  const counts = [0, 0, 0, 0, 0]; seq.forEach((i) => counts[i]++);
  let h = '<div class="macaron-quantity"><span><b>' + t('mcQty') + '</b><small>' + t('mcRule', { box: money(8000), unit: money(1800) }) + '</small></span>' +
    '<div class="quantity"><button type="button" data-act="mqty" data-v="-1" ' + (q <= 1 ? 'disabled' : '') + ' aria-label="−">−</button><b>' + q + '</b><button type="button" data-act="mqty" data-v="1" ' + (q >= 20 ? 'disabled' : '') + ' aria-label="+">+</button></div>' +
    '<button type="button" class="' + (q === 5 ? 'active' : '') + '" data-act="mbox">' + t('mcShortcut') + '</button></div>';
  h += '<h3 class="picker-title">' + t('mcPick') + '</h3><div class="flavor-picker">' + FLAVORS.map((f, i) =>
    '<div class="flavor-row"><i class="flavor-color flavor-' + i + '"></i><span>' + esc(f[S.lang]) + '</span><div class="quantity"><button type="button" data-act="mflav" data-i="' + i + '" data-v="-1" ' + (counts[i] <= 0 ? 'disabled' : '') + ' aria-label="−">−</button><b>' + counts[i] + '</b><button type="button" data-act="mflav" data-i="' + i + '" data-v="1" ' + (left <= 0 ? 'disabled' : '') + ' aria-label="+">+</button></div></div>').join('') + '</div>';
  let dots = '';
  for (let k = 0; k < q; k++) dots += '<i class="' + (k < seq.length ? 'filled flavor-color flavor-' + seq[k] : '') + '"></i>';
  h += '<div class="macaron-progress"><p>' + t('mcProgress', { n: total, m: q }) + '</p><div>' + dots + '</div></div>';
  h += '<button type="button" class="btn btn-secondary" data-act="msurprise" ' + (left <= 0 ? 'disabled' : '') + '>' + t('mcSurprise') + '</button>';
  if (mcSaving(q)) h += '<p class="saving">' + t('mcSave', { amt: money(mcSaving(q)) }) + '</p>';
  h += '<button type="button" class="btn btn-primary macaron-add" data-act="sadd" ' + (ok ? '' : 'disabled') + '>' + t('addFor', { amt: money(mcPrice(q)) }) + '</button>';
  if (!ok) h += '<p class="selection-help">' + t(left === 1 ? 'mcHelpOne' : 'mcHelp', { n: left }) + '</p>';
  return h;
}
function meriendaBody(sh, d) {
  const m = sh.mer, step = sh.step;
  const stp = [1, 2, 3].map((n) => '<button type="button" class="' + (step === n ? 'active ' : '') + (n < step ? 'done' : '') + '" data-act="mstep" data-v="' + n + '"><i>' + (n < step ? '✓' : n) + '</i>' + t('step' + n) + '</button>').join('');
  let panel = '';
  if (step === 1) {
    panel = '<h3>' + t('chooseCoffee') + '</h3><div class="option-chips vertical">' + MERIENDA_COFFEE.map((id) => '<button type="button" class="' + (m.coffee === id ? 'active' : '') + '" data-act="mcof" data-v="' + id + '"><i></i>' + esc(dishName(getDish(id))) + '</button>').join('') + '</div>';
  } else if (step === 2) {
    panel = '<h3>' + t('chooseCroissant') + '</h3><div class="option-chips vertical">' + MERIENDA_CROISSANT.map((o, i) => '<button type="button" class="' + (m.cro === i ? 'active' : '') + '" data-act="mcro" data-v="' + i + '"><i></i>' + esc(optLabel(o)) + '</button>').join('') + '</div>';
  } else {
    panel = '<h3>' + t('chooseMacarons') + '</h3><div class="flavor-picker">' + FLAVORS.map((f, i) => {
      const n = m.flavors.filter((x) => x === i).length;
      return '<div class="flavor-row"><i class="flavor-color flavor-' + i + '"></i><span>' + esc(f[S.lang]) + '</span><div class="quantity"><button type="button" data-act="mmac" data-i="' + i + '" data-v="-1" ' + (n <= 0 ? 'disabled' : '') + ' aria-label="−">−</button><b>' + n + '</b><button type="button" data-act="mmac" data-i="' + i + '" data-v="1" ' + (m.flavors.length >= 2 ? 'disabled' : '') + ' aria-label="+">+</button></div></div>';
    }).join('') + '</div><div class="macaron-progress"><p>' + t('mcProgress', { n: m.flavors.length, m: 2 }) + '</p></div>';
  }
  const ready = m.coffee && m.cro != null && m.flavors.length === 2;
  let btn;
  if (step < 3) {
    const can = step === 1 ? !!m.coffee : m.cro != null;
    btn = '<button type="button" class="btn btn-primary" data-act="mnext" ' + (can ? '' : 'disabled') + '>' + t('next') + '</button>';
  } else btn = '<button type="button" class="btn btn-primary" data-act="sadd" ' + (ready ? '' : 'disabled') + '>' + t('addFor', { amt: money(d.price) }) + '</button>';
  return '<span class="sheet-price">' + esc(money(d.price)) + '</span><div class="build-stepper">' + stp + '</div><div class="builder-panel">' + panel + '</div>' + btn;
}

/* ---------- Preferencias ---------- */
function prefsSheet() {
  if (!S.prefs) return '';
  const tog = (act, list, cur, lab) => '<div class="preference-toggle">' + list.map((x) => '<button type="button" class="' + (x === cur ? 'active' : '') + '" data-act="' + act + '" data-v="' + x + '" aria-pressed="' + (x === cur) + '">' + lab(x) + '</button>').join('') + '</div>';
  return '<div class="modal-backdrop" data-act="closePrefs"><div class="bottom-sheet preferences-sheet"><div class="sheet-grabber"></div><button type="button" class="sheet-close dark" data-act="closePrefs" aria-label="' + t('close') + '">' + icon('x') + '</button>' +
    '<div class="sheet-content"><h2>' + t('prefs') + '</h2>' +
    '<div class="preference-row" style="flex-wrap:wrap"><span>' + t('prefLang') + '</span>' + tog('lang', LANG_ORDER, S.lang, (x) => LANG_NAME[x]) + '</div>' +
    '<div class="preference-row" style="flex-wrap:wrap"><span>' + t('prefCur') + '</span>' + tog('cur', CURRENCIES, S.cur, (x) => x + ' · ' + SYMBOL[x]) + '</div>' +
    '<p class="reference-rate" style="text-align:left;margin-top:12px">' + esc(S.cur + ' · ' + SYMBOL[S.cur] + ' · ' + CUR_FULL[S.cur]) + (S.cur !== 'ARS' ? '<br>' + t('rate', { one: fmtMoney(1, S.cur).replace(/[.,]00/, ''), amt: ars(RATES[S.cur]) }) : '') + '</p></div></div></div>';
}

/* ---------- Render: versión web ---------- */
function webHeader() {
  const nav = [['menu', 'navMenu'], ['place', 'navPlace'], ['events', 'navLive'], ['book', 'navBook']];
  const selL = '<select class="pref-select" data-sel="lang" aria-label="' + t('prefLang') + '">' + LANG_ORDER.map((l) => '<option value="' + l + '"' + (l === S.lang ? ' selected' : '') + '>' + LANG_NAME[l] + '</option>').join('') + '</select>';
  const selC = '<select class="pref-select" data-sel="cur" aria-label="' + t('prefCur') + '">' + CURRENCIES.map((c) => '<option value="' + c + '"' + (c === S.cur ? ' selected' : '') + ' title="' + esc(c + ' · ' + SYMBOL[c] + ' · ' + CUR_FULL[c]) + '">' + c + '</option>').join('') + '</select>';
  return '<header class="web-header"><div class="web-container web-header-inner"><button type="button" class="web-brand" data-act="top"><img src="img/rat.png" alt=""><span><b>Ratatouille</b><small>BISTRO &amp; COFFEE</small></span></button>' +
    '<nav class="web-nav" aria-label="Principal">' + nav.map((n) => '<button type="button" data-act="scroll" data-t="' + n[0] + '">' + t(n[1]) + '</button>').join('') + '</nav>' +
    '<div class="web-header-actions">' + selL + selC + '<button type="button" class="web-cart-button" data-act="drawer" aria-label="' + t('myOrder') + '">' + icon('bag') + t('myOrder').toUpperCase() + ' (' + cartCount() + ')</button></div></div></header>';
}
function webHero() {
  return '<section class="web-hero"><div class="web-container"><div class="hero-frame"><div class="hero-seal"><span>⚜</span><small>BUENOS AIRES · DESDE 2018</small><span>⚜</span></div>' +
    '<img src="img/logo.png" alt="Ratatouille Bistro &amp; Coffee"><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div><h1>' + t('footerTag') + '</h1>' +
    (TABLE ? '<p class="table-welcome">' + t('welcome1') + ' ' + t('welcome2', { n: TABLE }) + ' ' + t('whatToday') + '</p>' : '') + '<p class="hero-qr">' + t('heroQR') + '</p>' +
    '<div class="hero-actions"><button type="button" class="btn btn-primary" data-act="scroll" data-t="menu">' + t('makeOrder') + '</button><button type="button" class="btn btn-secondary" data-act="scroll" data-t="book">' + t('bookTable') + '</button></div></div></div></section>';
}
function webMenu() {
  const list = filtered(S.cat), idx = CATS.indexOf(S.cat);
  let h = '<section class="web-menu-section" id="sec-menu"><div class="web-container"><div class="web-section-heading"><p class="eyebrow">' + t('catKick_' + S.cat) + '</p><h2>' + t('navMenu') + '</h2><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div><p>' + t('filterHelp') + '</p></div>';
  h += '<div class="web-menu-layout"><div class="web-menu-main"><div class="web-category-tabs" role="tablist">' + CATS.map((c, i) => '<button type="button" role="tab" class="' + (c === S.cat ? 'active' : '') + (filtered(c).length ? '' : ' no-results') + '" data-act="cat" data-c="' + c + '"><small>0' + (i + 1) + '</small>' + esc(tabLabel(c)) + '</button>').join('') + '</div>';
  h += '<div class="web-filter-row">' + filterChips() + '<span>' + t('legend') + '</span></div>' + filterCount();
  h += '<div class="web-category-title"><span>0' + (idx + 1) + '</span><div><h3>' + t('cat_' + S.cat) + '</h3></div></div>';
  if (S.fg) h += glutenWarning();
  h += list.length ? '<div class="web-dish-grid">' + list.map(dishCard).join('') + '</div>' : emptyFilter();
  h += '</div><aside class="web-cart-column" id="cartCol">' + (S.drawer ? '' : webOrderPanel(false)) + '</aside></div></div></section>';
  return h;
}
function webEvents() {
  return '<section class="web-events" id="sec-events"><div class="web-container"><div class="web-section-heading"><p class="eyebrow">LIVE</p><h2>' + t('eventsTitle') + '</h2><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div><p>' + t('eventsLead') + '</p></div><div class="web-event-grid">' + EVENTS.map(eventCard).join('') + '</div></div></section>';
}
function webBook() {
  return '<section class="web-reservations" id="sec-book"><div class="web-container web-reservation-grid"><div class="web-reservation-copy"><p class="eyebrow light">' + t('bookFooter').split('·')[0] + '</p><h2>' + t('bookTitle') + '</h2><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div><p>' + t('bookIntro') + '</p><img src="img/rat.png" alt=""></div>' +
    '<div class="web-reservation-form"><div class="reservation-stripe">' + t('bookFooter') + '</div>' + reservationForm(true) + '</div></div></section>';
}
function webPlace() {
  return '<section class="web-location" id="sec-place"><div class="web-container web-location-grid"><div><p class="eyebrow">' + t('address').toUpperCase() + '</p><h2>' + t('placeTitle') + '</h2><div class="ornament" aria-hidden="true"><span></span><b>❖</b><span></span></div>' + contactCard(true) +
    '<div class="web-hours"><h3 style="color:var(--burgundy);font:700 19px var(--serif);margin:0 0 10px">' + t('hours') + '</h3>' + hoursRows() + '</div></div>' + mapBlock(true) + '</div></section>';
}
function webFooter() {
  return '<footer class="web-footer"><div class="web-container web-footer-grid"><div class="footer-brand"><img src="img/logo.png" alt="Ratatouille"><p><em>' + t('footerBye') + '</em></p></div>' +
    '<div><h3>' + t('address') + '</h3><p>' + esc(RESTO.address) + '</p></div>' +
    '<div><h3>' + t('hoursContact') + '</h3>' + [HOURS.weekday, HOURS.sat, HOURS.sun].map((r) => '<p>' + t(r.key) + ': ' + hhmm(r.open) + '–' + hhmm(r.close) + '</p>').join('') + '<p>' + esc(RESTO.phone) + '</p><p>' + esc(RESTO.email) + '</p><p>' + esc(RESTO.instagram) + '</p></div>' +
    '<div class="footer-acad"><h3>' + t('projectTitle') + '</h3><p><b>' + t('acadTitle') + '</b> ' + t('acad') + '</p></div></div>' +
    '<div class="footer-bottom">' + t('rights') + '</div></footer>';
}
function webFlowModal() {
  if (!S.flow) return '';
  const inner = S.screen === 'confirmed' ? confirmedView() : payView();
  return '<div class="web-payment-backdrop" data-act="closeFlow"><div class="web-payment-modal" role="dialog" aria-modal="true"><div style="text-align:right"><button type="button" class="drawer-close" style="margin-left:auto" data-act="closeFlow" aria-label="' + t('close') + '">' + icon('x') + '</button></div>' + inner + '</div></div>';
}
function renderWeb() {
  return '<div class="web-site">' + webHeader() + webHero() + webMenu() + webPlace() + webEvents() + webBook() + webFooter() + '</div>' +
    (S.web && !S.drawer ? '<button type="button" class="tablet-cart-fab" data-act="drawer">' + icon('bag') + t('myOrder') + ' <b>' + cartCount() + '</b></button>' : '') +
    (S.drawer ? '<div class="web-drawer-backdrop" data-act="closeDrawer"><div class="web-drawer">' + webOrderPanel(true) + '</div></div>' : '');
}

/* ---------- Panel de despacho (/despacho, siempre en español, para cocina y repartidores) ---------- */
const TYPE_ES = { mesa: 'EN MESA', retiro: 'RETIRO', delivery: 'DELIVERY' };
const PM_ES = { cash: 'Efectivo', transfer: 'Transferencia', mercadopago: 'Mercado Pago', paypal: 'PayPal', pix: 'Pix', wero: 'Wero', alipay: 'Alipay', wechat: 'WeChat Pay', app: 'App de delivery' };
const ST_ES = { paid: 'PAGADO', collect: 'A COBRAR', verify: 'VERIFICAR TRANSFERENCIA' };
function renderKitchen() {
  seedOrders();
  const all = (getOrders() || []).filter((o) => o.status !== 'done');
  const high = all.filter((o) => o.type === 'delivery'), normal = all.filter((o) => o.type !== 'delivery');
  let list = S.kFilter === 'high' ? high : S.kFilter === 'normal' ? normal : all;
  list = list.slice().sort((a, b) => b.ts - a.ts);   // la comanda más nueva primero
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const card = (o) => {
    const pri = o.type === 'delivery';
    const cur = o.cur || 'ARS';
    const totalOrder = fmtMoney(conv(o.totalARS, cur), cur, 'es');
    const method = o.method === 'cash' ? 'EFECTIVO · ' + cur : PM_ES[o.method];
    return '<article class="order-card ' + (pri ? 'priority ' : '') + (o.status === 'ready' ? 'ready' : '') + '"><div class="order-card-head"><span><small>' + (o.table ? 'MESA ' + o.table : TYPE_ES[o.type]) + '</small><strong>#' + o.num + '</strong></span><span class="type-badge ' + (pri ? 'high' : 'normal') + '">' + (pri ? 'DELIVERY' : 'LOCAL') + '</span></div>' +
      '<div class="order-payment"><span>' + esc(method) + '</span><span class="payment-status ' + o.payStatus + '">' + ST_ES[o.payStatus] + '</span></div>' +
      '<h2>#' + o.num + ' – ' + esc(o.name) + '</h2><p class="order-type">' + TYPE_ES[o.type] + '</p><div class="order-items">' + o.items.map((i) => '<p><b>' + i.q + '×</b> ' + esc(i.n) + (i.o ? '<br><small>' + esc(i.o) + '</small>' : '') + '</p>').join('') + '</div>' +
      (o.notes ? '<div class="order-note"><b>ACLARACIONES</b><span>' + esc(o.notes) + '</span></div>' : '') +
      '<div class="order-total"><span>TOTAL</span><strong>' + esc(totalOrder) + '</strong>' + (cur !== 'ARS' ? '<small>' + esc(fmtMoney(o.totalARS, 'ARS', 'es')) + ' ARS</small>' : '') + '</div>' +
      (o.status === 'ready' ? '<button type="button" class="btn btn-green" data-act="kdone" data-id="' + o.id + '">LISTO PARA ENTREGAR (CLICK PARA ARCHIVAR)</button>' : '<button type="button" class="btn btn-primary" data-act="kready" data-id="' + o.id + '">EN PREPARACIÓN (MARCAR LISTO)</button>') + '</article>';
  };
  return '<div class="kitchen"><header class="kitchen-header"><div class="kitchen-brand"><img src="img/rat.png" alt=""><span><b>Ratatouille</b><small>BISTRO &amp; COFFEE</small></span></div>' +
    '<div class="kitchen-title"><p>⚜ PERSONAL ⚜</p><h1>Panel de Despacho &amp; Repartidores <i>❖</i></h1><p class="kitchen-sub">Control de pedidos en tiempo real para cadetes y apps de delivery.</p></div><a class="exit-kitchen" href="./">' + icon('back') + 'Salir</a></header>' +
    '<main class="kitchen-main"><div class="kitchen-toolbar"><div class="kitchen-summary"><b>' + all.length + '</b><span>PEDIDOS<br>PENDIENTES</span></div><div class="filters">' +
    '<button type="button" class="' + (S.kFilter === 'all' ? 'active' : '') + '" data-act="kf" data-v="all">Todos<b>' + all.length + '</b></button>' +
    '<button type="button" class="high ' + (S.kFilter === 'high' ? 'active' : '') + '" data-act="kf" data-v="high">Prioridad Alta: Apps Delivery<b>' + high.length + '</b></button>' +
    '<button type="button" class="normal ' + (S.kFilter === 'normal' ? 'active' : '') + '" data-act="kf" data-v="normal">Normal: Retiro / En Mesa<b>' + normal.length + '</b></button></div><span class="updated">Actualizado ' + hh + '</span></div>' +
    (list.length ? '<div class="order-grid">' + list.map(card).join('') + '</div>' : '<div class="kitchen-empty"><img src="img/rat.png" alt=""><h2>No hay pedidos pendientes en cocina.</h2></div>') + '</main></div>';
}

function filterCount() {
  const n = filtered(S.cat).length;
  return '<p class="filter-count" aria-live="polite">' + t(n === 1 ? 'showingOne' : 'showing', { n: n }) + '</p>';
}

function suggestBar() {
  if (!S.suggest) return '';
  return '<div class="cur-suggest" role="status"><span>' + t('sugText', { word: curWord(S.suggest), cur: S.suggest }) + '</span><div><button type="button" class="btn btn-primary small" data-act="sugChange">' + t('sugChange') + '</button><button type="button" class="btn btn-secondary small" data-act="sugKeep">' + t('sugKeep') + '</button></div></div>';
}

function startDetail() {
  S.pay.stage = 'detail';
  S.pay.expired = false;
  S.pay.deadline = TIMER_SECS[S.pay.m] ? Date.now() + TIMER_SECS[S.pay.m] * 1000 : null;
}

function openSheet(id, edit) {
  const d = getDish(id);
  S.sheet = { id, opt: null, qty: d.kind === 'macaron' ? 5 : 1, step: 1, seq: [], mer: { coffee: null, cro: null, flavors: [] }, edit: edit ? edit.key : null };
  if (edit && edit.kind === 'macaron') { S.sheet.qty = edit.mq; edit.flavors.forEach((n, i) => { for (let k = 0; k < n; k++) S.sheet.seq.push(i); }); }
  if (edit && edit.kind === 'merienda') { S.sheet.mer = JSON.parse(JSON.stringify(edit.mer)); S.sheet.step = 3; }
  render();
}

/* ---------- Render principal ---------- */
let animNext = true; // las animaciones solo se repiten al cambiar de pantalla, categoría o filtro
function render() {
  document.documentElement.lang = { es: 'es-AR', en: 'en', zh: 'zh-CN', de: 'de', pt: 'pt-BR' }[S.lang];
  document.title = 'Ratatouille Bistro & Coffee · ' + (S.screen === 'kitchen' ? t('staffTitle') : t('navMenu'));
  const app = document.getElementById('app');
  const y = window.scrollY;
  let h;
  if (S.screen === 'kitchen') h = renderKitchen();
  else if (S.web) h = renderWeb() + webFlowModal();
  else if (S.screen === 'welcome') h = '<div class="app-shell">' + mWelcome() + '</div>';
  else {
    let body;
    if (S.screen === 'menu') body = mMenu();
    else if (S.screen === 'cart') body = mCart();
    else if (S.screen === 'book') body = mBook();
    else if (S.screen === 'events') body = mEvents();
    else if (S.screen === 'place') body = mPlace();
    else if (S.screen === 'pay') body = '<div class="content">' + payView() + '</div>';
    else if (S.screen === 'confirmed') body = '<div class="content">' + confirmedView() + '</div>';
    const tone = { book: 'reservations-screen', events: 'events-screen', pay: 'payment-flow-screen', confirmed: 'confirmed-screen' }[S.screen] || '';
    h = '<div class="app-shell">' + mHeader() + '<div class="screen ' + tone + '">' + body + '</div>' + mNav() + '</div>';
  }
  h += sheetView() + prefsSheet() + suggestBar();
  app.className = animNext ? '' : 'noanim';
  animNext = false;
  app.innerHTML = h;
  window.scrollTo(0, y);
}

/* ---------- Acciones ---------- */
function setCur(c) { S.cur = c; S.suggest = null; store.set('rata_cur', c); render(); }
function setLang(l) {
  S.lang = l; store.set('rata_lang', l);
  // Idioma y moneda son independientes: al cambiar de idioma se ofrece la moneda de ese país
  S.suggest = CUR_OF_LANG[l] !== S.cur ? CUR_OF_LANG[l] : null;
  render();
  if (S.suggest) { const mine = S.suggest; setTimeout(() => { if (S.suggest === mine) { S.suggest = null; const el = document.querySelector('.cur-suggest'); if (el) el.remove(); } }, 15000); }
}
function sheetAdd() {
  const sh = S.sheet, d = getDish(sh.id);
  let entry;
  if (d.kind === 'macaron') {
    const counts = [0, 0, 0, 0, 0]; sh.seq.forEach((i) => counts[i]++);
    entry = { id: d.id, kind: 'macaron', opt: null, qty: 1, mq: sh.qty, flavors: counts, unit: mcPrice(sh.qty) };
  } else if (d.kind === 'merienda') {
    entry = { id: d.id, kind: 'merienda', opt: null, qty: 1, mer: JSON.parse(JSON.stringify(sh.mer)), unit: d.price };
  } else entry = { id: d.id, kind: null, opt: sh.opt, qty: sh.qty, unit: d.price };
  if (sh.edit) {                       // "Editar sabores" / "Editar merienda": reemplaza el ítem del carrito
    const i = S.cart.findIndex((x) => x.key === sh.edit);
    if (i >= 0) S.cart[i] = Object.assign({ key: sh.edit }, entry);
  } else addToCart(entry);
  S.sheet = null; render();
}
function quickAdd(id) {
  const d = getDish(id);
  if (d.opts || d.kind === 'macaron' || d.kind === 'merienda') openSheet(id);
  else { addToCart({ id, kind: null, opt: null, qty: 1, unit: d.price }); animNext = false; render(); }
}
function confirmOrder() {
  S.err = null;
  S.form.name = (document.getElementById('fName') || { value: S.form.name }).value;
  if (!S.cart.length) { S.err = 'needItems'; return render(); }
  if (!S.form.name.trim()) { S.err = 'needName'; return render(); }
  if (isDelivery()) {                       // el pago se hace en la app de delivery
    S.pay = { m: 'app', stage: 'result', result: 'plain' };
    createOrder('app', 'paid');
    return openFlow();
  }
  const m = S.form.method;
  if (!m) { S.err = 'needMethod'; return render(); }
  if (m === 'cash') {
    S.pay = { m: 'cash', stage: 'result', result: 'collect' };
    createOrder('cash', 'collect');
  } else if (m === 'mercadopago' || m === 'paypal') {
    S.pay = { m: m, stage: 'redirect' };
    setTimeout(() => { if (S.pay && S.pay.stage === 'redirect') { startDetail(); render(); } }, 1400);
  } else { S.pay = { m: m, stage: 'detail' }; startDetail(); }
  openFlow();
}
function openFlow() {
  if (S.web) { S.drawer = false; S.flow = true; } else S.screen = 'pay';
  render();
}
function payGo(outcome) {
  S.pay.stage = 'processing'; render();
  setTimeout(() => {
    if (!S.pay) return;
    S.pay.stage = 'result'; S.pay.result = outcome;
    if (outcome === 'ok') createOrder(S.pay.m, 'paid');
    else if (outcome === 'pending') createOrder(S.pay.m, 'verify');
    render();
  }, 1300);
}
function closeFlow() {
  const done = S.pay && S.pay.stage === 'result' && S.pay.result !== 'declined';
  S.flow = false; if (done || S.screen === 'confirmed') S.screen = 'menu'; S.pay = null; render();
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const a = el.getAttribute('data-act');
  // Los fondos oscuros solo cierran si se toca el fondo, no el contenido
  if (el.classList.contains('modal-backdrop') || el.classList.contains('web-drawer-backdrop') || el.classList.contains('web-payment-backdrop')) {
    if (e.target !== el) return;
  }
  const v = el.getAttribute('data-v'), id = el.getAttribute('data-id'), k = el.getAttribute('data-k');
  if (['go', 'cat', 'catGo', 'filter', 'open', 'add', 'mstep', 'mnext', 'prefs', 'newOrder', 'seeStatus'].indexOf(a) >= 0) animNext = true;
  switch (a) {
    case 'go':
      S.err = null;
      S.screen = el.getAttribute('data-s'); window.scrollTo(0, 0); return render();
    case 'goBook':
      if (S.web) { render(); return document.getElementById('sec-book').scrollIntoView({ behavior: 'smooth' }); }
      S.screen = 'book'; window.scrollTo(0, 0); return render();
    case 'prefs': S.prefs = true; return render();
    case 'closePrefs': S.prefs = false; return render();
    case 'lang': return setLang(v);
    case 'cur': return setCur(v);
    case 'cat': S.cat = el.getAttribute('data-c'); return render();
    case 'catGo': S.cat = el.getAttribute('data-c'); render(); return document.getElementById('sec-menu').scrollIntoView({ behavior: 'smooth' });
    case 'filter': {
      const f = el.getAttribute('data-f');
      if (f === 'all') { S.fv = false; S.fg = false; } else if (f === 'veggie') S.fv = !S.fv; else S.fg = !S.fg;
      return render();
    }
    case 'otherCat': { const c = CATS.find((x) => filtered(x).length); if (c) S.cat = c; return render(); }
    case 'open': return openSheet(id);
    case 'editItem': { const it = S.cart.find((x) => String(x.key) === k); if (it) { S.drawer = false; return openSheet(it.id, it); } return; }
    case 'add': return quickAdd(id);
    case 'closeSheet': S.sheet = null; return render();
    case 'sopt': S.sheet.opt = +v; return render();
    case 'sqty': S.sheet.qty = Math.max(1, S.sheet.qty + (+v)); return render();
    case 'sadd': return sheetAdd();
    case 'mqty': { const sh = S.sheet; sh.qty = Math.min(20, Math.max(1, sh.qty + (+v))); if (sh.seq.length > sh.qty) sh.seq.length = sh.qty; return render(); }
    case 'mbox': { const sh = S.sheet; sh.qty = 5; if (sh.seq.length > 5) sh.seq.length = 5; return render(); }
    case 'mflav': {
      const sh = S.sheet, i = +el.getAttribute('data-i');
      if (+v > 0) { if (sh.seq.length < sh.qty) sh.seq.push(i); } else { const p = sh.seq.lastIndexOf(i); if (p >= 0) sh.seq.splice(p, 1); }
      return render();
    }
    case 'msurprise': { const sh = S.sheet; while (sh.seq.length < sh.qty) sh.seq.push(Math.floor(Math.random() * FLAVORS.length)); return render(); }
    case 'mstep': S.sheet.step = +v; return render();
    case 'mnext': S.sheet.step += 1; return render();
    case 'mcof': S.sheet.mer.coffee = v; return render();
    case 'mcro': S.sheet.mer.cro = +v; return render();
    case 'mmac': {
      const i = +el.getAttribute('data-i'), fl = S.sheet.mer.flavors;
      if (+v > 0) { if (fl.length < 2) fl.push(i); } else { const p = fl.indexOf(i); if (p >= 0) fl.splice(p, 1); }
      return render();
    }
    case 'inc': { const it = S.cart.find((x) => String(x.key) === k); if (it) it.qty++; return render(); }
    case 'dec': { const it = S.cart.find((x) => String(x.key) === k); if (it && it.qty > 1) it.qty--; return render(); }
    case 'del': S.cart = S.cart.filter((x) => String(x.key) !== k); return render();
    case 'type': S.form.type = v; return render();
    case 'method': S.form.method = el.getAttribute('data-m'); return render();
    case 'payMore': S.form.showAll = !S.form.showAll; return render();
    case 'payRetry': startDetail(); S.pay.stage = 'detail'; return render();
    case 'sugChange': S.cur = S.suggest; S.suggest = null; store.set('rata_cur', S.cur); return render();
    case 'sugKeep': S.suggest = null; return render();
    case 'confirm': return confirmOrder();
    case 'payGo': return payGo(el.getAttribute('data-o'));
    case 'payBack': S.pay = null; if (S.web) { S.flow = false; S.drawer = false; } else S.screen = 'cart'; return render();
    case 'copy': if (navigator.clipboard) navigator.clipboard.writeText(v).catch(() => {}); el.textContent = t('copied'); return;
    case 'seeStatus': if (S.web) { S.screen = 'confirmed'; S.flow = true; } else S.screen = 'confirmed'; S.pay = null; return render();
    case 'newOrder': S.flow = false; S.screen = 'menu'; S.pay = null; window.scrollTo(0, 0); return render();
    case 'closeFlow': return closeFlow();
    case 'drawer': S.drawer = true; return render();
    case 'closeDrawer': S.drawer = false; return render();
    case 'top': return window.scrollTo({ top: 0, behavior: 'smooth' });
    case 'scroll': { const s = document.getElementById('sec-' + el.getAttribute('data-t')); if (s) s.scrollIntoView({ behavior: 'smooth' }); return; }
    case 'rdate': S.res.date = v; S.res.done = null; return render();
    case 'rfranja': S.res.franja = v; S.res.time = null; S.res.done = null; return render();
    case 'rtime': S.res.time = +v; S.res.done = null; return render();
    case 'rserv': S.res.service = v; return render();
    case 'rpeople': S.res.people = Math.min(20, Math.max(1, S.res.people + (+v))); return render();
    case 'rconfirm': {
      S.res.name = (document.getElementById('rName') || { value: S.res.name }).value;
      S.res.err = !S.res.name.trim() || S.res.time == null;
      S.res.done = null;
      if (!S.res.err) {
        S.res.done = { date: S.res.date, time: S.res.time, people: S.res.people, service: S.res.service };
        const all = store.get('rata_res', []); all.push(Object.assign({ name: S.res.name.trim(), ts: Date.now() }, S.res.done)); store.set('rata_res', all);
      }
      return render();
    }
    case 'kf': S.kFilter = v; return render();
    case 'kready': { const all = getOrders() || []; const o = all.find((x) => x.id === id); if (o) o.status = 'ready'; saveOrders(all); return render(); }
    case 'kdone': { const all = getOrders() || []; const o = all.find((x) => x.id === id); if (o) o.status = 'done'; saveOrders(all); return render(); }
  }
});

// Campos de texto: se guardan sin volver a dibujar (para no perder el foco)
document.addEventListener('input', (e) => {
  const id = e.target.id;
  if (id === 'fName') S.form.name = e.target.value;
  else if (id === 'fNotes') S.form.notes = e.target.value;
  else if (id === 'cashIn') {
    S.form.cash = e.target.value;
    const out = document.getElementById('chg');
    if (out) out.textContent = cashChangeText();
  } else if (id === 'rName') S.res.name = e.target.value;
});
document.addEventListener('change', (e) => {
  const sel = e.target.getAttribute && e.target.getAttribute('data-sel');
  if (sel === 'lang') setLang(e.target.value);
  else if (sel === 'cur') setCur(e.target.value);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if (S.sheet) S.sheet = null; else if (S.prefs) S.prefs = false; else if (S.drawer) S.drawer = false; else if (S.flow) return closeFlow(); else return; render(); }
});
mqWeb.addEventListener('change', (e) => { S.web = e.matches; S.drawer = false; S.flow = false; if (!S.web && S.screen === 'confirmed') S.screen = 'confirmed'; render(); });

// Panel de cocina y estado del pedido: se actualizan solos
setInterval(() => {
  if (S.screen === 'kitchen' && !document.activeElement.matches('input,textarea')) render();
  else if (S.screen === 'confirmed' || (S.flow && S.screen === 'confirmed')) {
    const o = lastOrderLive(); if (o && o.status !== S.lastOrder.status) { S.lastOrder = o; render(); }
  }
}, 4000);
window.addEventListener('storage', () => { if (S.screen === 'kitchen' || S.screen === 'confirmed') render(); });

// Cuenta regresiva de Pix, Alipay y WeChat Pay
setInterval(() => {
  if (!S.pay || S.pay.stage !== 'detail' || !S.pay.deadline) return;
  const left = Math.round((S.pay.deadline - Date.now()) / 1000);
  if (left <= 0) { S.pay.stage = 'result'; S.pay.result = 'declined'; S.pay.expired = true; return render(); }
  const el = document.getElementById('payTimer'); if (el) el.textContent = fmtTimer(left);
}, 1000);

// En /despacho se abre directamente el panel; en computadora, el sitio; en celular, la bienvenida
if (window.RATA_DESPACHO) S.screen = 'kitchen';
else if (S.web) S.screen = 'menu';
render();
