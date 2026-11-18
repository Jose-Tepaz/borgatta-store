# Home de Cyber Monday

Estado: cuadrícula y subpágina 5+1 implementadas en preview; acceso 20% pendiente de publicación de la colección.
Última actualización: 2026-11-18.
Fuente: solicitud de José, consulta Shopify Admin API y revisión del preview Cyber Monday.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Activar solo en Cyber Monday `190446436503` una cuadrícula completa con 20%, 1+1 y 5+1, y una subpágina que ofrezca bloques y pastillas por separado. No modifica live ni Development general.

## Reglas y contexto

- Home: sección existente banner-grid, ocho tarjetas: 20%, 1+1, 5+1, brackets, higiene, piezas de mano, elásticos e instrumentos; cuatro columnas en escritorio (dos filas) y dos en móvil. Slider oculto; cuadrícula a ancho completo y sin padding vertical. Se conserva el resto del home.
- 20% enlaza a `/collections/cyber-monday-2026`. Imagen de producto existente, sin reutilizar artes de 15% o 5%.
- 1+1 enlaza a `/collections/discos-de-circonia-1-1`.
- 5+1 enlaza a `/collections/all?view=cyber-5-1`. La plantilla alternativa solo está subida al theme Cyber Monday y reutiliza card-list para ofrecer pastillas y bloques, con enlaces a sus colecciones.
- La página antigua `/pages/5-1` permanece sin publicar. No se cambian descuentos, sus fechas ni whitelist.
- Las referencias de configuración están en [home](campanas/cyber-monday-2026/index.json) y [subpágina](campanas/cyber-monday-2026/collection.cyber-5-1.json). No son archivos para desplegar a todos los themes.

- Se añadieron tres tarjetas al inicio de Custom Collection (collection-list-jt): 20%, 1+1 y 5+1. Un campo opcional de título permite rotularlas, con proporción 16:9; sin título se conserva la tarjeta anterior. El campo de editor está traducido en los siete locales.

## Procedimiento

Aplicar los dos templates únicamente al ID de campaña autorizado; el título opcional es código reutilizable que no activa tarjetas por defecto. Preservar los valores de cada destino al distribuirlo; mantener intacto templates/index.json del checkout general. El merge de estas referencias no activa promociones en otros themes.

## Excepciones y validación

- Theme Check del theme de campaña: 116 errores y 339 advertencias heredados; sin incidencias nuevas.
- Verificado en navegador: ocho cuadros (cuatro por fila), títulos de las tarjetas promocionales en la lista de colecciones y navegación desde 5+1 a las dos tarjetas de bloques/pastillas. El capturador de Shopify mostró una versión anterior; se usó la sesión real de preview Cyber Monday para comprobar el resultado.
- La API confirma que Cyber Monday 2026 no tiene publicaciones de canal. No se publicó la colección sin autorización explícita para ese alcance; el acceso 20% no se considera funcional hasta resolver esa dependencia.

## Pendientes

- Autorizar y publicar la colección Cyber Monday 2026 (`514467168407`) solo en Tienda online para que su enlace funcione. Es contenido compartido de tienda, no aislado por theme; no abre el descuento a otros clientes.
- Comprobar navegación de 20% después de esa publicación.

## Decisiones e historial

- 2026-11-18: activada la cuadrícula en Cyber Monday y creada subpágina mediante plantilla alternativa sin reactivar la página vieja.

## Referencias

- [Reglas de themes y campañas](themes-campanas.md).
- [Preview](https://borgattastore.myshopify.com/?preview_theme_id=190446436503).
