import { Pipe, PipeTransform } from '@angular/core';

/**
 * SubtotalPipe (pipe personalizado)
 *
 * Recibe la cantidad de un producto en el carrito y, a través de un
 * argumento adicional, el precio unitario. Devuelve el subtotal
 * calculado (precio * cantidad).
 *
 * Uso en plantilla:
 *   {{ item.cantidad | subtotal:item.producto.precio | currency:'GTQ' }}
 */
@Pipe({
  name: 'subtotal',
  standalone: true
})
export class SubtotalPipe implements PipeTransform {

  transform(cantidad: number, precioUnitario: number): number {
    if (!cantidad || !precioUnitario) {
      return 0;
    }
    return cantidad * precioUnitario;
  }
}
