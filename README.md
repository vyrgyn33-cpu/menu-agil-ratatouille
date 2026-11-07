# Menú Ágil Ratatouille — Web

Proyecto académico (Ingeniería del Software 1, ISFT N.º 182). Datos, precios y pagos **ficticios**: nada se cobra de verdad.

## Uso
Abrir `index.html` en el navegador (no necesita servidor) o publicar la carpeta en GitHub Pages.
- Cliente: `index.html` (opcional `?mesa=7` para el saludo de mesa).
- Cocina/despacho: `despacho/index.html`.

## Funciones
- 5 idiomas (es, en, zh, de, pt) y 5 monedas (ARS, USD, BRL, EUR, CNY); precios base en ARS convertidos con tasas fijas.
- 8 métodos de pago simulados (efectivo, transferencia, Mercado Pago, PayPal, Pix, Wero, Alipay, WeChat Pay), con recomendados según moneda.
- Filtros combinados, carrito, delivery, macarons armables, reservas con horarios por día.
- Datos guardados en localStorage (rata_*).

## Fotos
Las fotos de los platos están en `img/` (tomadas del prototipo de Figma). Solo Mousse y Macarons usan Unsplash y, sin internet, muestran `img/plato.png`.

## Publicar en GitHub Pages
1. Subir el contenido de esta carpeta a un repositorio.
2. Settings → Pages → Branch `main` / root → Save.
3. Abrir la URL que indica GitHub.
