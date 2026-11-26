# Material gráfico Cyber Monday — PRO-2514

Estado: subido y revisado en el preview real de Cyber Monday; incluidos ambos videos.
Última actualización: 2026-11-19.
Fuente: [PRO-2514](https://linear.app/acueducto/issue/PRO-2514), Figma y solicitud de José del 19 de noviembre.
Responsable: pendiente de confirmar.

## Objetivo y alcance

Preparar el banner y las tres portadas promocionales en el theme Cyber Monday `190446436503`, no publicado. Subido el 19 de noviembre con autorización explícita de José; el theme continúa sin publicar. Producción y Development conservan su configuración. La base live descargada el 19 de noviembre coincide con origin/development antes de estos cambios.

## Implementación

- Sección `cyber-monday-banner`: ocho espacios en el orden de Figma, cuatro columnas en escritorio y dos en móvil. Solo Ofertas -20%, Compra 5+1 y Compra 1+1 son enlaces. Los demás son imágenes complementarias.
- Video del 20% incluido en assets; autoplay, muted, loop y playsinline. Pinzas usa el MP4 optimizado entregado por José; conserva la imagen de Figma como poster y el campo URL como override opcional.
- Custom Collection conserva las familias existentes y añade, mediante el interruptor opcional `cyber_monday_cards`, las tres tarjetas en orden 20%, 5+1 y 1+1. Solo 20% lleva badge; los títulos, subtítulos y fecha se renderizan como texto, no como captura del diseño.
- Se conserva la capacidad de título opcional ya instalada en Cyber Monday. Los nuevos textos y etiquetas de editor están en los siete locales.
- Imágenes de Figma optimizadas a JPEG, máximo 1600 px; medios de campaña aproximadamente 2.7 MB, incluido el video disponible. No quedan URLs temporales de Figma en el código.
- Slider oculto pero conservado en la referencia de campaña. Las tres tarjetas provisionales anteriores se reemplazan por las nuevas sin duplicarlas ni quitar familias regulares.

## Configuración y preparación de subida

La configuración exclusiva está en [index de campaña](campanas/cyber-monday-2026/index.json). No reemplaza templates/index.json del checkout general. El interruptor de tarjetas es false por defecto y la nueva sección no se inserta por defecto en otros themes.

Copia completa preparada en `/tmp/pro2514/prepared`; lista de archivos de envío en `/tmp/pro2514/upload-files.json`. Estas carpetas temporales no son almacenamiento permanente: las fuentes y referencias están en este repositorio.

Antes de subir: volver a descargar y comparar Cyber Monday para conservar cualquier edición posterior; verificar que continúa unpublished. Aplicar únicamente los archivos preparados a ese theme. No subir templates/index.json de campaña a Development ni live. No publicar el theme ni activar esta UI en producción sin autorización de lanzamiento.

## Validación local y límites

- Render local de los templates Liquid nuevos: comprobadas ocho celdas, exactamente tres enlaces, orden y destinos de las tarjetas, carga de todas las imágenes y reproducción del video disponible.
- Revisión visual en escritorio y móvil de 390 px; sin desbordamiento horizontal. Este render local no sustituye la revisión del preview real después de la subida ni el QA del ticket.
- Theme Check: 116 errores y 339 advertencias heredados, sin incidencias nuevas también en el paquete completo preparado para Cyber Monday.
- Se enviaron únicamente los componentes, medios, locales y template del home autorizados a Cyber Monday. Antes del envío, la descarga actual coincidió con la base usada. No se cambiaron producción, Development, descuentos, productos, whitelist ni fechas.
- Preview real verificado en escritorio y móvil de 390 px: ocho espacios, tres enlaces, tres tarjetas, un badge, imágenes cargadas y video 20% reproducido en loop y silenciado. Sin desbordamiento horizontal.

## Pendientes

- La revisión formal de QA queda pendiente.
- Lanzamiento del 30 de noviembre de 00:00 a 23:59 CDMX y restauración posterior: requieren publicación/restauración explícitas; esta implementación no crea una programación automática.

## Referencias

- [Diseño del banner](https://www.figma.com/design/hTo3Sx9gW2sCVBbCMo3HQb?node-id=5821-9478).
- [Reglas de themes y campañas](themes-campanas.md).

## Video de Pinzas

2026-11-19: José entregó pinzas-video.mp4 y autorizó optimizarlo y subirlo. Original: 2,114,700 bytes, 800 × 800, 30 fps, 8.32 s. Optimizado en H.264 CRF 20, preset slow, yuv420p y faststart, sin audio por reproducción silenciada. Peso aproximado: 479 KB (77% menos); resolución y fps conservados. SSIM global frente al original: 0.996993; indica alta similitud, no compresión matemáticamente sin pérdida. Se subieron únicamente el MP4 y la sección del banner al theme no publicado Cyber Monday.
