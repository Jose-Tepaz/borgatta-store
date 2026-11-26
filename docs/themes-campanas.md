# Código compartido y configuración de campañas en Shopify

Estado: confirmado.
Última actualización: 2026-11-26.
Fuente: decisiones de José en este chat del 18 y del 26 de noviembre de 2026.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Compartir nuevas capacidades y correcciones del theme entre Development y producción, conservando el contenido y la visibilidad aprobados de cada destino. Aislar la activación de promociones en el theme de campaña.

## Reglas y contexto

| Tipo de cambio | Tratamiento |
| --- | --- |
| Nueva sección, funcionalidad o corrección de código | PR a development, validación en preview y promoción por staging y main con las aprobaciones exigidas. Distribuir a los destinos autorizados preservando su configuración. |
| Activar badges/chips, colecciones promocionales, banners o secciones existentes | Configurar únicamente el theme aislado de campaña. No copiar la activación al live ni al Development general. |
| Código y activación en una misma tarea | Separar el código compartido de los ajustes de campaña. El código puede llegar a producción con la función apagada. |

La configuración de campaña puede guardarse y mergearse como referencia con su destino identificado. Un merge no es autorización de despliegue y no convierte esa configuración en la predeterminada de todos los themes.

La configuración del editor puede estar en `config/settings_data.json`, templates JSON u otros archivos. El criterio es qué cambia y dónde debe aplicarse, no solo la extensión o la carpeta. Las diferencias deliberadas entre themes no son una desincronización que haya que eliminar.

## Procedimiento

1. Consultar live, Development y local; comparar y clasificar diferencias de código y configuración antes de editar o enviar.
2. Sincronizar las diferencias de código compartido en un PR separado. Conservar el contenido y la visibilidad aprobados de cada theme.
3. Para una campaña, crear o usar su theme aislado desde la base sincronizada. Identificar nombre, ID y rol antes de cualquier subida; no publicar el theme sin autorización específica.
4. Configurar la campaña solo en ese destino. Registrar los archivos y valores que no deben propagarse.
5. Ejecutar Theme Check sin incidencias nuevas y revisar visualmente la implementación en el preview correspondiente. La aceptación formal de QA corresponde al equipo de QA.
6. Al distribuir código compartido, preparar un diff limitado que preserve la configuración del destino y comprobar el resultado después del envío.

## Código exclusivo de una campaña

Decisión de José, 2026-11-26. No se usa una rama permanente de campaña que nunca se mergee: la configuración vive en el theme de Shopify, no en Git, y una rama así se desviaría de `development` y aumentaría el riesgo de un push completo que pise live.

| Qué es | Dónde va |
| --- | --- |
| Código reutilizable y apagado por defecto | PR a `development` y luego al live |
| Configuración de campaña | Solo en el theme de campaña; copia de referencia en `docs/campanas/` |
| Código que solo sirve a una campaña | Opción 1 o 2, según el caso |

1. **Hacerlo configurable.** Enlaces, textos y medios son ajustes de la sección, sin valores fijos. Sirve cuando la pieza se repetirá y puede vivir en `development`.
2. **Rama temporal.** Se crea desde `development` con un PR en borrador que no se mergea, se sube solo al theme de campaña y se borra al terminar. Sirve para una pieza de un solo uso.

Antecedente: en Cyber Monday 2026 el banner se mergeó con enlaces fijos a colecciones de campaña y 2.7 MB de medios, y se subió al live apagado (PR #49). No rompe nada, pero queda código y peso de campaña en producción.

### Limpieza posterior a la campaña

Pendiente de decidir para Cyber Monday 2026: eliminar del live la sección, el snippet, el CSS y los medios de campaña, o conservarlos como plantilla. Hasta decidirlo, siguen en live apagados y sin uso. Cualquier borrado en Shopify requiere autorización explícita.

## Excepciones y validación

- Producción puede recibir una capacidad nueva con su interruptor apagado; no debe recibir la activación de otra campaña como efecto de un push completo.
- Duplicar un theme no aísla descuentos, productos, colecciones ni segmentos de clientes: son recursos compartidos de la tienda y mantienen su autorización específica.
- Estas reglas no autorizan envíos, merges ni publicaciones por sí solas. Se mantienen las protecciones y el flujo de AGENTS.md y CLAUDE.md.

## Pendientes

- Theme Cyber Monday creado como no publicado; consultar [su implementación y pendientes](cyber-monday-theme.md).

## Decisiones e historial

- 2026-11-26: José confirmó no usar una rama permanente de campaña y adoptar el criterio de la sección «Código exclusivo de una campaña».
- 2026-11-18: José confirmó separar distribución de código de activación de campaña. Para Cyber Monday, los chips 20%, 5+1 y 1+1 deben activarse en el theme de campaña, conservando el estado del live y Development general.

## Referencias

- [Instrucciones para Codex](../AGENTS.md) y [Claude](../CLAUDE.md).
- [Skill de themes Borgatta](../.agents/skills/borgatta-themes/SKILL.md).
- [Cierre de promociones anteriores](promociones-finalizadas.md).
