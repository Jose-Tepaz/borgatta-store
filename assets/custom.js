/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

/*
 * ÍCONOS DINÁMICOS EN SELECTORES DE VARIANTE
 * ─────────────────────────────────────────────────────────────────────────
 * Este módulo tiene dos responsabilidades:
 *
 * 1. FADE-IN DE ÍCONOS AL CARGAR LA PÁGINA (revealIcon + DOMContentLoaded)
 *    Los <img class="block-swatch__icon"> arrancan con opacity:0 (ver theme.css).
 *    revealIcon() les agrega la clase .icon--loaded cuando la imagen termina
 *    de cargar, produciendo un fade-in suave que evita el destello de imagen
 *    rota durante la carga inicial.
 *
 * 2. ACTUALIZACIÓN DINÁMICA SIN RECARGA (updateBlockSwatchIcons + change)
 *    Si el tema no recarga la página al cambiar variante (p. ej. Quick View),
 *    updateBlockSwatchIcons() actualiza los íconos de todos los grupos de
 *    bloques al detectar un cambio en cualquier selector de opción.
 *
 *    Fuentes de datos que usa:
 *      [data-variant-icons]  → JSON { variantId: "url" } emitido por
 *                              product-variant-selector.liquid
 *      [data-product-json]   → JSON completo del producto emitido por
 *                              product-info.liquid (incluye variants con
 *                              option1/option2/option3)
 *
 *    Lógica de matching:
 *      Para cada botón de opción (valor V en posición P) busca la variante
 *      donde option{P} === V y todos los demás options coinciden con la
 *      selección actual del usuario. Refleja exactamente la misma lógica
 *      que el Liquid en product-variant-selector.liquid.
 */
(function () {

  /**
   * Aplica fade-in a un <img class="block-swatch__icon">.
   * Si la imagen ya está en caché (img.complete), la hace visible de inmediato.
   * Si falla la carga, la oculta con visibility:hidden sin romper el layout.
   */
  function revealIcon(img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('icon--loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('icon--loaded'); });
      img.addEventListener('error', function () { img.style.visibility = 'hidden'; });
    }
  }

  // Inicializar fade-in para todos los íconos presentes al cargar la página.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.block-swatch__icon').forEach(revealIcon);
  });

  /**
   * Actualiza los íconos de todos los grupos de bloques dentro de `section`
   * según los valores de opción actualmente seleccionados.
   * Se llama cuando el usuario cambia una opción sin que la página recargue.
   *
   * @param {Element} section  Elemento <section data-section-type="product">
   */
  function updateBlockSwatchIcons(section) {
    // Leer el mapa variantId → URL de ícono
    var iconScript = section.querySelector('[data-variant-icons]');
    if (!iconScript) return;
    var iconMap;
    try { iconMap = JSON.parse(iconScript.textContent); } catch (e) { return; }

    // Leer el array de variantes del producto (contiene option1/option2/option3)
    var productScript = section.querySelector('[data-product-json]');
    if (!productScript) return;
    var variants;
    try { variants = JSON.parse(productScript.textContent).product.variants; } catch (e) { return; }

    // Construir mapa { posición: valorSeleccionado } con radios y dropdowns activos
    var selectedValues = {};
    section.querySelectorAll('.product-form__single-selector[type="radio"]:checked').forEach(function (radio) {
      selectedValues[parseInt(radio.dataset.optionPosition)] = radio.value;
    });
    section.querySelectorAll('select.product-form__single-selector').forEach(function (sel) {
      if (sel.dataset.optionPosition) {
        selectedValues[parseInt(sel.dataset.optionPosition)] = sel.value;
      }
    });

    // Recorrer cada grupo de bloques y actualizar ícono por valor
    // :not(.odo__grid) excluye la grilla del odontograma: ese selector maneja
    // su propio ícono por pieza en el Liquid y tiene su layout propio; si este
    // script le inserta un <img class="block-swatch__icon"> y la clase
    // block-swatch__item--has-icon, el tile se deforma (ver CLAUDE.md/odo).
    section.querySelectorAll('.block-swatch-list[data-option-position]:not(.odo__grid)').forEach(function (list) {
      var pos = parseInt(list.dataset.optionPosition);
      var optKey = 'option' + pos;

      list.querySelectorAll('.block-swatch').forEach(function (swatch) {
        var input = swatch.querySelector('.block-swatch__radio');
        var label = swatch.querySelector('.block-swatch__item');
        var val = input.value;

        // Buscar variante que coincida con este valor + selección activa de las demás opciones
        var found = null;
        for (var i = 0; i < variants.length; i++) {
          var v = variants[i];
          if (v[optKey] !== val) continue;
          var ok = true;
          for (var otherPos in selectedValues) {
            if (parseInt(otherPos) === pos) continue;
            if (v['option' + otherPos] !== selectedValues[otherPos]) { ok = false; break; }
          }
          if (ok) { found = v; break; }
        }

        var url = found ? (iconMap[found.id] || '') : '';
        var img = label.querySelector('.block-swatch__icon');

        if (url) {
          if (!img) {
            img = document.createElement('img');
            img.className = 'block-swatch__icon';
            img.loading = 'lazy';
            label.insertBefore(img, label.firstChild);
          }
          img.classList.remove('icon--loaded'); // reset antes de nueva carga
          img.src = url;
          revealIcon(img);
          img.alt = val;
          label.classList.add('block-swatch__item--has-icon');
        } else {
          if (img) img.remove();
          label.classList.remove('block-swatch__item--has-icon');
        }
      });
    });
  }

  // Escuchar cambios en cualquier selector de opción del producto.
  // closest('[data-section-type="product"]') acota la búsqueda a la sección
  // correcta, lo que permite que funcione también en Quick View con múltiples
  // productos en la misma página.
  document.addEventListener('change', function (event) {
    if (!event.target.matches('.product-form__single-selector')) return;
    var section = event.target.closest('[data-section-type="product"]');
    if (section) updateBlockSwatchIcons(section);
  });

})();
