import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { ItemCarrito } from '../models/item-carrito.model';

/**
 * CarritoService
 *
 * Actúa como la ÚNICA fuente de verdad del estado del carrito de ventas.
 * Expone un Observable (a través de un BehaviorSubject) al que los
 * componentes se suscriben para recibir automáticamente cualquier
 * actualización del carrito (agregar, cambiar cantidad, eliminar).
 *
 * Ningún componente modifica el estado directamente: todos pasan por
 * los métodos públicos de este servicio, que son los únicos que emiten
 * un nuevo valor a través del Subject.
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  /** Estado interno y privado del carrito. Nadie fuera del servicio puede mutarlo directamente. */
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);

  /** Observable público de solo lectura al que los componentes se suscriben. */
  public carrito$: Observable<ItemCarrito[]> = this.itemsSubject.asObservable();

  /**
   * Agrega un producto al carrito.
   * Si el producto ya existe, incrementa la cantidad en 1.
   * Si no existe, lo agrega con cantidad 1.
   */
  agregarProducto(producto: Producto): void {
    const itemsActuales = this.itemsSubject.getValue();
    const itemExistente = itemsActuales.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      const itemsActualizados = itemsActuales.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      this.itemsSubject.next(itemsActualizados);
    } else {
      const nuevoItem: ItemCarrito = { producto, cantidad: 1 };
      this.itemsSubject.next([...itemsActuales, nuevoItem]);
    }
  }

  /**
   * Cambia la cantidad de un producto específico del carrito.
   * Si la cantidad resultante es menor o igual a 0, el producto se elimina.
   */
  cambiarCantidad(idProducto: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarProducto(idProducto);
      return;
    }

    const itemsActuales = this.itemsSubject.getValue();
    const itemsActualizados = itemsActuales.map(item =>
      item.producto.id === idProducto
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );
    this.itemsSubject.next(itemsActualizados);
  }

  /** Incrementa en 1 la cantidad de un producto del carrito. */
  incrementarCantidad(idProducto: number): void {
    const item = this.itemsSubject.getValue().find(i => i.producto.id === idProducto);
    if (item) {
      this.cambiarCantidad(idProducto, item.cantidad + 1);
    }
  }

  /** Decrementa en 1 la cantidad de un producto del carrito (elimina si llega a 0). */
  decrementarCantidad(idProducto: number): void {
    const item = this.itemsSubject.getValue().find(i => i.producto.id === idProducto);
    if (item) {
      this.cambiarCantidad(idProducto, item.cantidad - 1);
    }
  }

  /** Elimina por completo un producto del carrito. */
  eliminarProducto(idProducto: number): void {
    const itemsActuales = this.itemsSubject.getValue();
    const itemsActualizados = itemsActuales.filter(item => item.producto.id !== idProducto);
    this.itemsSubject.next(itemsActualizados);
  }

  /** Vacía completamente el carrito. */
  vaciarCarrito(): void {
    this.itemsSubject.next([]);
  }

  /** Devuelve una copia del valor actual del carrito de forma síncrona (uso puntual, no reactivo). */
  obtenerItemsActuales(): ItemCarrito[] {
    return this.itemsSubject.getValue();
  }

  /** Calcula el total general del carrito (suma de precio * cantidad de todos los items). */
  calcularTotal(items: ItemCarrito[]): number {
    return items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}
