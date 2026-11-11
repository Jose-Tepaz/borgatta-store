# Cierre de promociones y avisos de producto

Estado: confirmado y publicado en Shopify Development y live; verificación posterior completada.
Última actualización: 2026-11-11.
Fuentes: instrucciones de José en este chat del 11 de noviembre de 2026; consultas Admin API y previews reales de Shopify Development y live.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Retirar las páginas de las promociones finalizadas, mantener apagados los badges de descuento y conservar Joy y el aviso de B-Silk activos.

## Reglas y contexto

- José confirmó que las promociones de los kits y combos revisados terminaron y autorizó ocultar las siete páginas de la siguiente tabla.
- La API confirmó `isPublished: false` después de la operación. Es contenido compartido por todos los themes, no una configuración distinta por Development y live. No se eliminaron páginas, productos ni descuentos.
- El home de Development no contiene las seis tarjetas promocionales AMIC revisadas; su cuadrícula está desactivada. Conserva el slider y las categorías generales.
- Los badges configurables de descuento permanecen desactivados tanto en Development como en live.
- El bloque de cuenta de Joy está habilitado en Development y ya estaba habilitado en live. Se verificó que el bloque se renderiza; los puntos de un cliente autenticado no se probaron.
- El único aviso configurado en Development y live es para `cepillo-dental-b-silk`: «Si compras en pack con 6 cepillos, te ahorras $10 pesos en cada uno.» Se conserva el texto existente de live. No modifica precios ni activa descuentos.
- Las reglas antiguas 1+1 y 5+1 conservan sus mensajes, pero quedan sin colección seleccionada para que no se muestren.

## Páginas ocultas

| Página | Handle |
| --- | --- |
| BUNDLES AMIC | `bundles-amic` |
| Kit Premium Odontología Digital 3D | `kit-premium-odontologia-digital-3d` |
| Kit Ideal Odontología Digital 3D | `kit-ideal-odontologia-digital-3d` |
| 5+1 | `5-1` |
| Combos | `combos` |
| Combo Fresadora de Disilicato de Litio | `combo-fresadora-de-disilicato-de-litio` |
| Combo Fresadora de Circonia | `combo-fresadora-de-circonia` |

## Procedimiento

Los avisos se configuran en Configuración del tema → Avisos por colección. Cada regla puede seleccionar un producto específico; si lo tiene, esa selección prevalece sobre la colección. Se muestra la primera regla coincidente con mensaje. Sin producto ni colección no se muestra el aviso.

No reactivar las reglas de promociones finalizadas sin una instrucción nueva del negocio. Para publicar páginas o subir cambios del theme, seguir [AGENTS.md](../AGENTS.md).

## Validación

- Shopify Development `189331931287`: aviso B-Silk revisado en escritorio y móvil; no aparece en Caballetes de acrílico ni en Disco de circonia multicapa SHT/ML. Este último tampoco muestra el antiguo texto 1+1.
- Theme Check: mismas incidencias heredadas que development, 116 errores y 339 advertencias; sin incidencias nuevas.
- Live `152441258135`: promoción de los 29 archivos distintos autorizada por José y aplicada con `--only` y `--nodelete`. Se comprobó home con slider y sin cuadrícula promocional, aviso exclusivo de B-Silk, ausencia de badges y aviso 1+1 en Disco SHT/ML, y bloque de cuenta Joy presente. No se probaron los puntos de un cliente autenticado.
- `test-card` continúa publicada y usa la proporción original de imagen de Development, revisada en QA y live. No se ocultó.
- Descarga posterior: 28 archivos cambiaron; `templates/product.json` quedó igual al live previo porque Shopify descartó tres ajustes obsoletos. Frente al repositorio quedan cinco normalizaciones automáticas: cuatro referencias de Bundler cambian de `bundler` a `bundler-bundles-app`, conservando el UUID y el shortcode, y la plantilla de producto omite los tres ajustes. No se encontraron diferencias adicionales.
- La corrección de términos JTS-1334 ya está integrada y publicada, con evidencia de escritorio y móvil en el ticket.

## Pendientes

- Si se requiere igualdad literal de archivos, incorporar mediante otro PR las cinco normalizaciones automáticas de Shopify. La promoción solicitada ya está desplegada.
- Las ramas Git staging y main no se modificaron en esta operación; el código desplegado corresponde a development `6d01414`.

## Decisiones e historial

- 2026-11-11: José autorizó ocultar todas las siete páginas identificadas de la promoción, habilitar Joy en dev y producción, mantener los badges apagados y mostrar únicamente el aviso B-Silk.

- 2026-11-11: PR #39 integrado en development; PR #40 integrado y términos publicados. José autorizó después promover las demás diferencias de Development al theme de producción. Se conservaron las siete páginas ocultas, badges apagados, Joy habilitado y aviso B-Silk.

## Referencias

- [Contexto de la tienda](contexto-tienda.md).
- [JTS-1334](https://linear.app/vsstudio/issue/JTS-1334/web-corregir-contradicciones-en-la-pagina-de-terminos-y-condiciones).
