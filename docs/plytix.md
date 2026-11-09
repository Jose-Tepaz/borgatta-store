# Plytix: importación y distribución a Shopify México

Última actualización: 2026-11-08.
Fuentes: aclaración del usuario y revisión de lectura de la sesión abierta de Plytix en Opera GX. No se modificaron configuraciones ni se ejecutaron procesos.

## Contexto confirmado por el usuario

Shopify México es la única tienda con ventas. Los productos con `Shopify México = INCLUIDO` se envían allí. Los demás destinos son catálogos con poca administración.

## Identificadores verificados en la interfaz

| Entidad | Nombre observado | Referencia |
| --- | --- | --- |
| Feed de importación | Borgatta_Google_Sheet | [Feed](https://pim.plytix.com/imports/feeds/63eb35bb31aaaecc77645551) |
| Lista global | Shop Mexico | [Smart List](https://pim.plytix.com/lists/products/smart/653aab6b85daaf544316cbdf) |
| Atributo que determina inclusión | Shopify México | Filtro `equals INCLUIDO` |
| Canal principal | Shopify México | [Canal](https://pim.plytix.com/channels/62ce0bcc5a57204bac2d764e) |

Estos nombres corrigen la descripción inicial de la conversación, donde la lista se llamó `Shopify México` y el canal `Shopify Mexico`. La pantalla del canal muestra `Shop Mexico` como lista seleccionada y 1,884 registros, igual que el resultado de la Smart List. Estos registros incluyen variantes; no equivalen al número de productos padre en Shopify.

## Importación desde el archivo

El feed está activo y programado diariamente a las **09:00**, zona **America - Mexico City**. Su origen es una URL CSV del mismo archivo de catálogo:

`https://docs.google.com/spreadsheets/d/1U0-cIhzxqfe5GzHJoSc0rfEsiDmFB3QtyXPUNMl7EP0/gviz/tq?tqx=out:csv&sheet=Hoja1`

La URL pide `Hoja1`, aunque los metadatos actuales del archivo muestran `Master`. El log del 8 de noviembre contiene 1,986 filas y las primeras coinciden con Master, incluidos los dos registros `KIT90-089`. Esto demuestra que llegan datos de catálogo; no demuestra cómo Google resuelve el nombre de pestaña de esa URL. No cambiarla sin comprobar la respuesta CSV y la configuración de importación.

En Profiles se observaron tres nombres: `14Feb2023-ImportCompleto`, `23 de Abril del 2023` y `Mayo 25 - import del feed`. No se verificó cuál está asociado al feed ni su mapeo.

## Resultados de la importación

El [log del 8 de noviembre](https://pim.plytix.com/imports/log/6af08e80ee7de91c78345e53) muestra inicio a las 09:00:18 y el listado de logs registra el proceso a las 09:01:44. Resultado: `Warning`, con 5 filas bajo ese filtro entre 1,986:

- Línea 1721: `GCP-61-101`.
- Línea 1786: `GCP-61-301`.
- Línea 1851: `GCP-61-412-01`.
- Línea 1916: `GCP-61-432-01`.
- Línea 1981: `GCP-81-564`.

Las líneas son las del log y no deben confundirse con números de fila del Sheet. En el primer registro se abrió el detalle y se verificó el mensaje **`Parent GCP-61-101 cannot be the product itself.`** La causa de los otros cuatro todavía no se abrió ni confirmó.

Las dos entradas de `KIT90-089` muestran `Update / Success`. Esto no verifica cuál de los valores termina persistido ni que la duplicidad sea correcta. Los logs del 6 y 7 de noviembre también muestran `Warning`; el 4 de noviembre hay importaciones anteriores con `Error`. No se investigaron sus causas históricas.

## Distribución a Shopify

El canal está `Live` y muestra `Scheduled (Daily)`. Los procesos de los días 6, 7 y 8 de noviembre muestran `Finished / Success`, con 311 en la columna Products. El 8 comenzó a las 09:15:41 y terminó a las 09:18:41.

No equiparar los 311 del proceso con los 1,884 registros de la lista: falta verificar cómo cuenta el canal padres, variantes y registros procesados. La zona horaria y la hora exacta configuradas del canal no se abrieron; las 09:15 son una observación del historial.

## Mapeo observado del canal

| Origen en Plytix | Destino en Shopify | Regla observada |
| --- | --- | --- |
| Label | Title | Directo |
| Handel Shop Mexico | Handle | Nombre del atributo tal como aparece |
| Descripción | Description | Directo |
| Status | Status | Draft → draft; Completed → active; fallback draft |
| Published | Published | Atributo configurado |
| Familias (transformación) | Collections | Combina familia, familias adicionales y atributos de promociones/bundles |
| Transformación de etiquetas | Tags | Combina línea comercial, familia, producto nuevo, Buen Fin y productos nuevos |
| Fotografías | Image gallery | Directo |
| Option 1/2/3 Name | Option 1/2/3 Name | Directo |
| Transformaciones de opciones | Option 1/2/3 Value | Seleccionan el atributo según el nombre de opción; la fórmula visible está truncada |
| Orden | Variant position | Ascendente |
| SKU | SKU | Directo |
| ifprice | Price | `IFBLANK($ATT.PRECIO,0.0)` |
| Inventory | Inventory management | Directo; no demuestra sincronización de cantidades de inventario |
| Peso (transformación) | Weight | `IFBLANK($ATT.PESO, "0.1")` |
| kg (transformación) | Weight unit | Constante `"kg"` |

El indicador superior de Mapping muestra 40; no se interpreta como 40 campos necesariamente poblados. Compare at Price, Barcode y Vendor aparecen sin atributo asignado en esta revisión. No se ha verificado la política de sobrescritura para esos campos.

La transformación de Tags visible no incluye explícitamente `odontograma`. Antes de cambiar etiquetas, comprobar cómo preserva o reemplaza el conector las etiquetas existentes: ese tag activa el selector del theme. Esta es una dependencia a investigar, no un fallo demostrado.

## Metafields y ajustes

La pestaña Metafields muestra un indicador de 22. Se observaron mapeos para ficha técnica, PDF y videos en producto, y atributos de variante como arcada, calibre, cantidad, clave SAT, con gancho, convertibilidad, modelo, posición, refacción, tamaño, nombre, descripción, ficha técnica, icono, piezas, tipo y videos. Validar namespace y key exactos antes de usarlos en código.

En Settings, la política para metafields sin valor es **Do nothing. Skip the empty values**. El interruptor **Sync alt text to Shopify** se observó desactivado. No se modificaron.

## Listas para objetivos específicos

El índice muestra 46 listas, combinando Smart y Static. Se observaron, entre otras, listas de AMIC NOV 2026, bundles, descuentos, productos nuevos y grupos de productos. No se inspeccionaron sus miembros ni se confirmó que todas distribuyan datos al canal principal. Usar el ID y tipo para distinguir nombres parecidos, por ejemplo `Productos Nuevos` (Smart) y `Productos nuevos` (Static).

## Pendientes

- Perfil y mapeo de importación efectivos; política de valores vacíos, duplicados y normalización.
- Causa de las otras cuatro advertencias y estado final de productos afectados.
- Resolución de `sheet=Hoja1` frente a `Master`.
- Programación exacta del canal y zona horaria.
- Diferencia entre 1,887 filas INCLUIDO del archivo y 1,884 registros de la lista, mediante comparación de SKU; no atribuir la causa sin comprobarla.
- Campos sobrescritos y preservación de etiquetas, especialmente `odontograma`.
