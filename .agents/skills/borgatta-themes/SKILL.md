---
name: borgatta-themes
description: Preparar sincronizaciones, despliegues y configuración de campañas de los themes Shopify de Borgatta, separando código compartido de activaciones exclusivas de cada theme.
---

# Themes de Borgatta

Leer [AGENTS.md](../../../AGENTS.md), [CLAUDE.md](../../../CLAUDE.md) y el procedimiento [Themes compartidos y campañas](../../../docs/themes-campanas.md) antes de preparar cambios o envíos de un theme de este repositorio.

Clasificar el diff: una nueva capacidad o corrección pertenece al código compartido; encender chips, elegir colecciones y mostrar banners o secciones existentes pertenece a la configuración del destino. Una tarea puede contener ambos y debe mantenerlos separados.

Distribuir código por el flujo de PR y promoción del repositorio, conservando las funciones de campaña apagadas en los destinos donde no se hayan autorizado. Aplicar la configuración promocional únicamente al theme aislado indicado, sin copiarla al live o al Development general. Se puede versionar la configuración como referencia, identificando su destino; nunca interpretar su merge como autorización para desplegarla en otros themes.

Comparar la base antes de cambiarla. Preservar las diferencias deliberadas de configuración del editor, también en templates JSON. No buscar igualdad de todos los archivos a costa de activar campañas o pisar contenido aprobado. Preparar envíos limitados y verificar rol del theme y diff antes de escribir.

Las promociones y whitelists del administrador no se aíslan por theme. Tratar esos cambios como operaciones compartidas de tienda con autorización propia. Esta skill no concede autorización para enviar, activar, publicar o mergear.
