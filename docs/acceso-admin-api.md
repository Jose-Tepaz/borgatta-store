# Acceso a la Admin API de Shopify (CLI)

Última actualización: 2026-11-24
Fuente: sesión con José del 2026-11-24; consultas de lectura contra `borgattastore.myshopify.com`.

## Estado confirmado

- La herramienta es `shopify store execute` (Shopify CLI 4.1.0), que ejecuta GraphQL de la Admin API usando la sesión guardada por `shopify store auth`.
- La sesión es un token **online** a nombre de la cuenta que hizo el login. Puede expirar o quedar sin los scopes necesarios; en ese caso se repite el login.
- Las mutaciones están bloqueadas por defecto: solo corren con `--allow-mutations`.
- No se guardan tokens en el repo. El CLI los guarda en la máquina de quien hizo el login.

## Scopes autorizados el 2026-11-24

| Scope | Uso |
|---|---|
| `read_discounts` | Descuentos, audiencias y condiciones |
| `read_customers` | Clientes y segmentos |
| `read_products` | Productos, variantes, tags |
| `write_products` | Crear y editar productos |
| `read_orders` | Pedidos |
| `read_price_rules` | Reglas de precio heredadas |
| `read_themes` | Themes de la tienda |
| `read_content` | Páginas y blogs |
| `write_content` | Crear y editar páginas y blogs |
| `read_markets` | Mercados |
| `read_inventory` | Inventario |

No hay scopes de escritura para descuentos, clientes, pedidos, inventario ni themes.

## Cómo activar o ampliar scopes

Ejecutar en la terminal (en Claude Code, con el prefijo `!` para que quede en la sesión). Abre el navegador para autorizar. Siempre se piden **todos** los scopes deseados juntos, no solo el nuevo:

```bash
shopify store auth --store borgattastore.myshopify.com --scopes read_discounts,read_customers,read_products,write_products,read_orders,read_price_rules,read_themes,read_content,write_content,read_markets,read_inventory
```

Verificar:

```bash
shopify store execute --store borgattastore.myshopify.com --query 'query { shop { name id } }'
```

Si una consulta devuelve `ACCESS_DENIED ... requiredAccess`, falta ese scope: agregarlo a la lista y repetir el login. Para quitar escritura, repetir el login solo con los `read_*`.

Scopes que se pueden agregar si hace falta, con autorización de José: `write_discounts`, `write_customers`, `write_inventory`, `write_themes`, `read_online_store_pages` y `write_online_store_pages` (solo páginas).

## Reglas de uso

- Tener un scope no autoriza la acción. Cada escritura en Shopify necesita autorización explícita de José para esa acción y destino, según las [restricciones de operación](../CLAUDE.md). Preparar la mutación, mostrarla y solo entonces ejecutar con `--allow-mutations`.
- **Productos:** el catálogo se sincroniza a diario desde Plytix (ver [Gestión del catálogo](gestion-catalogo.md) y [Plytix](plytix.md)). Lo editado directo en Shopify puede sobrescribirse; qué campos pisa Plytix está **pendiente de confirmar**. Al editar tags, preservar `odontograma`.
- **Páginas:** son contenido compartido por todos los themes. Crear sin publicar; publicar es una acción aparte.
- **Datos personales:** `read_customers` y `read_orders` exponen datos de clientes. No copiarlos al repo ni a la documentación.
- Para consultas grandes, paginar y escribir los resultados en el scratchpad de la sesión, no en el repo.

## Verificación del 2026-11-24 (Cyber Monday)

- Segmento `Cyber Monday 2026 - Pruebas Acueducto`: regla `customer_tags CONTAINS 'cyber-monday-2026-testers'`, 2 clientes con el tag, ambas cuentas de Acueducto.
- Descuento automático `CYBER-MONDAY-2026-20%`: activo del 2026-11-18 al 2026-12-01 05:59:59 UTC; 20% sobre la colección `Cyber Monday 2026`; audiencia limitada a ese segmento; combina con descuentos de producto, no con pedido ni envío; sin mínimo. Es el único descuento de la tienda con audiencia por segmento (2.529 revisados).
- Pendiente: abrir la audiencia al lanzamiento (requiere autorización y `write_discounts`), validar el contenido de la colección contra las exclusiones por SKU del ticket y comprobar que no se acumule con otros descuentos de producto.

Relacionado: [Ticket Cyber Monday](ticket-cyber-monday.md), [Themes compartidos y campañas](themes-campanas.md).
