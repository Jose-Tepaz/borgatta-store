# Odontograma — selector de pieza dentaria

Selector visual de variantes con forma de odontograma: 14 columnas × 2 arcadas,
numeración FDI, scroll horizontal en pantallas angostas.

Reemplaza la capa **visual** del variant picker del tema. Toda la mecánica
(precio, disponibilidad, AJAX del carrito) sigue siendo la nativa.

---

## 1. Archivos

| Archivo | Ubicación | Rol |
|---|---|---|
| `odontograma-selector.liquid` | `snippets/` | Genera el markup |
| `odontograma.css` | `assets/` | Estilos del componente |
| `shopify-import-odontograma.csv` | fuera del theme | Plantilla de carga de productos |
| `odontograma-grid.html` | fuera del theme | Mockup autónomo, para diseño |

El mockup no se sube a Shopify. Sirve para iterar el diseño sin desplegar.

---

## 2. Instalación

**2.1** Subir `odontograma-selector.liquid` a `snippets/`.

**2.2** Subir `odontograma.css` a `assets/`.

**2.3** En la sección de producto (`sections/main-product.liquid` o equivalente),
cargar el CSS solo donde se usa:

```liquid
{%- if product.tags contains 'odontograma' -%}
  {{ 'odontograma.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

> El snippet **no** carga su propio CSS. En Shopify un snippet no puede pedir
> hojas de estilo; hay que enlazarlas explícitamente.

**2.4** En el archivo que recorre `product.options_with_values`, bifurcar el
`block-swatch-list` existente:

```liquid
{%- capture option_key -%}option{{ option.position }}{%- endcapture -%}

{%- if product.tags contains 'odontograma' and option.name == 'Pieza' -%}
  {%- render 'odontograma-selector',
        product: product,
        option: option,
        option_name: option_name -%}
{%- else -%}
  <div class="block-swatch-list" data-option-position="{{ option.position }}">
    ... markup original sin tocar ...
  </div>
{%- endif -%}
```

Dos cosas de este paso:

- `{% render %}` **no hereda scope**. Si no se pasan `product`, `option` y
  `option_name`, el snippet renderiza vacío y sin lanzar error.
- La línea del `capture option_key` va **arriba del `if`**. La rama `else` la
  necesita.

**2.5** Verificar en el código fuente de la página (no el inspector) que aparezca
el `<link>` a `odontograma.css`. Que el archivo exista en `assets/` no basta.

---

## 3. Los contratos con `theme.js` ⚠️

**Esta es la sección crítica.** El componente reemplaza el markup de un picker
que el tema espera con una forma específica. Romper cualquiera de estos puntos
tumba el selector Y el carrito al mismo tiempo.

### 3.1 Por qué fallan juntos

El constructor de `ProductVariants` en `theme.js`:

```js
this._updateSelectors(this.currentVariant);   // ← si esto lanza…
this._setupStockCountdown();
this._attachListeners();                      // ← …esto nunca corre
```

Y `_attachListeners` registra las dos cosas:

```js
this.delegateElement.on("change", ".product-form__single-selector", this._onOptionChanged.bind(this)),
this.delegateElement.on("click", '[data-action="add-to-cart"]', this._addToCart.bind(this))
```

Si `_updateSelectors` revienta, no hay handler de cambio de variante ni handler
del botón. Síntomas visibles: el precio no cambia, se agrega siempre la misma
variante, y el formulario se envía nativo llevando al usuario a `/cart`.

**Un solo bug, tres síntomas.** No buscarlos por separado.

### 3.2 Regla A — los `.block-swatch` deben ser hermanos directos

```js
selector.querySelector('.block-swatch:nth-child(' + (valueIndex+1) + ')')
        .classList.toggle('block-swatch--disabled', !available)
```

`:nth-child` cuenta respecto al **padre del elemento**, no respecto a
`selector`. Si los `.block-swatch` se agrupan en contenedores de 5,
`:nth-child(6)` devuelve `null` y explota en el sexto valor.

→ Nada de `<div class="arch">` ni `<div class="group">` envolviendo celdas.
Un solo contenedor, 28 hijos.

### 3.3 Regla B — el orden del DOM es el de `option.values`

`valueIndex` indexa `productOptionsWithValues[0].values`, o sea el orden de
Admin. El DOM tiene que coincidir con ese orden.

→ El loop del snippet recorre `option.values`, **no el mapa**. La posición
anatómica se aplica con CSS Grid vía `--r` y `--c`. **No reordenar el loop.**

### 3.4 Regla C — nunca `disabled` en un input, y el `checked` es obligatorio

Si ningún input del grupo queda marcado, el picker revienta al arrancar.
El `checked` se escribe siempre que coincida con `option.selected_value`,
esté agotada la pieza o no.

Y `disabled` no se usa: una variante agotada tiene que ser seleccionable para
que el tema pueda informar que lo está. De eso se encarga
`_updateAddToCartButton`.

### 3.5 Regla D — el contenido no captura clics

```css
.odo .tooth__label > *{ pointer-events: none; }
```

El tema usa eventos delegados. Si `event.target` es un `SVGUseElement`, su
handler falla leyendo `.tagName` — los SVG no recorren el árbol como los HTML.
Con `pointer-events: none` en los hijos, el evento nace en el `<label>`.

### 3.6 Regla E — el input no debe cubrir la celda

```css
.odo .tooth .block-swatch__radio{
  position: absolute; width: 1px; height: 1px;
  opacity: 0; pointer-events: none; clip-path: inset(50%);
}
```

Un input que cubra el cuadrito intercepta el clic. El radio se marca por
comportamiento nativo del navegador, pero el handler del tema nunca lo ve, y el
`<select name="id">` se queda con la variante anterior. El `<label for>` es el
único objetivo de clic.

### 3.7 Regla F — los placeholders van al final y sin clases `block-swatch*`

Las piezas sin variante (`na`) se renderizan **después** de los 28
`.block-swatch` para no desplazar el conteo `:nth-child`, y sin esas clases
porque `custom.js` hace:

```js
list.querySelectorAll(".block-swatch").forEach(function(swatch){
  var input = swatch.querySelector(".block-swatch__radio"), val = input.value;
```

Un `.block-swatch` sin input lanzaría `null.value`.

---

## 4. Modelo de datos

### 4.1 Una sola opción

| | |
|---|---|
| Nombre de la opción | `Pieza` |
| Valores | Números FDI a secas: `11`–`17`, `21`–`27`, `31`–`37`, `41`–`47` |
| Variantes | Una por posición. SKU e inventario propios. |

Sin prefijos tipo `UR-17`: el número FDI ya es único en toda la boca. El primer
dígito es el cuadrante, el segundo la posición.

### 4.2 Restricción: `Pieza` debe ser la única opción

El snippet resuelve la variante con:

```liquid
{%- assign v = product.variants | where: option_key, tooth | first -%}
```

Con una segunda opción (Pieza + Material), eso devuelve la primera coincidencia
en pieza **ignorando** la otra opción seleccionada — el `id`, el precio y el
stock mostrados pueden ser de la combinación equivocada.

Si algún producto lo necesita, hay que reemplazar esa línea por el matching
anidado del `block-swatch-list` original (recorrer `product.variants` exigiendo
que todas las demás opciones coincidan con su `selected_value`).

### 4.3 Preset vs subset

Dos cosas distintas que conviene no confundir:

| | Qué define | De dónde sale |
|---|---|---|
| **Mapa** (`ODO_MAP`) | Qué posiciones se **dibujan** | Constante del theme |
| **Subset** | Qué posiciones se pueden **comprar** | Qué variantes existen |

Un producto que solo cubre premolares y anteriores no necesita configuración:
se crean sus 20 variantes y las 8 posiciones de molares se pintan como `na`.
No hay metafield que declarar.

---

## 5. Cargar productos

### 5.1 Con CSV (recomendado)

Usar `shopify-import-odontograma.csv` como plantilla. Estructura obligatoria de
Shopify: la **primera fila** lleva los datos del producto; de la segunda en
adelante solo se repite el `Handle` y cambian las columnas de variante.

Para adaptarla:

1. Cambiar `Handle`, `Title`, SKU y precio.
2. **Borrar las filas de las piezas que ese producto no cubre.**
3. Confirmar que `Tags` incluya `odontograma` — es el interruptor del selector.
4. Está en `draft` a propósito. Revisar antes de publicar.

### 5.2 Reglas que sí importan

**El valor debe coincidir exacto con el mapa.** `17`, no `#17`, no `Pieza 17`,
no `17 ` con espacio final. Cualquier variación y esa pieza no se renderiza —
y peor, `theme.js` va a fallar al indexarla. El aviso amarillo del editor de
temas lo detecta.

**Solo crear variantes de las piezas que se venden.** No inventar variantes con
stock 0 para rellenar: eso las marca como "agotada", que es un mensaje distinto
y falso.

**El orden en Admin da igual** para el layout, pero define cuál queda
preseleccionada.

### 5.3 Inventario

El CSV trae `Variant Inventory Tracker: shopify` y `Policy: deny`. Eso es lo que
hace que el estado `out` aparezca solo cuando de verdad se acabó.

Con `Policy: continue`, `variant.available` es siempre `true` y el tachado nunca
se activa. Si estas piezas se fabrican bajo pedido, puede ser lo correcto —
pero es una decisión, no un descuido.

> Si el CSV importa pero las cantidades quedan en 0, el producto entero sale
> "Agotado". Revisar la columna de inventario en Admin: es el primer sospechoso
> cuando las 28 piezas salen tachadas.

---

## 6. El mapa canónico

```liquid
{%- assign ODO_MAP = '17,16|15,14,13,12,11|21,22,23,24,25|26,27;47,46|45,44,43,42,41|31,32,33,34,35|36,37' -%}
```

| Separador | Significa |
|---|---|
| `;` | Fila (arcada superior / inferior) |
| `\|` | Grupo (recuadro redondeado) |
| `,` | Pieza |

Debe ser la **unión de todas las posiciones del catálogo completo**. Una variante
con un valor fuera del mapa es inalcanzable.

Del mapa se derivan solos: el número de columnas, el ancho de celda, la
plantilla de pistas del grid, el tono de cada grupo (primero y último = molares,
más oscuros) y los bordes redondeados de los extremos.

**Para agregar terceros molares** (16 columnas):

```
18,17,16|15,14,13,12,11|21,22,23,24,25|26,27,28;48,47,46|45,44,43,42,41|31,32,33,34,35|36,37,38
```

**Ambas filas deben tener los mismos tamaños de grupo.** La plantilla de pistas
se construye desde la primera fila y se aplica a las dos; si difieren, las
columnas se desalinean.

### 6.1 Modo compacto

```liquid
{%- assign odo_compact = false -%}
```

`false` dibuja el mapa completo con huecos punteados. La pieza 13 está siempre en
la misma columna, en todos los productos, y la ausencia se comunica sola.

`true` dibuja solo lo que ese producto vende. Menos espacio muerto, pero el
cuadro cambia de forma entre productos.

Recomendado `false`: en un catálogo donde la diferencia entre modelos *es* qué
piezas incluye, mostrar el hueco es información.

---

## 7. Estados

| Estado | Condición | Aspecto | Interactivo |
|---|---|---|---|
| `ok` | Variante con stock | Silueta blanca, trazo oscuro | Sí |
| `out` | Variante sin stock | Gris, número tachado, diagonal | Sí — el botón informa |
| `na` | No existe variante | Trazo punteado, sin relleno | No, sin input |

`theme.js` además agrega la clase `block-swatch--disabled` por su cuenta; el CSS
la estiliza igual que `out`.

---

## 8. Dimensionamiento

```css
--cell: clamp(var(--cell-min), calc(88cqi / var(--cols)), var(--cell-max));
```

La celda **no** usa `fr`. Con `repeat(14, 1fr)` el grid siempre reparte el ancho
disponible: las celdas se aplastan sin límite y nunca hay overflow, así que el
scroll jamás aparece.

Con `clamp` la celda se encoge de 62 a 36px mientras hay espacio, y al llegar al
piso el contenido excede el contenedor: el `overflow-x: auto` del padre activa el
scroll por sí solo. Un solo valor define el punto de quiebre, sin media queries.

`cqi` en lugar de `vw` porque responde al **contenedor**, no al viewport —
necesario dentro de una sección de Shopify con padding o en el editor de temas.

Perillas de ajuste: `--cell-min` (cuándo entra el scroll) y `--cell-max`
(tamaño máximo en desktop).

---

## 9. Personalización

**Colores.** Los tokens están en `.odo`, no en `:root`, para no filtrarse al
tema. Para usar la paleta de marca: `--c-accent: var(--color-primary);`

**Siluetas.** Cuatro `<symbol>` en el sprite, asignados desde el segundo dígito
FDI: `1–2` incisivo, `3` canino, `4–5` premolar, `6–8` molar. En dentición
decidua no hay premolares, por eso la condición evalúa también el cuadrante
(`p <= 5 and q <= 4`).

Para siluetas anatómicas reales por pieza: agregar más `<symbol>` al sprite, no
mover los SVG a metafields. Un SVG exportado trae `<defs>` y `id` generados que
colisionan al inyectar 28 en la misma página, y sus `fill`/`stroke` como
atributos pisan el CSS del estado seleccionado.

**Si se agregan siluetas reales, quitar esta regla:**

```css
.odo .tooth[data-row="2"] .tooth__icon{ transform: scaleY(-1); }
```

Voltear una forma estilizada funciona; voltear una anatómica se nota mal.

**Imagen real por variante.** El metafield `custom.icono_de_variante` (tipo URL)
funciona como override: si trae URL gana sobre la silueta. Útil para
radiografías o fotos clínicas, no para las siluetas base.

**Clases genéricas.** `.tooth` es un nombre común. Si choca con algo del tema,
buscar y reemplazar por `.odo-tooth` en el snippet y en el CSS.

---

## 10. Diagnóstico

Pegar en la consola, en la página del producto:

```js
(() => {
  const form = document.querySelector('form[action^="/cart/add"]');
  const sel = form?.querySelector('select[name="id"]');
  const checked = form?.querySelector('.odo .product-form__single-selector:checked');
  console.table({
    url: location.search,
    selectValue: sel?.value,
    optsDisabled: sel ? [...sel.options].filter(o => o.disabled).length + '/' + sel.options.length : 'sin select',
    piezaMarcada: checked?.value ?? 'NINGUNA',
    variantIdMarcado: checked?.dataset.variantId ?? '—',
    coinciden: sel?.value === checked?.dataset.variantId,
    botonDisabled: form?.querySelector('.product-form__add-button')?.disabled,
    radiosEnOdo: form?.querySelectorAll('.odo .product-form__single-selector').length,
    blockSwatchList: !!document.querySelector('.block-swatch-list')
  });
})()
```

Correrlo, hacer clic en otra pieza, correrlo otra vez.

`coinciden: true` y la URL cambiando = todo bien. `coinciden: false` = el tema no
está sincronizando el `<select name="id">`, que es el único campo que Shopify lee
al enviar el formulario.

### 10.1 Tabla de síntomas

| Síntoma | Causa probable |
|---|---|
| Cuadro vacío | Variables no pasadas en el `{% render %}` |
| Sin fondos ni columnas | `odontograma.css` no está enlazado |
| Las 28 piezas tachadas | Inventario en 0 en Admin |
| Todas punteadas | Los valores de opción no coinciden con el mapa |
| No cambia el precio, agrega siempre la misma pieza, y va a `/cart` | Excepción en `_updateSelectors` — revisar las reglas A a F |
| Aviso amarillo en el editor | Hay variantes fuera del mapa |

### 10.2 Buscar la excepción

`theme.js` está minificado en 27 líneas: los números de línea de DevTools son de
la versión embellecida y no sirven para buscar en el archivo. Usar búsqueda por
contenido:

```js
(async () => {
  const src = [...document.querySelectorAll('script[src]')].map(s => s.src)
    .find(s => /assets\/theme\.js/.test(s));
  const txt = await (await fetch(src)).text();
  const i = txt.indexOf('key:"_updateSelectors"');
  console.log(txt.slice(i, i + 2600));
})()
```

Y filtrar la consola por `Logged` — el tema envuelve la inicialización de cada
sección en un `try/catch` con ese prefijo, y el mensaje se pierde fácil entre el
ruido de los apps.

---

## 11. Pendientes y deuda técnica

**Recarga de página al cambiar variante.** Hay un `setInterval` de 500ms en el
bloque `.custome-tags` que recarga la página cuando cambia la URL. Existe porque
ese bloque pinta metafields de variante y Liquid solo corre en el servidor. Con
28 posiciones, recargar en cada clic se siente mal.

Alternativa sin recarga: renderizar los N bloques de una vez y alternarlos.

```liquid
<div class="custome-tags">
  {%- for variant in product.variants -%}
    <div data-variant-meta="{{ variant.id }}"
         {% unless variant.id == product.selected_or_first_available_variant.id %}hidden{% endunless %}>
      ... contenido usando `variant` ...
    </div>
  {%- endfor -%}
</div>
```

```js
document.addEventListener('change', (event) => {
  const input = event.target.closest('.product-form__single-selector');
  if (!input?.dataset.variantId) return;
  document.querySelectorAll('[data-variant-meta]').forEach(el => {
    el.hidden = el.dataset.variantMeta !== input.dataset.variantId;
  });
});
```

Instantáneo y sin red. Si el contenido por variante es pesado, la opción correcta
es la Section Rendering API.

**Metafield invertido en la rama `else`.** El `block-swatch-list` original tiene
`variant.metafields.icono_de_variante.custom` — namespace y clave al revés. El
orden es `metafields.NAMESPACE.KEY`, o sea `metafields.custom.icono_de_variante`.
Como está, devuelve `nil` siempre y ningún ícono se muestra en los productos
normales. Se confirma en el JSON `data-variant-icons`: todos los valores en
`null`. No afecta al odontograma.

**Precio por variante.** Hoy las 28 piezas cuestan lo mismo, así que cualquier
desfase en el precio mostrado es inocuo por accidente. El día que una pieza
tenga precio distinto, deja de serlo.

**Sprite duplicado.** Está al final del snippet, lo cual funciona con una sola
llamada por página. Si el tema renderiza el picker dos veces (quick-view, barra
sticky de compra), habría ids duplicados y los `<use>` apuntarían al elemento
equivocado. Solución: mover el `<svg width="0">` a un snippet aparte y llamarlo
una vez desde la sección.

**Interruptor por tag.** `product.tags contains 'odontograma'` no requiere
definiciones y se ve de un vistazo en la lista de productos, pero cualquiera
puede quitar un tag sin saber qué rompe. Si el catálogo crece, cambiar a un
metafield booleano `custom.usa_odontograma`.

**Apps que tocan el formulario.** La tienda tiene Free Shipping Bar (inyecta
`data-fsb-cart-form-listener-added` y envuelve `window.fetch`) y un app de
opciones de producto (`gpomain.js`). Ninguno interfiere hoy, pero son los
primeros sospechosos si aparece comportamiento raro al agregar al carrito.

**Preselección forzada.** Shopify siempre resuelve una variante: al cargar la
página hay un diente marcado, normalmente el primero del mapa. El cliente puede
agregar al carrito sin haber elegido nunca. Si se quiere obligar a una elección
deliberada hay que quitar el `checked`, deshabilitar el botón hasta el primer
`change`, y dejar de confiar en `option.selected_value` — lo cual entra en
conflicto directo con la Regla C. Requiere diseño aparte.

---

## 12. Historial de fallos resueltos

Se documentan porque explican por qué el código es como es. Ninguno era
predecible sin romperlo primero, y todos son la misma categoría: markup
rompiendo supuestos no documentados del tema.

1. **Faltaban las clases `block-swatch*`** → el JS no encontraba el contenedor.
2. **Faltaba el `checked`** → con todas las variantes agotadas, ningún input
   quedaba marcado y el picker reventaba al arrancar.
3. **El input cubría la celda** → interceptaba el clic; el radio se marcaba pero
   el tema no se enteraba.
4. **El clic aterrizaba en el `<use>` del SVG** → el handler delegado falla con
   targets SVG.
5. **Los `.block-swatch` estaban anidados en grupos** → `:nth-child(6)` devolvía
   `null`. Esta era la causa raíz de los tres síntomas principales.

**Lección para cualquier otro selector personalizado en este tema:** el markup
del picker es un contrato implícito. Antes de reemplazarlo, leer
`ProductVariants._updateSelectors` y `_attachListeners` en `theme.js`, y
`updateBlockSwatchIcons` en `custom.js`.