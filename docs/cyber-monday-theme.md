# Theme Cyber Monday 2026

Estado: implementado en theme no publicado; código pendiente de integrar por PR y aceptación formal pendiente de QA.
Última actualización: 2026-11-18.
Fuente: autorización de José y consultas Admin API, Shopify CLI y preview del 18 de noviembre de 2026.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Implementar PRO-2324-09 en el theme aislado **Cyber Monday**, ID `190446436503`, copia del live `152441258135`. Development general es `189331931287`. No se publicó el nuevo theme ni se cambiaron los otros dos.

## Reglas y contexto

- Cuatro reglas de chips: `-20%` para campaña `cyber-monday-2026`; `5+1` para bloques; `5+1` para pastillas; `1+1` para discos.
- Las leyendas existentes de 5+1 y 1+1 se conectaron a sus tres colecciones. Se conserva el aviso B-Silk.
- La colección Cyber Monday sigue sin publicar. Su chip usa el campo de producto `borgatta_campaigns.campanas`, que ya determina la colección automática del descuento. Así no se publica una colección para mostrar una etiqueta.
- El componente compartido admite texto opcional por regla; vacío conserva el porcentaje. Una campaña opcional usa pertenencia exacta a la lista del metafield y prevalece sobre la condición de colección. Campos vacíos conservan el funcionamiento anterior. Los textos de editor están traducidos en los siete locales.
- No se cambió el valor de los metafields, las listas de productos, los descuentos ni sus restricciones de prueba en este trabajo.

## Procedimiento

La configuración específica está en [referencia de ajustes](campanas/cyber-monday-2026-settings.json), fuera de `config/settings_data.json` del checkout. No usarla como configuración global ni copiarla al live o a Development. El código reutilizable y esta referencia se revisan por PR; el merge no despliega la campaña a otros themes.

Preview: [Cyber Monday](https://borgattastore.myshopify.com/?preview_theme_id=190446436503).

## Excepciones y validación

- Base live descargada y comparada con el checkout: sin diferencias en archivos de theme antes del cambio.
- Theme Check: 116 errores y 339 advertencias heredados, sin incidencias nuevas.
- Preview: Stick Croma muestra `-20%`; bloques HT y pastillas HT muestran `5+1` y leyenda; discos SHT/ML muestran `1+1` y leyenda. Discos revisados en escritorio y móvil.
- Fresadora 500 no muestra chip ni leyenda de campaña.
- Capturador de Shopify falló para Stick Croma y bloques; se verificaron en el navegador con la barra de preview Cyber Monday visible. Estas son revisiones de implementación, no aceptación formal del equipo QA.

## Pendientes

- Integrar el código mediante PR a development. La distribución de la nueva capacidad a otros themes debe preservar sus interruptores apagados y seguir el flujo de promoción autorizado.
- Completar los restantes criterios del ticket antes del handoff general a QA.
- Antes del lanzamiento, retirar la whitelist de los descuentos según autorización y publicar el theme solo con autorización específica. El preview visual no limita la visibilidad de los chips a la whitelist: la restricción corresponde a la elegibilidad de los descuentos.

## Decisiones e historial

- 2026-11-18: creado Cyber Monday no publicado y activados chips y leyendas únicamente en ese destino.

## Referencias

- [PRO-2324](https://linear.app/acueducto/issue/PRO-2324/shop-cybermonday-lunes-30-noviembre).
- [Separación de código y configuración](themes-campanas.md).
