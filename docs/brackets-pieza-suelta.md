# Brackets pieza suelta: alta de productos en Shopify

Estado: confirmado para la estructura observada en Shopify y en el excel de carga; los puntos marcados como pendientes faltan por confirmar.
Última actualización: 2026-11-26.
Fuente: lectura de la Admin API de Shopify (productos con tag `odontograma`), el CSV de carga «Brackets piezas sueltas_catalogo - Master» y las decisiones de José del 2026-11-26 en el ticket PRO-2162.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Describe cómo se dan de alta en Shopify los productos de la familia «Bracket pieza suelta», que se venden por diente con el selector de odontograma. La iniciativa está repartida en los tickets PRO-2028 (estructural; X-Pression, Nova y Active), PRO-2159, PRO-2160, PRO-2161 y PRO-2162 (Mirage).

El funcionamiento técnico del selector está en la [documentación del odontograma](../assets/odontograma-doc.md). Este documento cubre los datos del producto.

## Reglas y contexto

- **No pasan por Plytix.** Plytix no acepta SKUs repetidos, y estos productos los comparten: la misma pieza física aparece en varios productos y en varias posiciones. Se crean directo en Shopify y quedan fuera del flujo de la [gestión del catálogo](gestion-catalogo.md).
- **El excel de carga manda.** Fuente: [Brackets piezas sueltas_catalogo](https://docs.google.com/spreadsheets/d/1HH8K6YyzUfo0azUOyXp5Kh01tbtwK161ZLcjPhRdodw/edit?gid=1294555708#gid=1294555708), pestaña Master. Si un ticket dice otra cosa, se deja como comentario en el ticket y se carga lo del excel. Decisión de José, 2026-11-26.
- **Un SKU padre es un producto de Shopify, y cada fila hija es una variante.** En el excel, la fila padre tiene `Variación de` vacío. Las hijas apuntan al padre en `Variación de`.

### Cómo se mapea cada columna del excel

| Shopify | Valor | Origen en el excel |
|---|---|---|
| Título | Texto de `Label` de la fila padre | `Label` |
| Opción | Una sola opción llamada `Pieza` | Fija |
| Valor de la opción | Número FDI: UR = 1x, UL = 2x, LL = 3x, LR = 4x; el dígito de la posición se conserva (UR1 = 11, LL5 = 35, UR6 = 16) | `Cuadrante` de la fila hija |
| SKU de la variante | SKU de la fila hija; puede repetirse entre variantes y productos | `SKU` |
| Precio de la variante | Precio en MXN | `Precio final MXN` (columna AD) |
| Metafield `VariantName.variantname` (texto de una línea) | Nombre de la variante; se muestra en la página de producto (`snippets/variant-meta.liquid`) | `Label` de la fila hija |
| Metafield `custom.icono_de_variante` (URL) | Ícono del diente: `https://cdn.shopify.com/s/files/1/0588/7721/4871/files/<FDI>.svg` | Fijo según la pieza |
| Tags | `odontograma` más la marca (`Borgatta`, `Black`, `iLine`, `Glint`…) | `odontograma` es obligatorio |
| Template | `odontograma` | Fijo |
| Vendor | `Tienda Borgatta` | Fijo |
| Inventario | Con seguimiento y política «no vender sin existencias» (`DENY`) | Ver [documentación del odontograma §5.3](../assets/odontograma-doc.md) |

La colección «Bracket pieza suelta» (`bracket-pieza-suelta`) es automática: incluye todo producto con el tag `odontograma`. Ojo: un producto de prueba con ese tag también aparece en ella si está activo.

### Cantidad de variantes por modelo

- **20 variantes:** brackets de UR1–UR5, UL1–UL5, LL1–LL5 y LR1–LR5 (piezas 11–15, 21–25, 31–35, 41–45).
- **24 variantes («c/tubos p/6»):** las 20 más los tubos del 6 (16, 26, 36 y 46).
- **28 variantes:** las 20 más los tubos del 6 y del 7 (16, 17, 26, 27, 36, 37, 46 y 47).
- **14 variantes:** modelos infantiles. Se verifican contra el excel; no se deducen.

El odontograma dibuja siempre las 28 posiciones. Las que el producto no vende se muestran como «no disponible».

## Procedimiento

1. Buscar en Shopify si el producto ya existe, por título o con el tag `odontograma`. Varios se crearon en borrador antes de su ticket.
2. Si falta, duplicar un producto hermano del mismo modelo y cantidad de piezas, con `productDuplicate` y estado `DRAFT`. Así hereda template, tags, opción, íconos y metafields.
3. Reemplazar con los datos del excel el título, el SKU, el `VariantName.variantname` y el precio de cada variante (`productVariantsBulkUpdate`).
4. Comparar con un script cada variante de Shopify contra el excel: pieza FDI, SKU, nombre, ícono y precio.
5. Activar el seguimiento de inventario y cargar existencias. Cargar existencias requiere el scope `write_inventory` (ver [acceso a la Admin API](acceso-admin-api.md)).
6. Cambiar a `UNLISTED` para revisar por link directo, y a `ACTIVE` cuando se autorice la publicación.

Cada escritura en Shopify requiere autorización explícita de José, según las reglas de `CLAUDE.md`.

## Excepciones y validación

- **Errores de texto en el excel.** En el 2026-11 se encontró que las piezas LL4 y LL5 de `GCP-300-580-PS` y `GCP-300-581-PS` decían «LR4»/«LR5» en `Label`. Se corrigió en Shopify, pero falta corregirlo en el excel.
- **Validación en la tienda.** Para la revisión del odontograma en cada página, seguir el diagnóstico de la [documentación del odontograma §10](../assets/odontograma-doc.md).
- **Límite de peticiones.** El storefront responde 429 si se consultan muchas páginas seguidas. Espaciar las peticiones varios segundos.

## Pendientes

- Precios de X-Pression y Nova: en Shopify están ~10 % por debajo del `Precio final MXN` del excel, sin causa documentada. Los Mirage tenían la misma diferencia y se corrigieron al precio del excel el 2026-11-26.
- Imágenes de producto de los Mirage.
- Responsable de mantener el excel de carga.

## Decisiones e historial

- 2026-11-26: el excel de carga manda sobre el ticket (José, PRO-2162).
- 2026-11-26: los Mirage usan el `Precio final MXN` del excel (José, PRO-2162).
- 2026-11-26: se creó `GCP-300-581-PS` duplicando `GCP-300-580-PS`; los 11 Mirage quedaron `UNLISTED` con seguimiento de inventario (PRO-2162).

## Referencias

- [Documentación del odontograma](../assets/odontograma-doc.md)
- [Gestión del catálogo](gestion-catalogo.md)
- [Acceso a la Admin API](acceso-admin-api.md)
- Tickets en Linear: PRO-2028, PRO-2159, PRO-2160, PRO-2161, PRO-2162.
