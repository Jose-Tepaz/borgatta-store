# Cierre de promociones y avisos de producto

Estado: confirmado en Shopify; cambios del theme Development pendientes de integrar mediante PR.
Última actualización: 2026-11-11.
Fuentes: instrucciones de José en este chat del 11 de noviembre de 2026; consultas Admin API y previews reales de Shopify Development y live.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Retirar las páginas de las promociones finalizadas, mantener apagados los badges de descuento y conservar Joy y el aviso de B-Silk activos.

## Reglas y contexto

- José confirmó que las promociones de los kits y combos revisados terminaron y autorizó ocultar las siete páginas de la siguiente tabla.
- La API confirmó `isPublished: false` después de la operación. Es contenido compartido por todos los themes, no una configuración distinta por Development y live. No se eliminaron páginas, productos ni descuentos.
- El home de Development no contiene las seis tarjetas promocionales AMIC revisadas; su cuadrícula está desactivada. Conserva el slider y las categorías generales.
- Los badges configurables de descuento permanecen desactivados en Development.
- El bloque de cuenta de Joy está habilitado en Development y ya estaba habilitado en live. Se verificó que el bloque se renderiza; los puntos de un cliente autenticado no se probaron.
- El único aviso configurado en Development es para `cepillo-dental-b-silk`: «Si compras en pack con 6 cepillos, te ahorras $10 pesos en cada uno.» Se conserva el texto existente de live. No modifica precios ni activa descuentos.
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
- Live `152441258135`: aviso B-Silk visible y bloque de cuenta Joy presente. No se necesitó subir código para conservar esos dos resultados.

## Pendientes

- Integrar mediante PR los cambios ya validados en el theme Development.
- La promoción general de código Development → live sigue siendo un trabajo separado y requiere preservar el contenido activo de live y seguir el flujo de revisión.
- La corrección de términos JTS-1334 permanece separada de estos ajustes.

## Decisiones e historial

- 2026-11-11: José autorizó ocultar todas las siete páginas identificadas de la promoción, habilitar Joy en dev y producción, mantener los badges apagados y mostrar únicamente el aviso B-Silk.

## Referencias

- [Contexto de la tienda](contexto-tienda.md).
- [JTS-1334](https://linear.app/vsstudio/issue/JTS-1334/web-corregir-contradicciones-en-la-pagina-de-terminos-y-condiciones).
