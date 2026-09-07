# Carrito de Ventas con Observables y Pipes en Angular

Actividad 3 — Fundación Kinal

## 1. Arquitectura del carrito

- **Modelo de datos** (`src/app/models`): `Producto` (id, nombre, precio) e `ItemCarrito` (producto + cantidad).
- **Servicio** (`CarritoService`): única fuente de verdad del carrito.
- **Componentes**:
  - `ListadoProductosComponent`: catálogo de productos, botón "Agregar al carrito".
  - `ResumenCarritoComponent`: tabla del carrito, controles de cantidad, subtotales y total.
- **Pipe personalizado** (`SubtotalPipe`): calcula `cantidad * precio` para cada fila del carrito.

## 2. Función del servicio (CarritoService)

`CarritoService` mantiene un arreglo privado de `ItemCarrito[]` dentro de un `BehaviorSubject`. Expone:

- `carrito$: Observable<ItemCarrito[]>` — observable público de solo lectura.
- `agregarProducto()`, `cambiarCantidad()`, `incrementarCantidad()`, `decrementarCantidad()`, `eliminarProducto()`, `vaciarCarrito()` — únicos métodos que pueden modificar el estado; todos terminan llamando a `itemsSubject.next(...)`.
- `calcularTotal()` — suma `precio * cantidad` de todos los items.

Ningún componente muta el arreglo directamente: todos pasan por estos métodos, lo que garantiza que el servicio sea la fuente de verdad.

## 3. Funcionamiento de los Observables

`BehaviorSubject` se eligió porque:

1. Guarda el último valor emitido, así que un componente que se suscribe después de que ya existan productos en el carrito recibe inmediatamente el estado actual (no solo eventos futuros).
2. Permite emitir un nuevo arreglo inmutable (`[...items]` / `.map()` / `.filter()`) cada vez que cambia el carrito, lo cual dispara automáticamente la actualización en **todos** los componentes suscritos.

`ResumenCarritoComponent` se suscribe en `ngOnInit()` y se desuscribe en `ngOnDestroy()` para evitar fugas de memoria.

## 4. Comunicación entre componentes

`ListadoProductosComponent` y `ResumenCarritoComponent` **no se conocen entre sí** ni se pasan datos por `@Input`/`@Output`. Se comunican exclusivamente a través de `CarritoService`:

- `ListadoProductosComponent` → llama a `carritoService.agregarProducto(producto)`.
- El servicio actualiza el `BehaviorSubject`.
- `ResumenCarritoComponent`, suscrito a `carrito$`, recibe el nuevo arreglo y vuelve a renderizar la tabla, los subtotales y el total automáticamente.

## 5. Pipes utilizados

- **`currency`** (pipe nativo de Angular): formatea precios, subtotales y el total en formato monetario (`GTQ`).
- **`subtotal`** (pipe personalizado, `SubtotalPipe`): recibe la cantidad como valor de entrada y el precio unitario como argumento, y devuelve `cantidad * precio`. Se usa así en la plantilla:

  ```html
  {{ item.cantidad | subtotal:item.producto.precio | currency:'GTQ ' }}
  ```

## 6. Flujo de actualización del carrito

1. El usuario presiona **"Agregar al carrito"** en el catálogo → `CarritoService.agregarProducto()`.
2. El usuario usa **+ / −** o edita el número de cantidad en la tabla del carrito → `CarritoService.cambiarCantidad()` / `incrementarCantidad()` / `decrementarCantidad()`.
3. El usuario presiona **"Eliminar"** o **"Vaciar carrito"** → `CarritoService.eliminarProducto()` / `vaciarCarrito()`.
4. En cada caso el servicio emite un nuevo arreglo inmutable a través del `BehaviorSubject`.
5. `ResumenCarritoComponent` recibe el nuevo arreglo en su suscripción, recalcula el total con `calcularTotal()` y Angular vuelve a pintar la tabla (subtotales vía `SubtotalPipe`, total vía interpolación + `currency`).

Todo el flujo es reactivo: no hay recarga de página ni paso manual de datos entre componentes.

## 7. Pruebas realizadas manualmente

- Agregar el mismo producto varias veces → la cantidad se incrementa en vez de duplicar la fila.
- Cambiar la cantidad con los botones `+`/`−` y con el input numérico → el subtotal de la fila y el total general se recalculan de inmediato.
- Bajar la cantidad a 0 (o eliminar) → la fila desaparece de la tabla y el total se recalcula.
- Vaciar el carrito → se muestra el mensaje de "carrito vacío".
- Agregar productos después de vaciar el carrito → el flujo reactivo sigue funcionando (el `BehaviorSubject` no se "agota").
