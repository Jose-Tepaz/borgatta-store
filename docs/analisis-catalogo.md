# Análisis del archivo de catálogo

Fecha de consulta: 2026-11-08.
Estado: observaciones del archivo; complementar con la [revisión posterior de Plytix](plytix.md). El mapeo de importación detallado sigue pendiente.
Fuente: [Catalogo_borgatta](https://docs.google.com/spreadsheets/d/1U0-cIhzxqfe5GzHJoSc0rfEsiDmFB3QtyXPUNMl7EP0/edit), leído mediante Google Drive y Google Sheets, sin modificaciones.

## Formato y alcance

Los metadatos directos confirman que es un Google Sheet nativo. El equipo lo llama «Excel». La respuesta anterior del lector de texto lo había presentado como XLSX; para identificar el formato se usaron los metadatos directos y la lectura nativa de celdas.

El enlace proporcionado abre `Master` (gid `1294555708`). Se inspeccionaron los valores de las cinco pestañas y muestras de fórmulas. No se auditó cada fórmula, validación, formato ni configuración de integración.

## Pestañas

| Pestaña | Observación |
| --- | --- |
| Master | Catálogo central: 55 columnas con encabezado (A:BC), 1,986 filas con valores debajo del encabezado; última fila con valores: 1988. Son filas de catálogo, no un conteo de productos únicos publicados. |
| Pesos de bandas | Datos de bandas con SKU, agrupaciones y pesos. Su uso automático no está confirmado. |
| Envío de impresoras | Tabla de equipos, precios, dimensiones y costos de envío con seguro a Tijuana y Cancún. |
| Almacen | Datos de SKU, relación de variantes, nombre, precio y moneda; también contiene el tipo de cambio usado en fórmulas de Master. |
| Sheet4 | Tabla de 22 entradas numeradas de colores y surtidos. Su relación con la integración no está confirmada. |

## Estructura de Master

- **A:F:** SKU, relación `Variación de`, clave SAT, línea comercial, familia y nombre (`Label`).
- **G:I:** nombres de hasta tres opciones de variante.
- **J:Z:** atributos como piezas, arcada, posición, cantidad, calibre, tamaño, color y orden.
- **AA:** descripción; algunas incluyen HTML.
- **AB:AG:** precio público con IVA, moneda y precios finales para MXN, EUR, GTQ y PA.
- **AH:AN:** peso, dimensiones, peso volumétrico, peso final y caja propia.
- **AO:BC:** indicadores para Shopify y catálogos por país, SKU y relaciones regionales, y `Test Products`.

Se observaron 1,657 filas con `Variación de` y 329 sin ese valor. Ejemplo: `Master!A7:B10` muestra el agrupador `GCP-68-162-072` y variantes que lo referencian. Una relación vacía por sí sola no distingue un producto simple de un padre. Al comparar identificadores quitando espacios de los extremos, todas las referencias de `Variación de` encuentran al menos un SKU en Master; esto no valida la unicidad ni el modelo de importación.

## Fórmulas verificadas en muestras

- `Master!AD2:AD5`: si la moneda es USD, multiplica el precio de AB por `Almacen!H8`; si es MN, conserva AB; si está vacía, deja el resultado vacío.
- `Almacen!H8`: valor observado **19**, bajo el encabezado «Tipo de Cambio USD a MXN». Es un parámetro del archivo, no una cotización de mercado verificada.
- `Master!AL2:AL5`: peso volumétrico = profundo × ancho × altura / 5000.
- `Master!AM2:AM5`: peso final = máximo entre peso volumétrico y peso de AH.

Se verificaron también muestras cercanas al final del catálogo. Las unidades y la vigencia de estos criterios están pendientes de confirmar.

## Indicadores observados

Conteos por fila de Master, incluyendo padres y variantes; no equivalen a productos publicados ni prueban la configuración de las listas de Plytix.

| Columna | INCLUIDO | NO INCLUIDO | Vacío | Otro |
| --- | ---: | ---: | ---: | --- |
| Shopify México (AO) | 1,887 | 48 | 51 | — |
| Catálogo México (AP) | 1,886 | 48 | 52 | — |
| Test Products (AQ) | 1,872 | 48 | 66 | — |
| Catálogo Guatemala (AU) | 286 | 1,582 | 118 | — |
| Catálogo Panamá (AY) | 256 | 1,608 | 122 | — |
| Catálogo España (BC) | 75 | 1,036 | 861 | 14 con `INLCUIDO` |

Las columnas Shopify Guatemala, Panamá y España contienen valores vacíos y `NO INCLUIDO`, sin `INCLUIDO` en la lectura actual. No se deduce de ello el estado real de esas tiendas.

## Hallazgos que requieren revisión

1. **Cinco SKU repetidos al quitar espacios de los extremos:** `KIT90-089` (filas 3, 4), `GCP-80-401` (540, 911), `GCP-COMBO-80400` (573, 908), `GCP-BOR-507` (595, 1272) y `300-660` (596, 1279). Confirmar si son duplicados indebidos y cómo resuelve Plytix las coincidencias antes de corregirlos.
2. **56 filas con espacios en los extremos del SKU.** Ejemplo: `Master!A24` contiene `GCP-90-016-00 ` con espacio final. No se ha verificado si la importación normaliza estos valores.
3. **14 valores `INLCUIDO` en Catálogo España**, diferentes de `INCLUIDO`: filas 74, 321–325 y 328–335. Pueden quedar fuera de filtros de igualdad exacta; el efecto real depende del mapeo.
4. **Referencias rotas en pestañas auxiliares:** 1,122 celdas con `#REF!` repartidas en 282 filas de Almacen y 45 celdas en 9 filas de Envío de impresoras. Las celdas inspeccionadas de `Envío de impresoras!C2:G3` contienen literalmente la fórmula `=#REF!`. No se observaron valores de error en Master en la lectura completa; no se ha demostrado que estos errores afecten Shopify.
5. **Revisar la última fila:** `Master!A1988` contiene `el fil de OD ` como SKU. Puede ser una nota o una carga incompleta; su intención está pendiente de confirmar.

## Siguiente verificación operativa

Identificar en Plytix qué pestaña y columnas se importan, la clave de coincidencia, el tratamiento de espacios y duplicados, los campos sobrescritos y contrastar los SKU con la lista `Shop Mexico`, cuyo filtro `Shopify México equals INCLUIDO` ya se confirmó en la [revisión de Plytix](plytix.md). Esto permitirá distinguir defectos del archivo de problemas que realmente se propagan al canal `Shopify México`.
