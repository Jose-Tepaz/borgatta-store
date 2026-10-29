# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Descripción del proyecto

Theme de Shopify para Borgatta (tienda de insumos odontológicos), construido sobre el theme **Maestrooo "Warehouse"** (v2.3.1, ver `config/settings_schema.json`). Es un theme estándar Online Store 2.0 (templates JSON + sections/blocks), sin build step ni `package.json` — es Liquid/CSS/JS plano que se despliega directo con el Shopify CLI. Tiene una feature custom importante: un selector de variantes tipo odontograma (ver más abajo).

El locale principal del storefront es español (`locales/es.json`); `locales/en.default.json` es el locale de fallback que usa Shopify cuando falta una key en otro idioma.

## Comandos

Desarrollo vía Shopify CLI (`shopify`, v4.1.0 en esta máquina). Este checkout no tiene una tienda vinculada (no hay `shopify.theme.toml`), así que puede hacer falta pasar `--store` la primera vez.

```bash
# Servidor de desarrollo local con hot reload
# (NO sirve para probar los forms de cuentas de cliente, ver nota en Arquitectura)
shopify theme dev --store=<tienda>.myshopify.com

# Subir a un theme específico (no publicado) para QA
shopify theme push --theme=<THEME_ID> --store=<tienda>.myshopify.com

# Lintear el theme (Liquid, JSON schema, a11y, performance)
shopify theme check

# Traer configuración/contenido de un theme
shopify theme pull --theme=<THEME_ID> --store=<tienda>.myshopify.com
```

No hay tests automatizados en este repo.

## Reglas duras de Git / GitHub (obligatorias, sin excepciones)

Objetivo: nada llega a `main` sin pasar por revisión, y la promoción a producción es siempre un paso explícito y consciente.

**Flujo de ramas:** `development` → `staging` → `main`. `main` es producción.

1. **Nunca commitear directo a `development`, `staging` o `main`.** Todo cambio entra exclusivamente vía Pull Request.
2. **Toda tarea empieza con una rama nueva**, creada desde la última versión de `development`:
   ```bash
   git checkout development
   git pull
   git checkout -b tipo/nombre-corto-descriptivo
   ```
   Convención de nombres: `feature/…` (funcionalidad nueva), `fix/…` (corrección de bug), `chore/…` (mantenimiento/config), `hotfix/…` (corrección urgente sobre producción).
3. **El PR de la rama de trabajo va contra `development`**, nunca directo contra `staging` ni `main`. La promoción `development → staging` y `staging → main` es un PR aparte, separado del PR de la feature individual.
4. **Commits atómicos y descriptivos.** Un commit = un cambio lógico. El mensaje explica el *por qué*, no solo el *qué*.
5. **Todo PR necesita al menos una aprobación antes de mergear, salvo autorización explícita del usuario para un PR contra `development`.** Con esa autorización, Codex puede ejecutar el merge sin aprobación adicional en GitHub, siempre que complete las validaciones del punto 6 y GitHub permita el merge sin omitir protecciones. No usar `--admin` ni desactivar protecciones para forzarlo. Las promociones a `staging` y `main` siguen requiriendo aprobación. Si piden cambios, se resuelven con commits nuevos en la misma rama.
6. **Antes de mergear un PR:** `shopify theme check` sin errores nuevos, y si el cambio afecta UI, el preview del theme (`shopify theme push --theme=<ID>`) revisado visualmente.
7. **Prohibido:**
   - `git push --force` a `development`/`staging`/`main`.
   - `git commit --amend` o rebase interactivo sobre commits ya pusheados y compartidos.
   - Saltarse hooks de git (`--no-verify`).
   - `shopify theme push --live` fuera del flujo de promoción a producción acordado.
8. **Borrar la rama al mergear el PR.** No dejar ramas viejas acumulándose.
9. **Antes de cualquier operación destructiva** (`reset --hard`, `checkout --`, `clean -f`) correr `git status` primero y guardar/stashear lo que haya sin commitear.

### Notas de este repo en particular

- Repo: `Jose-Tepaz/borgatta-store`. `gh` en esta máquina tiene dos cuentas logueadas (`JoseTepazE` y `Jose-Tepaz`) — solo **`Jose-Tepaz`** tiene permiso de push sobre este repo. Si `git push`/`gh pr` da 403 "Permission denied to JoseTepazE", correr `gh auth switch --user Jose-Tepaz --hostname github.com`.
- En el remoto existen `main`, `staging` y `development`, así que el flujo de arriba se sigue tal cual. Los PRs de promoción dejan merge commits en `staging` y `main` que no están en `development`; es normal y no hay que "arreglarlo".

## Reglas de despliegue a Shopify (obligatorias)

Objetivo: nunca romper producción. El theme **live es la fuente de verdad**: el equipo edita desde el editor de Shopify sin pasar por Git, así que `development` puede quedar atrasado respecto al live.

IDs de referencia (verificar con `shopify theme list --store=borgattastore.myshopify.com --json`; el ID del live cambia si se publica otro theme):
- Live: `152441258135` ("Copy of Borgatta V2.6.3 | PDF")
- QA / preview: `189331931287` ("Development | Acueducto")

1. **Sincronizar con el live antes de trabajar.** Al empezar una tarea, bajar el live a una carpeta temporal (`shopify theme pull --theme=<LIVE_ID> --path=<carpeta> --force`) y compararlo con `development` (`diff -rq`). Si hay diferencias, entran por un PR de sync aparte antes de seguir. Nunca mezclar un sync con una feature en el mismo PR.
2. **Siempre QA primero, live después.** Todo cambio se sube primero a un theme no publicado y se revisa en el preview. Nunca se salta ese paso, aunque el cambio parezca chico.
3. **Verificar el rol del theme destino antes de cualquier push.** Usar `shopify theme list --json` y comprobar que el ID destino no sea `[live]`, salvo en una promoción acordada. Los IDs se parten en la tabla de texto: no copiarlos de ahí.
4. **Nunca `theme push` del theme completo al live sin diff previo.** Bajar el live a una carpeta temporal y confirmar que solo difieren los archivos que se quieren subir. Si hay cualquier duda, usar `--only <archivos>`. Un push completo pisa las ediciones hechas desde el editor.
5. **Los datos van antes que el código.** Si el cambio lee metafields, metaobjects o colecciones nuevas, esas definiciones se crean en Shopify **antes** de subir el código. Dejarlo anotado en la descripción del PR.
6. **Probar con datos reales.** `shopify theme check` no basta: revisar en local o en el preview los casos límite (valor vacío, con y sin fallback al padre, ambos vacíos) y listarlos en el PR.
7. **`theme check` sin offenses nuevos.** Comparar el conteo antes y después (hoy hay errores y warnings heredados del theme base). La regla es no subir el número, no dejarlo en cero.
8. **Archivos de riesgo alto.** `assets/theme.js`, `assets/custom.js` y `config/settings_data.json` se tocan solo con justificación explícita en el PR. Para el odontograma, leer antes `assets/odontograma-doc.md`.
9. **Un cambio lógico por PR.** Así se puede revertir una sola cosa. Si un PR revierte algo de otro, decirlo explícitamente en la descripción.
10. **Antes de `git push` o `gh pr`, verificar la cuenta con `gh auth status`** (debe estar activa `Jose-Tepaz`).
11. **Después de subir al live, volver a bajarlo a una carpeta temporal y comparar** para confirmar que live y `development` quedaron iguales.

## Arquitectura

### Estructura
Estructura estándar de theme de Shopify: `layout/` (theme.liquid + layouts de password/gift-card), `templates/` (mayormente `.json` estilo Online Store 2.0; quedan algunos `.liquid` legacy para páginas puntuales), `sections/`, `snippets/`, `config/` (`settings_schema.json` define los settings del editor, `settings_data.json` tiene los valores actuales), `locales/`, `assets/`.

### Locales y claves de traducción
Se sigue la convención de Shopify: una key de traducción lleva el sufijo `_html` si su valor contiene HTML crudo/placeholders interpolados (ej. `powered_by_html`, `shipping_policy_html`, `customer.recover_password.success_html`) — el filtro `t` no escapa HTML en ningún caso, pero el sufijo lo exige el linter de `theme-check` y deja claro el intent a quien lea después. Al agregar o editar un string visible al usuario, actualizarlo en **los 7 locales** (`en.default`, `es`, `fr`, `de`, `pt-BR`, `ja`, `nb`) para que ningún idioma quede con una key rota o en inglés por accidente.

### Cuentas de cliente (Classic)
La tienda usa el sistema **Classic** de cuentas de cliente de Shopify, no el sistema nuevo hosted — login/recuperar contraseña/registro se manejan con `{% form %}` de Liquid nativos en `sections/main-customers-login.liquid`.

Detalle importante: el form `recover_customer_password` **siempre devuelve `posted_successfully?`**, exista o no una cuenta con ese email — es intencional (previene enumeración de usuarios) y no se puede cambiar desde el theme. No intentar agregar un mensaje de "este email no existe"; el copy debe quedar neutral (ver el string `success_html` actual como referencia).

También: los submits de los forms de cuenta de cliente (login/recover/register) necesitan cookies atadas al dominio real de la tienda. Probarlos contra el proxy local de `shopify theme dev` (`http://127.0.0.1:9292/...`) da 401 — siempre probar contra la URL de preview real que imprime el CLI (`https://<tienda>.myshopify.com/?preview_theme_id=...`).

### El selector odontograma
La feature custom principal del theme: un selector de variantes tipo odontograma (14×2, numeración FDI) que reemplaza la capa *visual* del variant picker nativo en productos con el tag `odontograma`, mientras que toda la mecánica (precio/disponibilidad, AJAX del carrito) sigue siendo la nativa de la clase `ProductVariants` en `assets/theme.js`.

**La documentación completa —incluyendo el contrato exacto de DOM con `theme.js`/`custom.js`, el mapa de posiciones FDI, las reglas de carga de datos y un playbook de diagnóstico— vive en `assets/odontograma-doc.md`. Leerla antes de tocar cualquiera de estos archivos:**
- `snippets/odontograma-selector.liquid` — genera el markup
- `assets/odontograma.css` — estilos del componente (se carga condicionalmente en templates de producto)
- `assets/theme.js` — clase `ProductVariants` del theme base, cuyo markup el selector debe respetar (está minificado; buscar por contenido de texto, no por número de línea de DevTools, al debuggear)
- `assets/custom.js` — glue code del theme (ej. `updateBlockSwatchIcons`) con sus propias expectativas sobre el markup de los swatches

La restricción más importante, porque romperla tumba en silencio la selección de variante **y** el add-to-cart juntos (no solo el selector visual): los `.block-swatch` deben ser **hermanos directos** de su contenedor (sin `<div>` envolventes), porque el theme los resuelve vía `:nth-child` indexado contra `option.values`, no contra el selector. Ver `assets/odontograma-doc.md` §3 para el resto del contrato de DOM (reglas A–F) y §12 para el historial de fallos que originó esas reglas.

`product.tags contains 'odontograma'` es el interruptor on/off de esta feature por producto — es un tag plano, no un metafield, así que es fácil sacarlo sin darse cuenta de qué se rompe.
