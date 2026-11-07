/* data.js — Datos del Menú Ágil Ratatouille (todos los datos son ficticios, salvo la carta).
 * Idiomas, en este orden: es (Argentina), en, zh, de, pt (Brasil).
 * Los precios están en pesos argentinos (ARS), tal como figuran en la carta oficial.
 */
'use strict';

const LANGS = ['es', 'en', 'zh', 'de', 'pt'];
const LANG_LABEL = { es: 'ES', en: 'EN', zh: '中文', de: 'DE', pt: 'PT' };
const LANG_NAME = { es: 'Español', en: 'English', zh: '中文 (简体)', de: 'Deutsch', pt: 'Português' };
const LOCALE = { es: 'es-AR', en: 'en-US', zh: 'zh-CN', de: 'de-DE', pt: 'pt-BR' };

// Cotizaciones de referencia FIJAS (pesos argentinos por 1 unidad). Es un prototipo: no se consulta ninguna cotización en vivo.
// Se pueden editar acá.
const CURRENCIES = ['ARS', 'USD', 'BRL', 'EUR', 'CNY'];
const RATES = { ARS: 1, USD: 1400, BRL: 260, EUR: 1600, CNY: 195 };
const SYMBOL = { ARS: '$', USD: 'US$', BRL: 'R$', EUR: '€', CNY: 'CN¥' };
const CUR_FULL = { ARS: 'Peso argentino', USD: 'US Dollar', BRL: 'Real brasileiro', EUR: 'Euro', CNY: '人民币' };
// Moneda que se sugiere al cambiar de idioma
const CUR_OF_LANG = { es: 'ARS', en: 'USD', pt: 'BRL', de: 'EUR', zh: 'CNY' };
// Orden en que se muestran los idiomas en los selectores
const LANG_ORDER = ['es', 'en', 'pt', 'de', 'zh'];
// Nombre de la moneda dentro de una frase, por idioma
const CUR_WORD = {
  ARS: { es: 'pesos', en: 'pesos', zh: '阿根廷比索', de: 'Pesos', pt: 'pesos' },
  USD: { es: 'dólares', en: 'US dollars', zh: '美元', de: 'US-Dollar', pt: 'dólares' },
  BRL: { es: 'reales', en: 'reais', zh: '巴西雷亚尔', de: 'Real', pt: 'reais' },
  EUR: { es: 'euros', en: 'euros', zh: '欧元', de: 'Euro', pt: 'euros' },
  CNY: { es: 'yuanes', en: 'yuan', zh: '人民币', de: 'Yuan', pt: 'yuans' }
};
// Cada moneda tiene su billetera y el efectivo (todos los pagos son simulados)
const METHODS_BY_CUR = {
  ARS: ['cash', 'transfer', 'mercadopago'],
  USD: ['cash', 'paypal'],
  BRL: ['cash', 'pix'],
  EUR: ['cash', 'wero'],
  CNY: ['cash', 'alipay', 'wechat']
};
const ALL_METHODS = ['cash', 'transfer', 'mercadopago', 'paypal', 'pix', 'wero', 'alipay', 'wechat'];
// Moneda en la que cobra cada método (el efectivo cobra en la moneda elegida)
const METHOD_CUR = { cash: null, transfer: 'ARS', mercadopago: 'ARS', paypal: 'USD', pix: 'BRL', wero: 'EUR', alipay: 'CNY', wechat: 'CNY' };

// ---------- Textos de la interfaz ----------
const UI = {};
const U = (k, es, en, zh, de, pt) => { UI[k] = { es, en, zh, de, pt }; };

U('menuAgil', 'MENÚ ÁGIL · MESA', 'SMART MENU · TABLE', '智能菜单 · 桌号', 'SMARTE KARTE · TISCH', 'CARDÁPIO ÁGIL · MESA');
U('bonjour', 'BONJOUR', 'BONJOUR', '您好 BONJOUR', 'BONJOUR', 'BONJOUR');
U('welcome1', '¡Bienvenido a', 'Welcome to', '欢迎来到', 'Willkommen an', 'Bem-vindo à');
U('welcome2', 'la mesa {n}!', 'table {n}!', '{n} 号桌！', 'Tisch {n}!', 'mesa {n}!');
U('whatToday', '¿Qué te preparamos hoy?', 'What can we get you today?', '今天想吃点什么？', 'Was dürfen wir Ihnen heute zubereiten?', 'O que podemos preparar hoje?');
U('intro1', 'Cocina casera, café de especialidad', 'Home cooking, specialty coffee', '家常美食、精品咖啡', 'Hausmannskost, Spezialitätenkaffee', 'Comida caseira, café especial');
U('intro2', 'y buena mesa.', 'and a great table.', '与美好的用餐时光。', 'und ein guter Tisch.', 'e uma ótima mesa.');
U('makeOrder', 'Hacer un pedido', 'Place an order', '点餐', 'Bestellen', 'Fazer um pedido');
U('bookTable', 'Reservar mesa', 'Book a table', '预订餐桌', 'Tisch reservieren', 'Reservar mesa');
U('staff', 'Acceso del personal', 'Staff access', '员工入口', 'Zugang für Personal', 'Acesso da equipe');
U('navMenu', 'Carta', 'Menu', '菜单', 'Karte', 'Cardápio');
U('navOrder', 'Pedido', 'Order', '订单', 'Bestellung', 'Pedido');
U('navBook', 'Reservas', 'Bookings', '预订', 'Reservierung', 'Reservas');
U('navEvents', 'Eventos', 'Events', '活动', 'Events', 'Eventos');
U('navPlace', 'Ubicación', 'Location', '位置', 'Standort', 'Local');
U('navLive', 'Música en vivo', 'Live music', '现场音乐', 'Live-Musik', 'Música ao vivo');
U('cat_ent', 'Entradas', 'Starters', '前菜', 'Vorspeisen', 'Entradas');
U('cat_pri', 'Principales', 'Main courses', '主菜', 'Hauptgerichte', 'Pratos principais');
U('cat_pos', 'Postres', 'Desserts', '甜点', 'Desserts', 'Sobremesas');
U('cat_caf', 'Cafetería', 'Café', '咖啡馆', 'Café', 'Cafeteria');
U('catKick_ent', 'LA CARTA · SALADOS', 'THE MENU · SAVORY', '菜单 · 咸食', 'DIE KARTE · HERZHAFT', 'O CARDÁPIO · SALGADOS');
U('catKick_pri', 'LA CARTA · SALADOS', 'THE MENU · SAVORY', '菜单 · 咸食', 'DIE KARTE · HERZHAFT', 'O CARDÁPIO · SALGADOS');
U('catKick_pos', 'LA CARTA · DULCES Y CAFÉ', 'THE MENU · SWEETS & COFFEE', '菜单 · 甜点与咖啡', 'DIE KARTE · SÜSSES & KAFFEE', 'O CARDÁPIO · DOCES E CAFÉ');
U('catKick_caf', 'LA CARTA · DULCES Y CAFÉ', 'THE MENU · SWEETS & COFFEE', '菜单 · 甜点与咖啡', 'DIE KARTE · SÜSSES & KAFFEE', 'O CARDÁPIO · DOCES E CAFÉ');
U('fAll', 'Todos', 'All', '全部', 'Alle', 'Todos');
U('fVeggie', 'Veggie', 'Veggie', '素食', 'Vegetarisch', 'Veggie');
U('fGF', 'Sin TACC', 'Gluten-free', '无麸质', 'Glutenfrei', 'Sem glúten');
U('bVeggie', 'VEGGIE', 'VEGGIE', '素食', 'VEGGIE', 'VEGGIE');
U('bGF', 'SIN TACC', 'GLUTEN-FREE', '无麸质', 'GLUTENFREI', 'SEM GLÚTEN');
U('filterHelp', 'Filtrá la carta por restricción alimentaria.', 'Filter the menu by dietary restriction.', '按饮食限制筛选菜单。', 'Filtern Sie die Karte nach Ernährungsform.', 'Filtre o cardápio por restrição alimentar.');
U('careTitle', 'Cuidamos tu mesa', 'We take care of your table', '我们用心照顾您的餐桌', 'Wir sorgen für Ihren Tisch', 'Cuidamos da sua mesa');
U('careText', 'Los platos sin TACC se preparan con utensilios y espacio exclusivos. Si tenés alguna alergia o restricción, avisanos al hacer tu pedido desde el QR o al personal.',
  'Gluten-free dishes are prepared with dedicated utensils and space. If you have any allergy or restriction, let us know when ordering from the QR code or tell our staff.',
  '无麸质菜品使用专用器具和专用空间制作。如有任何过敏或饮食限制，请在扫码点餐时告知我们或告诉服务人员。',
  'Glutenfreie Gerichte werden mit eigenen Utensilien und in einem separaten Bereich zubereitet. Bei Allergien oder Einschränkungen sagen Sie uns bitte Bescheid, wenn Sie über den QR-Code bestellen, oder sprechen Sie unser Personal an.',
  'Os pratos sem glúten são preparados com utensílios e espaço exclusivos. Se tiver alguma alergia ou restrição, avise ao fazer o pedido pelo QR ou à equipe.');
U('noResults', 'No hay platos con ese filtro en esta categoría.', 'No dishes match this filter in this category.', '该分类下没有符合此筛选的菜品。', 'In dieser Kategorie gibt es keine Gerichte für diesen Filter.', 'Não há pratos com esse filtro nesta categoria.');
U('seeAll', 'Ver todos los platos', 'See all dishes', '查看全部菜品', 'Alle Gerichte anzeigen', 'Ver todos os pratos');
U('legend', 'VEGGIE Sin carne ni pescado · SIN TACC Apto celíacos', 'VEGGIE No meat or fish · GLUTEN-FREE Suitable for coeliacs', '素食：不含肉和鱼 · 无麸质：适合乳糜泻患者', 'VEGGIE Ohne Fleisch und Fisch · GLUTENFREI Für Zöliakie geeignet', 'VEGGIE Sem carne nem peixe · SEM GLÚTEN Indicado para celíacos');
U('add', 'Agregar', 'Add', '添加', 'Hinzufügen', 'Adicionar');
U('choose', 'Elegir', 'Choose', '选择', 'Wählen', 'Escolher');
U('featured', 'NUESTRO PLATO INSIGNIA', 'OUR SIGNATURE DISH', '招牌菜', 'UNSER SIGNATURGERICHT', 'NOSSO PRATO ESTRELA');
U('qrBanner', 'ESCANEÁ EL QR DE TU MESA Y PEDÍ DESDE EL CELULAR', "SCAN YOUR TABLE'S QR CODE AND ORDER FROM YOUR PHONE", '扫描餐桌二维码，用手机点餐', 'SCANNEN SIE DEN QR-CODE IHRES TISCHES UND BESTELLEN SIE PER HANDY', 'ESCANEIE O QR DA SUA MESA E PEÇA PELO CELULAR');
U('addedToast', 'Agregado a tu pedido', 'Added to your order', '已加入订单', 'Zur Bestellung hinzugefügt', 'Adicionado ao seu pedido');
U('yourOrder', 'Tu pedido', 'Your order', '您的订单', 'Ihre Bestellung', 'Seu pedido');
U('emptyTitle', 'Tu pedido está vacío', 'Your order is empty', '您的订单是空的', 'Ihre Bestellung ist leer', 'Seu pedido está vazio');
U('emptyText', 'Todavía no agregaste platos. Elegilos de la carta.', "You haven't added any dishes yet. Choose them from the menu.", '您还没有添加菜品，请从菜单中选择。', 'Sie haben noch keine Gerichte hinzugefügt. Wählen Sie sie aus der Karte.', 'Você ainda não adicionou pratos. Escolha no cardápio.');
U('seeMenu', 'Ver la carta', 'View the menu', '查看菜单', 'Karte ansehen', 'Ver o cardápio');
U('remove', 'Quitar', 'Remove', '移除', 'Entfernen', 'Remover');
U('total', 'Total', 'Total', '合计', 'Gesamt', 'Total');
U('name', 'Nombre', 'Name', '姓名', 'Name', 'Nome');
U('yourName', 'Tu nombre', 'Your name', '您的姓名', 'Ihr Name', 'Seu nome');
U('orderType', 'Tipo de pedido', 'Order type', '订单类型', 'Bestellart', 'Tipo de pedido');
U('atTable', 'En la mesa', 'At the table', '堂食', 'Am Tisch', 'Na mesa');
U('takeaway', 'Para retirar', 'Takeaway', '自取', 'Zum Mitnehmen', 'Para retirar');
U('delivery', 'Delivery (PedidosYa / Rappi)', 'Delivery (PedidosYa / Rappi)', '外卖 (PedidosYa / Rappi)', 'Lieferung (PedidosYa / Rappi)', 'Delivery (PedidosYa / Rappi)');
U('deliveryShort', 'Delivery', 'Delivery', '外卖', 'Lieferung', 'Delivery');
U('notes', 'Aclaraciones', 'Special requests', '备注', 'Besondere Wünsche', 'Observações');
U('notesPh', 'Sin cebolla, alergias, etc.', 'No onions, allergies, etc.', '不要洋葱、过敏信息等', 'Ohne Zwiebeln, Allergien usw.', 'Sem cebola, alergias etc.');
U('payTitle', 'Medio de pago', 'Payment method', '支付方式', 'Zahlungsart', 'Forma de pagamento');
U('paySim', 'Pago simulado: no se procesa dinero real.', 'Simulated payment: no real money is processed.', '模拟支付：不会处理真实资金。', 'Simulierte Zahlung: Es wird kein echtes Geld verarbeitet.', 'Pagamento simulado: nenhum dinheiro real é processado.');
U('chargeNote', 'El cobro se realiza en pesos argentinos: {amt}. Los precios en {cur} son una referencia.', 'You are charged in Argentine pesos: {amt}. Prices in {cur} are for reference only.', '实际以阿根廷比索收款：{amt}。{cur} 价格仅供参考。', 'Abgerechnet wird in argentinischen Pesos: {amt}. Preise in {cur} dienen nur als Orientierung.', 'A cobrança é feita em pesos argentinos: {amt}. Os preços em {cur} são apenas uma referência.');
U('rate', 'Tasa de referencia ilustrativa: 1 {cur} = {amt} ARS', 'Illustrative reference rate: 1 {cur} = {amt} ARS', '参考汇率（仅作示例）：1 {cur} = {amt} ARS', 'Beispiel-Referenzkurs: 1 {cur} = {amt} ARS', 'Taxa de referência ilustrativa: 1 {cur} = {amt} ARS');
U('confirmOrder', 'Confirmar pedido', 'Confirm order', '确认订单', 'Bestellung bestätigen', 'Confirmar pedido');
U('needItems', 'Agregá al menos un plato a tu pedido.', 'Add at least one dish to your order.', '请至少添加一道菜品。', 'Fügen Sie Ihrer Bestellung mindestens ein Gericht hinzu.', 'Adicione pelo menos um prato ao seu pedido.');
U('needName', 'Escribí tu nombre para confirmar.', 'Enter your name to confirm.', '请填写姓名后确认。', 'Geben Sie zur Bestätigung Ihren Namen ein.', 'Escreva seu nome para confirmar.');
U('needMethod', 'Elegí un medio de pago.', 'Choose a payment method.', '请选择支付方式。', 'Wählen Sie eine Zahlungsart.', 'Escolha uma forma de pagamento.');
U('deliveryNote', 'Delivery: el pedido ingresa a cocina con prioridad alta. El efectivo no está disponible en esta modalidad.', 'Delivery: your order enters the kitchen with high priority. Cash is not available for this option.', '外卖：订单将以高优先级进入厨房。此方式不支持现金支付。', 'Lieferung: Die Bestellung geht mit hoher Priorität in die Küche. Barzahlung ist hier nicht möglich.', 'Delivery: o pedido entra na cozinha com prioridade alta. Dinheiro não está disponível nesta opção.');
// medios de pago
U('pm_cash', 'Efectivo', 'Cash', '现金', 'Bargeld', 'Dinheiro');
U('pm_cash_d', 'Pagás en la mesa o al retirar', 'Pay at the table or on pickup', '在餐桌或取餐时支付', 'Zahlung am Tisch oder bei Abholung', 'Pague na mesa ou na retirada');
U('pm_transfer', 'Transferencia', 'Bank transfer', '银行转账', 'Überweisung', 'Transferência');
U('pm_transfer_d', 'Con comprobante', 'With receipt', '附转账凭证', 'Mit Beleg', 'Com comprovante');
U('pm_card', 'Tarjetas', 'Cards', '银行卡', 'Karten', 'Cartões');
U('pm_card_d', 'Débito o crédito', 'Debit or credit', '借记卡或信用卡', 'Debit- oder Kreditkarte', 'Débito ou crédito');
U('pm_wallet', 'Billetera virtual', 'Digital wallet', '电子钱包', 'Digitale Geldbörse', 'Carteira digital');
U('pm_wallet_d', 'Pagá con tu app', 'Pay with your app', '用您的应用支付', 'Mit Ihrer App zahlen', 'Pague com seu app');
U('pm_pix', 'Pix', 'Pix', 'Pix（巴西）', 'Pix', 'Pix');
U('pm_pix_d', 'Pago instantáneo de Brasil', 'Instant payment from Brazil', '巴西即时支付', 'Sofortzahlung aus Brasilien', 'Pagamento instantâneo do Brasil');
U('pm_giropay', 'Giropay / Wero', 'Giropay / Wero', 'Giropay / Wero（德国）', 'Giropay / Wero', 'Giropay / Wero');
U('pm_giropay_d', 'Banca online de Alemania', 'Online banking from Germany', '德国网上银行', 'Online-Banking aus Deutschland', 'Banco online da Alemanha');
U('pm_alipay', 'Alipay', 'Alipay', '支付宝 Alipay', 'Alipay', 'Alipay');
U('pm_alipay_d', 'Pago con QR desde China', 'QR payment from China', '中国扫码支付', 'QR-Zahlung aus China', 'Pagamento por QR da China');
U('pm_wechat', 'WeChat Pay', 'WeChat Pay', '微信支付 WeChat Pay', 'WeChat Pay', 'WeChat Pay');
U('pm_wechat_d', 'Pago con QR desde China', 'QR payment from China', '中国扫码支付', 'QR-Zahlung aus China', 'Pagamento por QR da China');
U('cashWith', 'Pagás con (ARS)', 'You pay with (ARS)', '支付金额 (ARS)', 'Sie zahlen mit (ARS)', 'Você paga com (ARS)');
U('cashChange', 'Vuelto estimado: {amt}', 'Estimated change: {amt}', '预计找零：{amt}', 'Voraussichtliches Rückgeld: {amt}', 'Troco estimado: {amt}');
U('cashLess', 'El monto es menor al total.', 'The amount is lower than the total.', '金额低于合计。', 'Der Betrag ist niedriger als die Summe.', 'O valor é menor que o total.');
U('back', 'Volver', 'Back', '返回', 'Zurück', 'Voltar');
U('payTotal', 'Total a cobrar', 'Total to pay', '应付总额', 'Zu zahlender Betrag', 'Total a pagar');
U('trTitle', 'Pagar por transferencia', 'Pay by bank transfer', '银行转账支付', 'Per Überweisung zahlen', 'Pagar por transferência');
U('trBank', 'Banco', 'Bank', '银行', 'Bank', 'Banco');
U('trHolder', 'Titular', 'Account holder', '户名', 'Kontoinhaber', 'Titular');
U('trAlias', 'Alias', 'Alias', '别名', 'Alias', 'Alias');
U('trCbu', 'CBU', 'CBU', 'CBU', 'CBU', 'CBU');
U('copy', 'Copiar', 'Copy', '复制', 'Kopieren', 'Copiar');
U('copied', 'Copiado', 'Copied', '已复制', 'Kopiert', 'Copiado');
U('trUpload', 'Adjuntar comprobante (opcional)', 'Attach receipt (optional)', '上传凭证（可选）', 'Beleg anhängen (optional)', 'Anexar comprovante (opcional)');
U('trDone', 'Ya transferí', 'I have transferred', '我已转账', 'Ich habe überwiesen', 'Já transferi');
U('trDemo', 'Datos bancarios ficticios, solo para la demostración.', 'Fictitious bank details, for demonstration only.', '银行信息为虚构，仅用于演示。', 'Fiktive Bankdaten, nur zur Demonstration.', 'Dados bancários fictícios, apenas para demonstração.');
U('cardTitle', 'Pagar con tarjeta', 'Pay by card', '银行卡支付', 'Mit Karte zahlen', 'Pagar com cartão');
U('cardNum', 'Número de tarjeta', 'Card number', '卡号', 'Kartennummer', 'Número do cartão');
U('cardExp', 'Vencimiento', 'Expiry', '有效期', 'Gültig bis', 'Validade');
U('cardCvv', 'Código', 'Security code', '安全码', 'Sicherheitscode', 'Código');
U('cardDemo', 'Tarjeta de prueba: no ingreses datos reales.', 'Test card: do not enter real details.', '测试卡：请勿输入真实信息。', 'Testkarte: Geben Sie keine echten Daten ein.', 'Cartão de teste: não digite dados reais.');
U('pay', 'Pagar', 'Pay', '支付', 'Bezahlen', 'Pagar');
U('walletTitle', 'Billetera virtual', 'Digital wallet', '电子钱包', 'Digitale Geldbörse', 'Carteira digital');
U('walletUser', 'Usuario o teléfono', 'User or phone', '用户名或手机号', 'Benutzer oder Telefon', 'Usuário ou telefone');
U('walletPin', 'Código de la app (simulado)', 'App code (simulated)', '应用密码（模拟）', 'App-Code (simuliert)', 'Código do app (simulado)');
U('qrTitle', 'Escaneá el código con tu app', 'Scan the code with your app', '请用您的应用扫描二维码', 'Scannen Sie den Code mit Ihrer App', 'Escaneie o código com seu app');
U('qrDone', 'Simular pago', 'Simulate payment', '模拟支付', 'Zahlung simulieren', 'Simular pagamento');
U('pixCopy', 'Pix copia e cola (simulado)', 'Pix copy and paste (simulated)', 'Pix 复制粘贴码（模拟）', 'Pix Kopieren & Einfügen (simuliert)', 'Pix copia e cola (simulado)');
U('gpBank', 'Elegí tu banco', 'Choose your bank', '选择您的银行', 'Wählen Sie Ihre Bank', 'Escolha seu banco');
U('gpNote', 'Giropay cerró en 2024; su reemplazo es Wero. Acá se muestra como simulación.', 'Giropay closed in 2024; its successor is Wero. Shown here as a simulation.', 'Giropay 已于 2024 年停止服务，其继任者为 Wero。此处仅为模拟展示。', 'Giropay wurde 2024 eingestellt; der Nachfolger ist Wero. Hier nur als Simulation dargestellt.', 'O Giropay foi encerrado em 2024; seu sucessor é o Wero. Aqui aparece apenas como simulação.');
U('processing', 'Procesando el pago…', 'Processing payment…', '正在处理支付…', 'Zahlung wird verarbeitet …', 'Processando o pagamento…');
U('simDecline', 'Simular rechazo', 'Simulate decline', '模拟拒付', 'Ablehnung simulieren', 'Simular recusa');
U('payOk', '¡Pago aprobado!', 'Payment approved!', '支付成功！', 'Zahlung genehmigt!', 'Pagamento aprovado!');
U('payOkT', 'Recibimos tu pago simulado. Tu pedido ya está en cocina.', 'We received your simulated payment. Your order is now in the kitchen.', '已收到您的模拟付款，订单已送往厨房。', 'Ihre simulierte Zahlung ist eingegangen. Ihre Bestellung ist in der Küche.', 'Recebemos seu pagamento simulado. Seu pedido já está na cozinha.');
U('payPend', 'Pago pendiente de verificación', 'Payment pending verification', '付款待核实', 'Zahlung wird noch geprüft', 'Pagamento pendente de verificação');
U('payPendT', 'El personal verificará tu transferencia. Tu pedido ya está en cocina.', 'Our staff will verify your transfer. Your order is now in the kitchen.', '工作人员将核实您的转账。订单已送往厨房。', 'Unser Personal prüft Ihre Überweisung. Ihre Bestellung ist in der Küche.', 'A equipe vai verificar sua transferência. Seu pedido já está na cozinha.');
U('payCollect', 'Pedido confirmado', 'Order confirmed', '订单已确认', 'Bestellung bestätigt', 'Pedido confirmado');
U('payCollectT', 'Pagás en efectivo al recibir tu pedido. Ya está en cocina.', 'You pay in cash when you receive your order. It is now in the kitchen.', '收到订单时用现金支付。订单已送往厨房。', 'Sie zahlen bar bei Erhalt der Bestellung. Sie ist bereits in der Küche.', 'Você paga em dinheiro ao receber o pedido. Já está na cozinha.');
U('payDecl', 'Pago rechazado', 'Payment declined', '支付被拒绝', 'Zahlung abgelehnt', 'Pagamento recusado');
U('payDeclT', 'No se pudo completar el pago simulado. Probá con otro medio de pago.', 'The simulated payment could not be completed. Try another payment method.', '模拟支付未能完成，请尝试其他支付方式。', 'Die simulierte Zahlung konnte nicht abgeschlossen werden. Versuchen Sie eine andere Zahlungsart.', 'Não foi possível concluir o pagamento simulado. Tente outra forma de pagamento.');
U('seeStatus', 'Ver estado del pedido', 'View order status', '查看订单状态', 'Bestellstatus ansehen', 'Ver status do pedido');
U('tryOther', 'Elegir otro medio de pago', 'Choose another method', '选择其他支付方式', 'Andere Zahlungsart wählen', 'Escolher outra forma');
U('sentKitchen', '¡Pedido #{n} enviado a cocina!', 'Order #{n} sent to the kitchen!', '订单 #{n} 已发送到厨房！', 'Bestellung #{n} an die Küche gesendet!', 'Pedido #{n} enviado para a cozinha!');
U('confLead', 'Gracias, {name}. Te avisamos cuando esté listo.', "Thank you, {name}. We'll let you know when it's ready.", '谢谢，{name}。准备好后我们会通知您。', 'Danke, {name}. Wir sagen Bescheid, sobald es fertig ist.', 'Obrigado, {name}. Avisaremos quando estiver pronto.');
U('estimate', 'Tiempo estimado', 'Estimated time', '预计时间', 'Geschätzte Zeit', 'Tempo estimado');
U('minutes', '15–20 min', '15–20 min', '15–20 分钟', '15–20 Min.', '15–20 min');
U('st1', 'Pedido recibido', 'Order received', '已收到订单', 'Bestellung erhalten', 'Pedido recebido');
U('st1d', 'La cocina ya tiene tu pedido.', 'The kitchen has your order.', '厨房已收到您的订单。', 'Die Küche hat Ihre Bestellung.', 'A cozinha já tem o seu pedido.');
U('st2', 'En preparación', 'Being prepared', '制作中', 'In Zubereitung', 'Em preparo');
U('st2d', 'Estamos cocinando tus platos.', 'We are cooking your dishes.', '我们正在为您烹制菜品。', 'Wir bereiten Ihre Gerichte zu.', 'Estamos preparando seus pratos.');
U('st3', 'Listo para servir', 'Ready to serve', '可上菜', 'Servierbereit', 'Pronto para servir');
U('st3d', 'Te lo llevamos a la mesa o al mostrador.', 'We bring it to your table or the counter.', '我们会送到您的餐桌或柜台。', 'Wir bringen es an Ihren Tisch oder zur Theke.', 'Levamos à sua mesa ou ao balcão.');
U('newOrder', 'Hacer otro pedido', 'Place another order', '再点一单', 'Weitere Bestellung', 'Fazer outro pedido');
U('bookTitle', 'Reservá tu mesa', 'Book your table', '预订您的餐桌', 'Reservieren Sie Ihren Tisch', 'Reserve sua mesa');
U('bookIntro', 'Elegí día, horario y cantidad de personas. Te confirmamos el lugar en el momento.', "Choose the day, time and number of guests. We'll confirm your spot right away.", '请选择日期、时间和人数，我们会立即确认座位。', 'Wählen Sie Tag, Uhrzeit und Personenzahl. Wir bestätigen Ihren Platz sofort.', 'Escolha o dia, o horário e o número de pessoas. Confirmamos seu lugar na hora.');
U('date', 'Fecha', 'Date', '日期', 'Datum', 'Data');
U('time', 'Hora', 'Time', '时间', 'Uhrzeit', 'Horário');
U('service', 'Servicio', 'Service', '用餐时段', 'Mahlzeit', 'Refeição');
U('sv_desayuno', 'Desayuno', 'Breakfast', '早餐', 'Frühstück', 'Café da manhã');
U('sv_almuerzo', 'Almuerzo', 'Lunch', '午餐', 'Mittagessen', 'Almoço');
U('sv_merienda', 'Merienda', 'Afternoon tea', '下午茶', 'Nachmittagstee', 'Lanche da tarde');
U('sv_cena', 'Cena', 'Dinner', '晚餐', 'Abendessen', 'Jantar');
U('people', 'Personas', 'Guests', '人数', 'Personen', 'Pessoas');
U('peopleMax', 'Hasta 10 personas', 'Up to 10 guests', '最多 10 人', 'Bis zu 10 Personen', 'Até 10 pessoas');
U('phone', 'Teléfono', 'Phone', '电话', 'Telefon', 'Telefone');
U('confirmBook', 'Confirmar reserva', 'Confirm reservation', '确认预订', 'Reservierung bestätigen', 'Confirmar reserva');
U('bookOk', '¡Reserva recibida! Te enviamos la confirmación.', "Reservation received! We'll send you the confirmation.", '已收到预订！我们会发送确认信息。', 'Reservierung erhalten! Wir senden Ihnen die Bestätigung.', 'Reserva recebida! Enviaremos a confirmação.');
U('bookNeed', 'Completá tu nombre y teléfono.', 'Please enter your name and phone.', '请填写姓名和电话。', 'Bitte geben Sie Name und Telefon ein.', 'Preencha seu nome e telefone.');
U('bookFooter', 'MERCI · TE ESPERAMOS', 'MERCI · WE LOOK FORWARD TO SEEING YOU', '谢谢 · 期待您的光临', 'MERCI · WIR FREUEN UNS AUF SIE', 'MERCI · ESPERAMOS VOCÊ');
U('eventsTitle', 'Música en vivo', 'Live music', '现场音乐', 'Live-Musik', 'Música ao vivo');
U('eventsLead', 'Cenas acompañadas de buena música. Reservá tu lugar.', 'Dinners with great music. Book your spot.', '晚餐伴随美妙音乐，请提前预订座位。', 'Abendessen mit guter Musik. Reservieren Sie Ihren Platz.', 'Jantares com boa música. Reserve seu lugar.');
U('free', 'Entrada libre', 'Free admission', '免费入场', 'Eintritt frei', 'Entrada gratuita');
U('reserve', 'Reservar', 'Reserve', '预订', 'Reservieren', 'Reservar');
U('dFri', 'VIE', 'FRI', '周五', 'FR', 'SEX');
U('dSat', 'SÁB', 'SAT', '周六', 'SA', 'SÁB');
U('dSun', 'DOM', 'SUN', '周日', 'SO', 'DOM');
U('hrs', 'hs', '', '', 'Uhr', 'h');
U('placeTitle', 'Cómo llegar', 'How to find us', '前往方式', 'So finden Sie uns', 'Como chegar');
U('address', 'Dirección', 'Address', '地址', 'Adresse', 'Endereço');
U('contact', 'Contacto', 'Contact', '联系方式', 'Kontakt', 'Contato');
U('email', 'Correo', 'Email', '邮箱', 'E-Mail', 'E-mail');
U('howTo', 'Cómo llegar', 'Directions', '导航', 'Route', 'Como chegar');
U('call', 'Llamar', 'Call', '拨打电话', 'Anrufen', 'Ligar');
U('hours', 'Horarios', 'Opening hours', '营业时间', 'Öffnungszeiten', 'Horários');
U('h1', 'Martes a viernes', 'Tuesday to Friday', '周二至周五', 'Dienstag bis Freitag', 'Terça a sexta');
U('h2', 'Sábados', 'Saturdays', '周六', 'Samstag', 'Sábados');
U('h3', 'Domingos (brunch)', 'Sundays (brunch)', '周日（早午餐）', 'Sonntag (Brunch)', 'Domingos (brunch)');
U('h4', 'Lunes', 'Monday', '周一', 'Montag', 'Segunda');
U('closed', 'Cerrado', 'Closed', '休息', 'Geschlossen', 'Fechado');
U('prefs', 'Preferencias', 'Preferences', '偏好设置', 'Einstellungen', 'Preferências');
U('prefLang', 'Idioma', 'Language', '语言', 'Sprache', 'Idioma');
U('prefCur', 'Moneda', 'Currency', '货币', 'Währung', 'Moeda');
U('close', 'Cerrar', 'Close', '关闭', 'Schließen', 'Fechar');
U('footerTag', 'Cocina casera, café de especialidad y buena mesa.', 'Home cooking, specialty coffee and a great table.', '家常美食、精品咖啡与美好用餐时光。', 'Hausmannskost, Spezialitätenkaffee und ein guter Tisch.', 'Comida caseira, café especial e uma ótima mesa.');
U('footerBye', 'Merci. Te esperamos. Bon appétit.', 'Merci. We look forward to seeing you. Bon appétit.', '谢谢，期待您的光临。祝您用餐愉快。', 'Merci. Wir freuen uns auf Sie. Bon appétit.', 'Merci. Esperamos você. Bon appétit.');
U('rights', '© RATATOUILLE BISTRO & COFFEE · DATOS FICTICIOS PARA FINES EDUCATIVOS', '© RATATOUILLE BISTRO & COFFEE · FICTITIOUS DATA FOR EDUCATIONAL PURPOSES', '© RATATOUILLE BISTRO & COFFEE · 虚构数据，仅用于教学', '© RATATOUILLE BISTRO & COFFEE · FIKTIVE DATEN ZU BILDUNGSZWECKEN', '© RATATOUILLE BISTRO & COFFEE · DADOS FICTÍCIOS PARA FINS EDUCATIVOS');
U('options', 'Opciones', 'Options', '选项', 'Optionen', 'Opções');
U('required', 'OBLIGATORIO', 'REQUIRED', '必选', 'ERFORDERLICH', 'OBRIGATÓRIO');
U('qty', 'Cantidad', 'Quantity', '数量', 'Menge', 'Quantidade');
U('pickOption', 'Elegí una opción para continuar.', 'Choose an option to continue.', '请选择一个选项以继续。', 'Wählen Sie eine Option, um fortzufahren.', 'Escolha uma opção para continuar.');
U('addFor', 'Agregar · {amt}', 'Add · {amt}', '添加 · {amt}', 'Hinzufügen · {amt}', 'Adicionar · {amt}');
U('mcBox', 'Caja x5', 'Box of 5', '5 个装', 'Box à 5', 'Caixa com 5');
U('mcUnit', 'Por unidad', 'By the piece', '单个购买', 'Einzeln', 'Por unidade');
U('mcRule', 'Caja x5 {box} · Unidad {unit}', 'Box of 5 {box} · Single {unit}', '5 个装 {box} · 单个 {unit}', 'Box à 5 {box} · Einzeln {unit}', 'Caixa com 5 {box} · Unidade {unit}');
U('mcPick', 'Elegí tus sabores por color', 'Pick your flavours by colour', '按颜色选择口味', 'Wählen Sie Ihre Sorten nach Farbe', 'Escolha seus sabores por cor');
U('mcProgress', '{n} de {m} macarons elegidos', '{n} of {m} macarons chosen', '已选 {n} / {m} 个马卡龙', '{n} von {m} Macarons gewählt', '{n} de {m} macarons escolhidos');
U('step1', 'Café', 'Coffee', '咖啡', 'Kaffee', 'Café');
U('step2', 'Croissant', 'Croissant', '羊角面包', 'Croissant', 'Croissant');
U('step3', 'Macarons', 'Macarons', '马卡龙', 'Macarons', 'Macarons');
U('next', 'Siguiente', 'Next', '下一步', 'Weiter', 'Próximo');
U('chooseCoffee', 'Elegí tu café', 'Choose your coffee', '选择咖啡', 'Wählen Sie Ihren Kaffee', 'Escolha seu café');
U('chooseCroissant', 'Elegí tu croissant', 'Choose your croissant', '选择羊角面包', 'Wählen Sie Ihr Croissant', 'Escolha seu croissant');
U('chooseMacarons', 'Elegí 2 macarons', 'Choose 2 macarons', '选择 2 个马卡龙', 'Wählen Sie 2 Macarons', 'Escolha 2 macarons');
U('edit', 'Editar', 'Edit', '编辑', 'Bearbeiten', 'Editar');
U('staffTitle', 'Panel de cocina', 'Kitchen panel', '厨房面板', 'Küchenpanel', 'Painel da cozinha');


/* ====== Ajustes según la especificación funcional (glosario de interfaz y textos nuevos) ====== */
U('whatToday', '¿Qué te preparamos hoy?', 'What can we make for you today?', '今天想吃点什么？', 'Was dürfen wir Ihnen heute zubereiten?', 'O que vamos preparar para você hoje?');
U('heroQR', 'ESCANEÁ Y PEDÍ DESDE TU MESA', 'SCAN AND ORDER FROM YOUR TABLE', '扫码，在餐桌上直接点餐', 'SCANNEN & VON IHREM TISCH AUS BESTELLEN', 'ESCANEIE E PEÇA DA SUA MESA');
U('makeOrder', 'Hacer un pedido', 'Order now', '立即点餐', 'Jetzt bestellen', 'Fazer um pedido');
U('navMenu', 'Carta', 'Menu', '菜单', 'Speisekarte', 'Cardápio');
U('navPlace', 'Ubicación', 'Location', '位置', 'Standort', 'Localização');
U('navLive', 'En vivo', 'Live music', '现场音乐', 'Live-Musik', 'Música ao vivo');
U('navEvents', 'En vivo', 'Live music', '现场音乐', 'Live-Musik', 'Música ao vivo');
U('myOrder', 'Mi pedido', 'My order', '我的订单', 'Meine Bestellung', 'Meu pedido');
U('cat_ent', 'Entradas', 'Starters', '前菜', 'Vorspeisen', 'Entradas');
U('cat_pri', 'Principales', 'Mains', '主菜', 'Hauptgerichte', 'Pratos principais');
U('cat_pos', 'Postres', 'Desserts', '甜点', 'Desserts', 'Sobremesas');
U('cat_caf', 'Cafetería', 'Coffee & Bakery', '咖啡与烘焙', 'Kaffee & Gebäck', 'Cafeteria e padaria');
U('fVeggie', 'Veggie', 'Veggie', '素食', 'Vegetarisch', 'Vegetariano');
U('bVeggie', 'VEGGIE', 'VEGGIE', '素食', 'VEGETARISCH', 'VEGETARIANO');
U('showing', 'Mostrando {n} platos', 'Showing {n} dishes', '显示 {n} 道菜', '{n} Gerichte werden angezeigt', 'Mostrando {n} pratos');
U('showingOne', 'Mostrando 1 plato', 'Showing 1 dish', '显示 1 道菜', '1 Gericht wird angezeigt', 'Mostrando 1 prato');
U('noResultsIn', 'No tenemos opciones con este filtro en {cat}.', 'We have no options with this filter in {cat}.', '“{cat}”中没有符合此筛选的菜品。', 'In „{cat}“ haben wir keine Optionen für diesen Filter.', 'Não temos opções com este filtro em {cat}.');
U('seeOtherCats', 'Ver otras categorías', 'See other categories', '查看其他分类', 'Andere Kategorien ansehen', 'Ver outras categorias');
U('legend', 'VEGGIE = sin carne ni pescado · SIN TACC = apto celíacos', 'VEGGIE = no meat or fish · GLUTEN-FREE = suitable for coeliacs', '素食 = 不含肉和鱼 · 无麸质 = 适合乳糜泻患者', 'VEGETARISCH = ohne Fleisch und Fisch · GLUTENFREI = für Zöliakie geeignet', 'VEGETARIANO = sem carne nem peixe · SEM GLÚTEN = indicado para celíacos');
U('add', 'Agregar', 'Add', '加入', 'Hinzufügen', 'Adicionar');
U('addFor', 'Agregar al pedido · {amt}', 'Add to order · {amt}', '加入订单 · {amt}', 'Zur Bestellung hinzufügen · {amt}', 'Adicionar ao pedido · {amt}');
U('confirmOrder', 'Confirmar pedido', 'Place order', '提交订单', 'Bestellung aufgeben', 'Finalizar pedido');
U('payBtn', 'Pagar {amt}', 'Pay {amt}', '支付 {amt}', '{amt} bezahlen', 'Pagar {amt}');
U('takeaway', 'Para retirar', 'Pick-up', '自取', 'Zum Mitnehmen', 'Para retirar');
U('notes', 'Aclaraciones', 'Special requests', '备注', 'Anmerkungen', 'Observações');
U('payTitle', 'Forma de pago', 'Payment method', '支付方式', 'Zahlungsart', 'Forma de pagamento');
U('payRecommended', 'Recomendados para {cur}', 'Recommended for {cur}', '推荐用于 {cur}', 'Empfohlen für {cur}', 'Recomendados para {cur}');
U('payOthers', 'Ver otros métodos de pago', 'See other payment methods', '查看其他支付方式', 'Weitere Zahlungsarten anzeigen', 'Ver outros métodos de pagamento');
U('payFewer', 'Ocultar otros métodos', 'Hide other methods', '收起其他支付方式', 'Weitere Zahlungsarten ausblenden', 'Ocultar outros métodos');
U('recBadge', 'RECOMENDADO', '推荐 · RECOMMENDED', '推荐', 'EMPFOHLEN', 'RECOMENDADO');
U('chargesIn', 'Cobra en {cur}', 'Charges in {cur}', '以 {cur} 收款', 'Abrechnung in {cur}', 'Cobra em {cur}');
U('chargeNote', '{pm} cobra en {word}: {amt}.', '{pm} charges in {word}: {amt}.', '{pm} 以{word}收款：{amt}。', '{pm} rechnet in {word} ab: {amt}.', '{pm} cobra em {word}: {amt}.');
U('chargeNotePesos', 'Se cobra en pesos: {amt}.', 'You are charged in pesos: {amt}.', '以阿根廷比索收款：{amt}。', 'Die Abbuchung erfolgt in Pesos: {amt}.', 'A cobrança é em pesos: {amt}.');
U('cashOther', 'Aceptamos efectivo en {word} a la cotización del día. El vuelto se entrega en pesos.', 'We accept cash in {word} at the day’s exchange rate. Change is given in pesos.', '我们接受{word}现金，按当日汇率结算，找零以阿根廷比索支付。', 'Wir akzeptieren Bargeld in {word} zum Tageskurs. Das Wechselgeld erhalten Sie in Pesos.', 'Aceitamos dinheiro em {word} pela cotação do dia. O troco é entregue em pesos.');
U('cashTable', 'Pagás al finalizar, con el mozo.', 'You pay at the end, with your waiter.', '用餐结束后向服务员付款。', 'Sie zahlen am Ende beim Kellner.', 'Você paga ao final, com o garçom.');
U('cashWith', '¿Con cuánto vas a pagar?', 'How much will you pay with?', '您打算用多少金额支付？', 'Mit welchem Betrag zahlen Sie?', 'Com quanto você vai pagar?');
U('cashChange', 'Vuelto estimado: {amt}', 'Estimated change: {amt}', '预计找零：{amt}', 'Voraussichtliches Rückgeld: {amt}', 'Troco estimado: {amt}');
U('deliveryPay', 'El pago se realiza en la app de delivery.', 'Payment is made in the delivery app.', '请在外卖应用中付款。', 'Die Zahlung erfolgt in der Lieferdienst-App.', 'O pagamento é feito no app de delivery.');
U('rate', 'Cotización de referencia: {one} = {amt}', 'Reference rate: {one} = {amt}', '参考汇率：{one} = {amt}', 'Referenzkurs: {one} = {amt}', 'Cotação de referência: {one} = {amt}');
U('pm_transfer', 'Transferencia', 'Bank transfer', '银行转账', 'Banküberweisung', 'Transferência bancária');
U('pm_mercadopago', 'Mercado Pago', 'Mercado Pago', 'Mercado Pago', 'Mercado Pago', 'Mercado Pago');
U('pm_paypal', 'PayPal', 'PayPal', 'PayPal', 'PayPal', 'PayPal');
U('pm_wero', 'Wero', 'Wero', 'Wero', 'Wero', 'Wero');
U('pm_alipay', 'Alipay', 'Alipay', '支付宝', 'Alipay', 'Alipay');
U('pm_wechat', 'WeChat Pay', 'WeChat Pay', '微信支付', 'WeChat Pay', 'WeChat Pay');
U('mpRedirect', 'Te estamos redirigiendo a Mercado Pago…', 'We are redirecting you to Mercado Pago…', '正在跳转到 Mercado Pago…', 'Sie werden zu Mercado Pago weitergeleitet …', 'Estamos redirecionando você ao Mercado Pago…');
U('ppRedirect', 'Redirecting to PayPal…', 'Redirecting to PayPal…', '正在跳转到 PayPal…', 'Weiterleitung zu PayPal …', 'Redirecionando para o PayPal…');
U('ppLogin', 'Iniciá sesión y pagá en USD', 'Log in and pay in USD', '登录并以美元支付', 'Anmelden und in USD bezahlen', 'Faça login e pague em USD');
U('ppEmail', 'Correo electrónico', 'Email', '电子邮箱', 'E-Mail', 'E-mail');
U('ppPass', 'Contraseña (simulada)', 'Password (simulated)', '密码（模拟）', 'Passwort (simuliert)', 'Senha (simulada)');
U('timeLeft', 'Tiempo restante', 'Time left', '剩余时间', 'Verbleibende Zeit', 'Tempo restante');
U('expired', 'El tiempo terminó. Probá de nuevo.', 'Time is up. Please try again.', '时间已到，请重试。', 'Die Zeit ist abgelaufen. Bitte versuchen Sie es erneut.', 'O tempo acabou. Tente novamente.');
U('tryAgain', 'Reintentar', 'Try again', '重试', 'Erneut versuchen', 'Tentar novamente');
U('tryOther', 'Elegir otro método', 'Choose another method', '选择其他方式', 'Andere Zahlungsart wählen', 'Escolher outro método');
U('payOk', 'Pago aprobado', 'Payment approved', '支付成功', 'Zahlung erfolgreich', 'Pagamento aprovado');
U('payPend', 'Pago pendiente de verificación', 'Payment pending verification', '支付处理中：待核实', 'Zahlung ausstehend: wird geprüft', 'Pagamento pendente de verificação');
U('payDecl', 'Pago rechazado', 'Payment declined', '支付失败', 'Zahlung abgelehnt', 'Pagamento recusado');
U('payPlain', 'Pedido confirmado', 'Order confirmed', '订单已确认', 'Bestellung bestätigt', 'Pedido confirmado');
U('payPlainT', 'Tu pedido ya está en cocina. El pago se realiza en la app de delivery.', 'Your order is now in the kitchen. Payment is made in the delivery app.', '订单已送往厨房。请在外卖应用中付款。', 'Ihre Bestellung ist in der Küche. Die Zahlung erfolgt in der Lieferdienst-App.', 'Seu pedido já está na cozinha. O pagamento é feito no app de delivery.');
U('payCollectT', 'Pagás en efectivo al finalizar o al retirar. Tu pedido ya está en cocina.', 'You pay in cash at the end or on pickup. Your order is now in the kitchen.', '用餐结束后或取餐时用现金支付。订单已送往厨房。', 'Sie zahlen bar am Ende oder bei der Abholung. Ihre Bestellung ist in der Küche.', 'Você paga em dinheiro ao final ou na retirada. Seu pedido já está na cozinha.');
U('payHere', 'Pago simulado: no se procesa dinero real.', 'Simulated payment: no real money is processed.', '模拟支付：不会处理真实资金。', 'Simulierte Zahlung: Es wird kein echtes Geld verarbeitet.', 'Pagamento simulado: nenhum dinheiro real é processado.');
U('st1', 'Recibido', 'Received', '已收到', 'Eingegangen', 'Recebido');
U('st3', 'Listo para entregar', 'Ready for pickup', '可取餐', 'Abholbereit', 'Pronto para entregar');
U('mcShortcut', 'CAJA x5', 'BOX x5', '5 个装', 'BOX x5', 'CAIXA x5');
U('mcRule', 'Unidad {unit} · Cada 5 pagás {box}', 'Single {unit} · Every 5 you pay {box}', '单个 {unit} · 每 5 个 {box}', 'Einzeln {unit} · Je 5 Stück zahlen Sie {box}', 'Unidade {unit} · A cada 5 você paga {box}');
U('mcSave', 'Ahorrás {amt}', 'You save {amt}', '立省 {amt}', 'Sie sparen {amt}', 'Você economiza {amt}');
U('mcProgress', 'Elegiste {n} de {m} macarons', 'You chose {n} of {m} macarons', '已选 {n} / {m} 个马卡龙', 'Sie haben {n} von {m} Macarons gewählt', 'Você escolheu {n} de {m} macarons');
U('mcSurprise', 'Mezcla sorpresa', 'Surprise mix', '随机搭配', 'Überraschungsmix', 'Mix surpresa');
U('mcEdit', 'Editar sabores', 'Edit flavors', '修改口味', 'Sorten ändern', 'Editar sabores');
U('mcHelp', 'Elegí {n} sabores más', 'Choose {n} more flavors', '再选 {n} 种口味', 'Wählen Sie noch {n} Sorten', 'Escolha mais {n} sabores');
U('mcHelpOne', 'Elegí 1 sabor más', 'Choose 1 more flavor', '再选 1 种口味', 'Wählen Sie noch 1 Sorte', 'Escolha mais 1 sabor');
U('mcPick', 'Elegí tus sabores por color', 'Pick your flavors by color', '按颜色选择口味', 'Wählen Sie Ihre Sorten nach Farbe', 'Escolha seus sabores por cor');
U('mcQty', 'Cantidad de macarons', 'Number of macarons', '马卡龙数量', 'Anzahl Macarons', 'Quantidade de macarons');
U('merEdit', 'Editar merienda', 'Edit afternoon tea', '修改下午茶', 'Nachmittagsmenü ändern', 'Editar lanche');
U('merMac1', 'Elegiste 1 de 2 macarons', 'You chose 1 of 2 macarons', '已选 1 / 2 个马卡龙', 'Sie haben 1 von 2 Macarons gewählt', 'Você escolheu 1 de 2 macarons');
U('merBuild', 'Armar mi merienda', 'Build my afternoon tea', '搭配我的下午茶', 'Mein Nachmittagsmenü zusammenstellen', 'Montar meu lanche');
U('sentKitchen', '¡Pedido #{n} enviado a cocina!', 'Order #{n} sent to the kitchen!', '订单 #{n} 已发送到厨房！', 'Bestellung #{n} an die Küche gesendet!', 'Pedido #{n} enviado para a cozinha!');
// reservas
U('bookIntro', 'Elegí el día, el turno y la cantidad de personas. Los turnos son cada 30 minutos.', 'Choose the day, the time slot and the number of guests. Slots are every 30 minutes.', '请选择日期、时段和人数。时段每 30 分钟一档。', 'Wählen Sie Tag, Zeit und Personenzahl. Die Zeitfenster liegen 30 Minuten auseinander.', 'Escolha o dia, o horário e o número de pessoas. Os horários são a cada 30 minutos.');
U('namePh', 'Tu nombre y apellido', 'Your full name', '您的姓名', 'Ihr vollständiger Name', 'Seu nome completo');
U('confirmBook', 'Confirmar reserva', 'Confirm booking', '确认预订', 'Reservierung bestätigen', 'Confirmar reserva');
U('full', 'Completo', 'Full', '已满', 'Ausgebucht', 'Esgotado');
U('fr_morning', 'Mañana', 'Morning', '上午', 'Morgen', 'Manhã');
U('fr_noon', 'Mediodía', 'Lunch', '中午', 'Mittag', 'Almoço');
U('fr_afternoon', 'Tarde', 'Afternoon', '下午', 'Nachmittag', 'Tarde');
U('fr_night', 'Noche', 'Evening', '晚上', 'Abend', 'Noite');
U('sv_ent', 'Entradas', 'Starters', '前菜', 'Vorspeisen', 'Entradas');
U('sv_snack', 'Snack', 'Snack', '小食', 'Snack', 'Lanche');
U('sv_pri', 'Principales', 'Mains', '主菜', 'Hauptgerichte', 'Pratos principais');
U('sv_pos', 'Postres', 'Desserts', '甜点', 'Desserts', 'Sobremesas');
U('sv_caf', 'Café', 'Coffee', '咖啡', 'Kaffee', 'Café');
U('peopleMax', 'Hasta 20 comensales', 'Up to 20 guests', '最多 20 位用餐者', 'Bis zu 20 Gäste', 'Até 20 pessoas');
U('person1', 'persona', 'guest', '位', 'Person', 'pessoa');
U('personN', 'personas', 'guests', '位', 'Personen', 'pessoas');
U('bookOk', '¡Reserva recibida! {when} a las {time} · {n} {ppl} · {svc}. Te enviamos la confirmación.', 'Reservation received! {when} at {time} · {n} {ppl} · {svc}. We’ll send you the confirmation.', '已收到预订！{when} {time} · {n} {ppl} · {svc}。我们会发送确认信息。', 'Reservierung erhalten! {when} um {time} Uhr · {n} {ppl} · {svc}. Wir senden Ihnen die Bestätigung.', 'Reserva recebida! {when} às {time} · {n} {ppl} · {svc}. Enviaremos a confirmação.');
U('bookNeed', 'Completá tu nombre y elegí un horario.', 'Enter your name and choose a time.', '请填写姓名并选择时间。', 'Geben Sie Ihren Namen ein und wählen Sie eine Zeit.', 'Preencha seu nome e escolha um horário.');
U('openHours', 'Horario de atención: {days} {hours} hs', 'Opening hours: {days} {hours}', '营业时间：{days} {hours}', 'Öffnungszeiten: {days} {hours} Uhr', 'Horário de atendimento: {days} {hours} h');
U('noSlots', 'No quedan turnos disponibles en esta franja.', 'No slots left in this period.', '该时段已无可预订的时间。', 'In diesem Zeitraum sind keine Termine mehr frei.', 'Não há mais horários nesta faixa.');
// eventos y lugar
U('eventsLead', 'Cenas y almuerzos con buena música. Todos con entrada libre.', 'Dinners and lunches with great music. All with free admission.', '伴着好音乐的晚餐与午餐，全部免费入场。', 'Abend- und Mittagessen mit guter Musik. Alle mit freiem Eintritt.', 'Jantares e almoços com boa música. Todos com entrada gratuita.');
U('reserveSpot', 'Reservar lugar', 'Reserve a spot', '预留座位', 'Platz reservieren', 'Reservar lugar');
U('h1', 'Lunes a viernes', 'Monday to Friday', '周一至周五', 'Montag bis Freitag', 'Segunda a sexta');
U('h2', 'Sábados', 'Saturdays', '周六', 'Samstag', 'Sábados');
U('h3', 'Domingos', 'Sundays', '周日', 'Sonntag', 'Domingos');
U('hoursContact', 'Horarios & Contacto', 'Hours & Contact', '营业时间与联系方式', 'Öffnungszeiten & Kontakt', 'Horários e Contato');
U('footerBye', 'Merci. Te esperamos. Bon appétit.', 'Merci. We look forward to seeing you. Bon appétit.', '谢谢，期待您的光临。祝您用餐愉快。', 'Merci. Wir freuen uns auf Sie. Bon appétit.', 'Merci. Esperamos você. Bon appétit.');
U('projectTitle', 'Proyecto Cátedra', 'Course project', '课程项目', 'Projekt der Lehrveranstaltung', 'Projeto da disciplina');
U('acadTitle', 'Sobre este proyecto.', 'About this project.', '关于本项目。', 'Über dieses Projekt.', 'Sobre este projeto.');
U('acad', '“Menú Ágil del Bistro Ratatouille” es un trabajo práctico para la materia Ingeniería del Software, de 2º año de la Tecnicatura en Análisis de Sistemas del Instituto N.º 182 «Sargento Cabral». Ratatouille Bistro & Coffee es un comercio ficticio: la dirección, el teléfono, el email, los precios, las cotizaciones y las redes son datos de ejemplo. Los pedidos, pagos y reservas no se envían a ningún lugar. Las fotos son imágenes de referencia. Este proyecto no tiene relación con la película Ratatouille ni con Disney/Pixar.',
  '“Menú Ágil del Bistro Ratatouille” is a course project for Software Engineering, 2nd year of the Systems Analysis Technical Degree at Instituto N.º 182 “Sargento Cabral”. Ratatouille Bistro & Coffee is a fictitious business: the address, phone, email, prices, exchange rates and social media are sample data. Orders, payments and bookings are not sent anywhere. The photos are reference images. This project has no relationship with the film Ratatouille or with Disney/Pixar.',
  '“Menú Ágil del Bistro Ratatouille”是“Sargento Cabral”第 182 号学院系统分析技术专业二年级软件工程课程的实践作业。Ratatouille Bistro & Coffee 是虚构的商户：地址、电话、邮箱、价格、汇率和社交账号均为示例数据。订单、支付和预订不会发送到任何地方。照片为参考图片。本项目与电影《料理鼠王》（Ratatouille）及迪士尼/皮克斯无关。',
  '„Menú Ágil del Bistro Ratatouille“ ist eine praktische Arbeit für das Fach Softwareentwicklung im 2. Jahr der Technikerausbildung Systemanalyse am Instituto N.º 182 „Sargento Cabral“. Ratatouille Bistro & Coffee ist ein fiktives Unternehmen: Adresse, Telefon, E-Mail, Preise, Wechselkurse und soziale Netzwerke sind Beispieldaten. Bestellungen, Zahlungen und Reservierungen werden nirgendwohin gesendet. Die Fotos sind Referenzbilder. Dieses Projekt steht in keinem Zusammenhang mit dem Film Ratatouille oder mit Disney/Pixar.',
  '“Menú Ágil del Bistro Ratatouille” é um trabalho prático da disciplina Engenharia de Software, do 2º ano da Tecnicatura em Análise de Sistemas do Instituto N.º 182 “Sargento Cabral”. O Ratatouille Bistro & Coffee é um comércio fictício: o endereço, o telefone, o e-mail, os preços, as cotações e as redes são dados de exemplo. Os pedidos, pagamentos e reservas não são enviados a lugar nenhum. As fotos são imagens de referência. Este projeto não tem relação com o filme Ratatouille nem com a Disney/Pixar.');
U('rights', '© RATATOUILLE BISTRO & COFFEE · PROYECTO ACADÉMICO FICTICIO', '© RATATOUILLE BISTRO & COFFEE · FICTITIOUS ACADEMIC PROJECT', '© RATATOUILLE BISTRO & COFFEE · 虚构的学术项目', '© RATATOUILLE BISTRO & COFFEE · FIKTIVES AKADEMISCHES PROJEKT', '© RATATOUILLE BISTRO & COFFEE · PROJETO ACADÊMICO FICTÍCIO');
// sugerencia de moneda al cambiar de idioma
U('sugText', 'Estás viendo la carta en español. ¿Querés ver los precios en {word} ({cur})?', 'You are viewing the menu in English. Would you like to see prices in {word} ({cur})?', '您正在以中文浏览菜单。要改用{word}（{cur}）显示价格吗？', 'Sie sehen die Karte auf Deutsch. Möchten Sie die Preise in {word} ({cur}) sehen?', 'Você está vendo o cardápio em português. Quer ver os preços em {word} ({cur})?');
U('sugChange', 'Cambiar', 'Change', '更换', 'Ändern', 'Alterar');
U('sugKeep', 'Mantener', 'Keep', '保留', 'Beibehalten', 'Manter');
U('staffTitle', 'Panel de despacho', 'Dispatch panel', '配送面板', 'Dispatch-Panel', 'Painel de despacho');

// sabores de macarons (índice = color flavor-N del diseño)
const FLAVORS = [
  { es: 'Frambuesa', en: 'Raspberry', zh: '覆盆子', de: 'Himbeere', pt: 'Framboesa' },
  { es: 'Pistacho', en: 'Pistachio', zh: '开心果', de: 'Pistazie', pt: 'Pistache' },
  { es: 'Limón', en: 'Lemon', zh: '柠檬', de: 'Zitrone', pt: 'Limão' },
  { es: 'Lavanda', en: 'Lavender', zh: '薰衣草', de: 'Lavendel', pt: 'Lavanda' },
  { es: 'Chocolate', en: 'Chocolate', zh: '巧克力', de: 'Schokolade', pt: 'Chocolate' }
];

// ---------- Carta oficial (precios en ARS) ----------
// D(id, categoría, precio, etiquetas, [nombres es,en,zh,de,pt], [descripciones es,en,zh,de,pt], opciones?)
const DISHES = [];
const D = (id, cat, price, tags, n, ds, opts, kind) => DISHES.push({ id, cat, price, tags, n, ds, opts: opts || null, kind: kind || null });
const O = (...labels) => labels; // opción en 5 idiomas

/* ENTRADAS */
D('sopa', 'ent', 9500, [],
  ['Sopa de cebolla', 'French onion soup', '法式洋葱汤', 'Französische Zwiebelsuppe', 'Sopa de cebola'],
  ['Gratinada con gruyère y croûtons de pan de campo.', 'Gratinated with gruyère and country-bread croûtons.', '焗烤格鲁耶尔奶酪，配乡村面包丁。', 'Mit Gruyère überbacken, dazu Croûtons aus Landbrot.', 'Gratinada com gruyère e croûtons de pão rústico.']);
D('sopaveg', 'ent', 9200, ['veggie'],
  ['Sopa de cebolla veggie', 'Veggie onion soup', '素食洋葱汤', 'Vegetarische Zwiebelsuppe', 'Sopa de cebola veggie'],
  ['Con caldo de verduras, gruyère y croûtons.', 'With vegetable broth, gruyère and croûtons.', '以蔬菜高汤制作，配格鲁耶尔奶酪和面包丁。', 'Mit Gemüsebrühe, Gruyère und Croûtons.', 'Com caldo de legumes, gruyère e croûtons.']);
D('mariscos', 'ent', 24500, [],
  ['Tabla de mariscos', 'Seafood platter', '海鲜拼盘', 'Meeresfrüchteplatte', 'Tábua de frutos do mar'],
  ['Rabas, langostinos, camarones apanados y mejillones, con papas fritas, limón y alioli. Para compartir.', 'Calamari, prawns, breaded shrimp and mussels, with fries, lemon and aioli. To share.', '炸鱿鱼圈、大虾、面包糠炸小虾和青口，配薯条、柠檬和蒜泥蛋黄酱。适合分享。', 'Calamari, Garnelen, panierte Krabben und Muscheln, mit Pommes, Zitrone und Aioli. Zum Teilen.', 'Lulas, camarões grandes, camarões empanados e mexilhões, com batata frita, limão e aioli. Para compartilhar.']);
D('tabla', 'ent', 16500, [],
  ['Tabla del bistró', 'Bistro board', '小酒馆拼盘', 'Bistro-Platte', 'Tábua do bistrô'],
  ['Quesos y fiambres franceses, frutos secos y mermelada casera. Para compartir.', 'French cheeses and cold cuts, nuts and homemade jam. To share.', '法式奶酪和冷切肉，配坚果和自制果酱。适合分享。', 'Französische Käse und Aufschnitt, Nüsse und hausgemachte Marmelade. Zum Teilen.', 'Queijos e frios franceses, frutos secos e geleia caseira. Para compartilhar.']);
D('nicoise', 'ent', 12400, ['gf'],
  ['Ensalada niçoise', 'Niçoise salad', '尼斯沙拉', 'Salade niçoise', 'Salada niçoise'],
  ['Atún, huevo, chauchas, papa, tomate y aceitunas negras.', 'Tuna, egg, green beans, potato, tomato and black olives.', '金枪鱼、鸡蛋、四季豆、土豆、番茄和黑橄榄。', 'Thunfisch, Ei, grüne Bohnen, Kartoffel, Tomate und schwarze Oliven.', 'Atum, ovo, vagem, batata, tomate e azeitonas pretas.']);
D('croque', 'ent', 11900, [],
  ['Croque monsieur', 'Croque monsieur', '法式火腿芝士三明治', 'Croque Monsieur', 'Croque monsieur'],
  ['Jamón cocido, gruyère y salsa bechamel gratinada.', 'Cooked ham, gruyère and gratinated béchamel sauce.', '熟火腿、格鲁耶尔奶酪和焗烤白酱。', 'Gekochter Schinken, Gruyère und überbackene Béchamelsauce.', 'Presunto cozido, gruyère e molho bechamel gratinado.']);
D('lentejas', 'ent', 11500, ['veggie', 'gf'],
  ['Ensalada de lentejas', 'Lentil salad', '扁豆沙拉', 'Linsensalat', 'Salada de lentilhas'],
  ['Lentejas, remolacha asada, queso de cabra y nueces. Opción vegana sin queso.', 'Lentils, roasted beet, goat cheese and walnuts. Vegan option without cheese.', '扁豆、烤甜菜根、山羊奶酪和核桃。可选不加奶酪的纯素版本。', 'Linsen, geröstete Rote Bete, Ziegenkäse und Walnüsse. Vegane Option ohne Käse.', 'Lentilhas, beterraba assada, queijo de cabra e nozes. Opção vegana sem queijo.'],
  [O('Con queso de cabra', 'With goat cheese', '加山羊奶酪', 'Mit Ziegenkäse', 'Com queijo de cabra'), O('Vegana (sin queso)', 'Vegan (no cheese)', '纯素（不加奶酪）', 'Vegan (ohne Käse)', 'Vegana (sem queijo)')]);

/* PRINCIPALES */
D('ratatouille', 'pri', 15800, ['veggie', 'gf'],
  ['Ratatouille de la casa', 'House ratatouille', '招牌普罗旺斯炖菜', 'Ratatouille des Hauses', 'Ratatouille da casa'],
  ['Nuestro plato insignia: berenjena, zucchini, morrón y tomate al horno con hierbas de Provenza.', 'Our signature dish: baked eggplant, zucchini, bell pepper and tomato with herbes de Provence.', '我们的招牌菜：烤茄子、西葫芦、甜椒和番茄，配普罗旺斯香草。', 'Unser Signaturgericht: Auberginen, Zucchini, Paprika und Tomaten aus dem Ofen mit Kräutern der Provence.', 'Nosso prato estrela: berinjela, abobrinha, pimentão e tomate assados com ervas de Provence.'], null, 'featured');
D('boeuf', 'pri', 21500, [],
  ['Boeuf bourguignon', 'Boeuf bourguignon', '勃艮第红酒炖牛肉', 'Boeuf bourguignon', 'Boeuf bourguignon'],
  ['Carne braseada al vino tinto con hongos y puré de papas.', 'Beef braised in red wine with mushrooms and mashed potatoes.', '红酒炖牛肉，配蘑菇和土豆泥。', 'In Rotwein geschmortes Rindfleisch mit Pilzen und Kartoffelpüree.', 'Carne braseada no vinho tinto com cogumelos e purê de batatas.'], null, 'featured');
D('pollo', 'pri', 18900, ['gf'],
  ['Pollo al vino blanco', 'Chicken in white wine', '白葡萄酒鸡肉', 'Hähnchen in Weißwein', 'Frango ao vinho branco'],
  ['Con echalotes, crema y papas rústicas.', 'With shallots, cream and rustic potatoes.', '配红葱头、奶油和乡村煎土豆。', 'Mit Schalotten, Sahne und rustikalen Kartoffeln.', 'Com echalotas, creme e batatas rústicas.']);
D('steak', 'pri', 23700, ['gf'],
  ['Steak frites', 'Steak frites', '牛排配薯条', 'Steak frites', 'Steak frites'],
  ['Bife de chorizo con manteca de hierbas y papas fritas en freidora exclusiva.', 'Sirloin steak with herb butter and fries cooked in a dedicated fryer.', '西冷牛排配香草黄油和薯条（使用专用油炸锅）。', 'Rumpsteak mit Kräuterbutter und Pommes (aus separater Fritteuse).', 'Bife de chorizo com manteiga de ervas e batatas fritas (em fritadeira exclusiva).']);
D('quiche', 'pri', 14200, [],
  ['Quiche lorraine', 'Quiche lorraine', '洛林咸派', 'Quiche Lorraine', 'Quiche lorraine'],
  ['Panceta, queso y crema, con ensalada de hojas verdes.', 'Bacon, cheese and cream, with a green leaf salad.', '培根、奶酪和奶油，配绿叶沙拉。', 'Speck, Käse und Sahne, dazu grüner Blattsalat.', 'Bacon, queijo e creme, com salada de folhas verdes.']);
D('quicheesp', 'pri', 13600, ['veggie'],
  ['Quiche de espinaca', 'Spinach quiche', '菠菜咸派', 'Spinat-Quiche', 'Quiche de espinafre'],
  ['Con queso de cabra y cebolla caramelizada, y hojas verdes.', 'With goat cheese and caramelized onion, and green leaves.', '配山羊奶酪和焦糖洋葱，附绿叶菜。', 'Mit Ziegenkäse und karamellisierten Zwiebeln, dazu grüne Blätter.', 'Com queijo de cabra e cebola caramelizada, e folhas verdes.']);
D('crepehongos', 'pri', 12900, ['veggie'],
  ['Crêpe de hongos', 'Mushroom crêpe', '蘑菇可丽饼', 'Pilz-Crêpe', 'Crêpe de cogumelos'],
  ['Champiñones y portobellos salteados con salsa de queso.', 'Sautéed button and portobello mushrooms with cheese sauce.', '炒口蘑和波多贝罗蘑菇，配奶酪酱。', 'Gebratene Champignons und Portobello mit Käsesauce.', 'Champignons e portobellos salteados com molho de queijo.']);

D('crepearroz', 'pri', 12900, ['gf'],
  ['Crêpe de harina de arroz', 'Rice-flour crêpe', '米粉可丽饼', 'Crêpe aus Reismehl', 'Crêpe de farinha de arroz'],
  ['Salada (jamón y queso) o dulce (dulce de leche).', 'Savory (ham and cheese) or sweet (dulce de leche).', '咸味（火腿奶酪）或甜味（牛奶焦糖酱）。', 'Herzhaft (Schinken und Käse) oder süß (Dulce de Leche).', 'Salgada (presunto e queijo) ou doce (doce de leite).'],
  [O('Salada (jamón y queso)', 'Savory (ham and cheese)', '咸味（火腿奶酪）', 'Herzhaft (Schinken und Käse)', 'Salgada (presunto e queijo)'), O('Dulce (dulce de leche)', 'Sweet (dulce de leche)', '甜味（牛奶焦糖酱）', 'Süß (Dulce de Leche)', 'Doce (doce de leite)')]);

/* POSTRES */
D('coulant', 'pos', 9200, ['veggie'],
  ['Coulant de chocolate', 'Chocolate coulant', '巧克力熔岩蛋糕', 'Schokoladen-Coulant', 'Coulant de chocolate'],
  ['Volcán tibio de chocolate con centro fundido y helado de vainilla.', 'Warm chocolate volcano with a molten centre and vanilla ice cream.', '温热的巧克力熔岩，中心流心，配香草冰淇淋。', 'Warmer Schokoladenvulkan mit flüssigem Kern und Vanilleeis.', 'Vulcão morno de chocolate com centro derretido e sorvete de baunilha.']);
D('tarte', 'pos', 8900, ['veggie'],
  ['Tarte tatin', 'Tarte tatin', '法式反转焦糖苹果挞', 'Tarte Tatin', 'Tarte tatin'],
  ['Tarta invertida de manzanas caramelizadas con crema.', 'Upside-down caramelized apple tart with cream.', '倒扣焦糖苹果挞，配奶油。', 'Karamellisierte Apfeltarte, umgedreht gebacken, mit Sahne.', 'Torta invertida de maçãs caramelizadas com creme.']);
D('mousse', 'pos', 7800, ['veggie', 'gf'],
  ['Mousse au chocolat', 'Mousse au chocolat', '巧克力慕斯', 'Mousse au Chocolat', 'Mousse au chocolat'],
  ['Chocolate semiamargo y flor de sal. Apta para celíacos.', 'Dark chocolate and fleur de sel. Suitable for coeliacs.', '半苦巧克力配海盐。适合乳糜泻患者。', 'Halbbitterschokolade und Fleur de Sel. Für Zöliakie geeignet.', 'Chocolate meio amargo e flor de sal. Indicada para celíacos.']);
D('crepes', 'pos', 9400, [],
  ['Crêpes', 'Crêpes', '可丽饼', 'Crêpes', 'Crêpes'],
  ['Relleno a elección: Nutella, dulce de leche o jamón y queso.', 'Filling of your choice: Nutella, dulce de leche or ham and cheese.', '馅料任选：Nutella 榛子巧克力酱、牛奶焦糖酱或火腿奶酪。', 'Füllung nach Wahl: Nutella, Dulce de Leche oder Schinken und Käse.', 'Recheio à escolha: Nutella, doce de leite ou presunto e queijo.'],
  [O('Nutella', 'Nutella', 'Nutella 榛子巧克力酱', 'Nutella', 'Nutella'), O('Dulce de leche', 'Dulce de leche', '牛奶焦糖酱', 'Dulce de Leche', 'Doce de leite'), O('Jamón y queso', 'Ham and cheese', '火腿奶酪', 'Schinken und Käse', 'Presunto e queijo')]);
D('macarons', 'pos', 8000, ['veggie'],
  ['Macarons', 'Macarons', '马卡龙', 'Macarons', 'Macarons'],
  ['Elegí tus sabores por color.', 'Pick your flavors by color.', '按颜色选择口味。', 'Wählen Sie Ihre Sorten nach Farbe.', 'Escolha seus sabores por cor.'], null, 'macaron');

/* CAFETERÍA */
D('espresso', 'caf', 3200, [],
  ['Espresso', 'Espresso', '意式浓缩咖啡', 'Espresso', 'Espresso'],
  ['Simple o doble, de grano de especialidad.', 'Single or double, from specialty beans.', '单份或双份，精选咖啡豆。', 'Einfach oder doppelt, aus Spezialitätenbohnen.', 'Simples ou duplo, de grão especial.'],
  [O('Simple', 'Single', '单份', 'Einfach', 'Simples'), O('Doble', 'Double', '双份', 'Doppelt', 'Duplo')]);
D('cafelait', 'caf', 4300, [],
  ['Café au lait', 'Café au lait', '法式牛奶咖啡', 'Café au lait', 'Café au lait'],
  ['Café con leche servido en bol, a la francesa.', 'Coffee with milk served in a bowl, French style.', '法式碗装牛奶咖啡。', 'Milchkaffee in der Schale serviert, französisch.', 'Café com leite servido em tigela, à moda francesa.']);
D('capuccino', 'caf', 4600, [],
  ['Cappuccino', 'Cappuccino', '卡布奇诺', 'Cappuccino', 'Cappuccino'],
  ['Con espuma de leche y cacao. Leche vegetal sin cargo.', 'With milk foam and cocoa. Plant-based milk at no extra charge.', '配奶泡和可可粉。植物奶不加价。', 'Mit Milchschaum und Kakao. Pflanzenmilch ohne Aufpreis.', 'Com espuma de leite e cacau. Leite vegetal sem custo.']);
D('croissant', 'caf', 3500, [],
  ['Croissant', 'Croissant', '羊角面包', 'Croissant', 'Croissant'],
  ['De manteca, simple o con jamón y queso.', 'Butter croissant, plain or with ham and cheese.', '黄油羊角面包，原味或配火腿奶酪。', 'Buttercroissant, pur oder mit Schinken und Käse.', 'De manteiga, simples ou com presunto e queijo.'],
  [O('Simple', 'Plain', '原味', 'Pur', 'Simples'), O('Con jamón y queso', 'With ham and cheese', '火腿奶酪', 'Mit Schinken und Käse', 'Com presunto e queijo')]);
D('pain', 'caf', 3900, [],
  ['Pain au chocolat', 'Pain au chocolat', '巧克力面包', 'Pain au chocolat', 'Pain au chocolat'],
  ['Hojaldre de manteca con barritas de chocolate.', 'Butter puff pastry with chocolate bars.', '黄油酥皮包裹巧克力条。', 'Butterblätterteig mit Schokoladenstäbchen.', 'Massa folhada de manteiga com barras de chocolate.']);
D('merienda', 'caf', 12500, [],
  ['Merienda Ratatouille', 'Ratatouille afternoon set', 'Ratatouille 下午茶套餐', 'Ratatouille-Nachmittagsmenü', 'Lanche Ratatouille'],
  ['Café a elección + croissant + 2 macarons.', 'Coffee of your choice + croissant + 2 macarons.', '任选咖啡 + 羊角面包 + 2 个马卡龙。', 'Kaffee nach Wahl + Croissant + 2 Macarons.', 'Café à escolha + croissant + 2 macarons.'], null, 'merienda');

const CATS = ['ent', 'pri', 'pos', 'caf'];

// Café y croissant disponibles dentro de la merienda
const MERIENDA_COFFEE = ['espresso', 'cafelait', 'capuccino'];
const MERIENDA_CROISSANT = [
  O('Simple', 'Plain', '原味', 'Pur', 'Simples'),
  O('Con jamón y queso', 'With ham and cheese', '火腿奶酪', 'Mit Schinken und Käse', 'Com presunto e queijo')
];

// ---------- Datos ficticios del restaurante ----------
const RESTO = {
  address: 'Av. Corrientes 1234, CABA, Argentina',
  phone: '+54 11 4321-8765',
  email: 'contacto@ratatouille.com.ar',
  instagram: '@ratatouille.bistro',
  map: 'https://www.openstreetmap.org/export/embed.html?bbox=-58.3950%2C-34.6090%2C-58.3790%2C-34.5990&layer=mapnik',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Av. Corrientes 1234, CABA, Argentina'),
  bank: { name: 'Banco Ejemplo', holder: 'Ratatouille Bistro (ficticio)', alias: 'RATATOUILLE.BISTRO', cbu: '0000003100012345678901' }
};

// Número de mesa: viene del QR (?mesa=7). Sin parámetro no se muestra saludo de mesa.
const TABLE = (() => { try { const m = new URLSearchParams(location.search).get('mesa'); return m && /^\d{1,3}$/.test(m) ? +m : null; } catch (e) { return null; } })();

// Fotos de los platos: las del prototipo de Figma (Unsplash). Las que ya se bajaron están en img/; el resto se carga desde Unsplash.
// Si una foto no carga (sin conexión), se muestra img/plato.png.
const UNSPLASH = (id) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=700&q=80';
const PHOTO_ID = {
  sopa: 'photo-1547592166-23ac45744acd', sopaveg: 'photo-1603105037880-880cd4edfb0d', mariscos: 'photo-1559737558-2f5a35f4523b',
  tabla: 'photo-1547592180-85f173990554', nicoise: 'photo-1540420773420-3366772f4999', lentejas: 'photo-1512621776951-a57141f2eefd',
  croque: 'photo-1528735602780-2552fd46c7af', ratatouille: 'photo-1473093295043-cdd812d0e601', boeuf: 'photo-1548869206-93b036288d7e',
  pollo: 'photo-1532550907401-a500c9a57435', steak: 'photo-1544025162-d76694265947', quiche: 'photo-1601050690117-94f5f6fa8bd7',
  quicheesp: 'photo-1625862220431-f8d70c6addda', crepehongos: 'photo-1519671282429-b44660ead0a7', crepearroz: 'photo-1519676867240-f03562e64548',
  coulant: 'photo-1693028848865-0158ea1405c1', tarte: 'photo-1562496928-8616b0a037e4', mousse: 'photo-1579954115545-a95591f28bfc',
  crepes: 'photo-1519676867240-f03562e64548', macarons: 'photo-1569864358642-9d1684040f43'
};
const PHOTO_LOCAL = { sopa: 'img/sopa.jpg',sopaveg: 'img/sopaveg.jpg',mariscos: 'img/mariscos.jpg',tabla: 'img/tabla.jpg',nicoise: 'img/nicoise.jpg',lentejas: 'img/lentejas.jpg',croque: 'img/croque.jpg',ratatouille: 'img/ratatouille.jpg',boeuf: 'img/boeuf.jpg',pollo: 'img/pollo.jpg',steak: 'img/steak.jpg',quiche: 'img/quiche.jpg',quicheesp: 'img/quicheesp.jpg',crepehongos: 'img/crepehongos.jpg',crepearroz: 'img/crepearroz.jpg',coulant: 'img/coulant.jpg',tarte: 'img/tarte.jpg',crepes: 'img/crepes.jpg', espresso: 'img/espresso.jpg', cafelait: 'img/cafelait.jpg', capuccino: 'img/capuccino.jpg', croissant: 'img/croissant.jpg', pain: 'img/pain.jpg', merienda: 'img/merienda.jpg' };
const dishPhoto = (id) => PHOTO_LOCAL[id] || (PHOTO_ID[id] ? UNSPLASH(PHOTO_ID[id]) : 'img/plato.png');

// Eventos (ficticios)
const EVENTS = [
  { day: 5, key: 'dFri', time: '20:00', title: 'Jazz Trio', genre: 'Jazz & Soul', img: 'img/ev-jazz.jpg' },
  { day: 6, key: 'dSat', time: '21:00', title: 'Acoustic Sessions', genre: 'Pop & Rock', img: 'img/ev-acoustic.jpg' },
  { day: 0, key: 'dSun', time: '13:00', title: 'Bossa Nova Lunch', genre: 'Bossa Nova', img: 'img/ev-bossa.jpg' }
];

// Horarios (minutos desde las 00:00; 1500 = 01:00 del día siguiente)
// Los turnos de reserva son cada 30 minutos; el último es 1 hora antes del cierre.
const HOURS = {
  weekday: { days: [1, 2, 3, 4, 5], open: 8 * 60, close: 24 * 60, key: 'h1' },
  sat: { days: [6], open: 9 * 60, close: 25 * 60, key: 'h2' },
  sun: { days: [0], open: 9 * 60, close: 23 * 60, key: 'h3' }
};
const hoursFor = (dow) => HOURS.weekday.days.indexOf(dow) >= 0 ? HOURS.weekday : dow === 6 ? HOURS.sat : HOURS.sun;
const hhmm = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
// Franjas: [clave, desde, hasta] (minutos)
const FRANJAS = [['fr_morning', 0, 11 * 60 + 30], ['fr_noon', 12 * 60, 15 * 60 + 30], ['fr_afternoon', 16 * 60, 19 * 60 + 30], ['fr_night', 20 * 60, 99 * 60]];
