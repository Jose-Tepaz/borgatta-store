# Gestión del catálogo: Excel, Plytix y Shopify

Estado: flujo general confirmado por el usuario; detalles técnicos pendientes.
Última actualización: 2026-11-08.
Fuentes: explicación del usuario en esta conversación y consulta de lectura del archivo enlazado. La configuración de Plytix se revisó en su interfaz; ver [Revisión de Plytix](plytix.md) para evidencias y límites.

## Flujo general

Cliente carga y organiza productos en el archivo de catálogo → actualización automática diaria en Plytix → distribución diaria a Shopify → venta en Shopify.

## Archivo de catálogo

Ver [Análisis del catálogo](analisis-catalogo.md) para la estructura y los hallazgos de la lectura del archivo. Los metadatos directos confirman que es un Google Sheet nativo, aunque el equipo lo llama «Excel».

El cliente sube y organiza los productos en el archivo al que el equipo se refiere como «Excel»:

[Catálogo de productos](https://docs.google.com/spreadsheets/d/1U0-cIhzxqfe5GzHJoSc0rfEsiDmFB3QtyXPUNMl7EP0/edit?gid=1294555708#gid=1294555708).

La consulta de lectura devolvió información de productos con campos como `SKU`, `Variación de`, `Label`, opciones, descripciones, precios, moneda, dimensiones y `Shopify México`. Esto confirma contenido de catálogo, pero no el mapeo técnico de la importación ni qué pestañas consume la automatización. No se guarda una copia del catálogo en este repositorio.

## Plytix

- El catálogo del archivo se actualiza automáticamente en Plytix todos los días.
- La lista global observada en la interfaz se llama **`Shop Mexico`** y es una Smart List. Su filtro es **`Shopify México equals INCLUIDO`**.
- El canal asociado a la tienda principal aparece como **`Shopify México`** (con tilde) en la interfaz. El usuario lo había mencionado como `Shopify Mexico`; usar el ID y enlace documentados para identificarlo.
- El feed `Borgatta_Google_Sheet` importa diariamente a las 09:00, zona `America - Mexico City`. El canal está programado diariamente y los logs recientes muestran inicios alrededor de las 09:15; falta verificar la zona horaria y la hora exacta configurada del canal.
- También se crean listas en Plytix para objetivos específicos. Sus nombres, criterios y destinos se documentarán cuando se conozcan; no asumir que todas se publican en el canal principal.

La lista, el atributo y el canal son entidades distintas. La revisión de la Smart List confirmó el filtro del atributo `Shopify México` con valor `INCLUIDO`, tal como explicó el usuario.

## Shopify

Shopify México es actualmente la única tienda con ventas, según confirmó el usuario. Recibe los productos marcados `Shopify México = INCLUIDO`. Los demás destinos son catálogos y reciben poca administración. No tratarlos como otras tiendas con ventas.

## Criterios para futuras tareas

- Usar este flujo para identificar en qué sistema se origina un dato y dónde se distribuye antes de proponer cambios.
- Antes de corregir un campo directamente en Shopify, verificar si lo actualiza Plytix: todavía no está confirmado qué campos se sobrescriben en cada sincronización.
- No asumir sincronización inmediata ni bidireccional. Lo confirmado es la actualización diaria en dirección archivo → Plytix → Shopify.
- Consultar el archivo vigente para analizar productos; este documento describe el proceso, no los valores actuales del catálogo.

## Pendientes de confirmar

- Hora exacta y zona horaria configuradas del canal; el feed ya se verificó a las 09:00 en America - Mexico City.
- Resolución de la pestaña Hoja1 en la URL CSV del feed frente a Master en el archivo, y rangos efectivamente utilizados.
- Mapeo de importación detallado del feed; el criterio de la lista global ya está confirmado.
- Mapeo de campos, identificación de productos y variantes, y tratamiento de altas, bajas y valores vacíos.
- Qué campos se administran en cada sistema y cuáles puede sobrescribir la sincronización.
- Listas para objetivos específicos: propósito, filtros y canales de destino.
- Cómo se revisan los resultados, errores y reintentos, y quién es responsable.
